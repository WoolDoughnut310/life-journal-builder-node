import { Client, LogLevel } from '@notionhq/client'
import createWeekPages from './weeks'
import createMonthPages from './months'
import createQuarterPages from './quarters'
import createYearPage from './year'
import type { PartialPageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import type { DatabaseIDs } from './findDatabases';
import findDatabases from './findDatabases'

export type OutputType = [
    () => Promise<string[]>,
    () => Promise<string[]>,
    () => Promise<string[]>,
    (weekIds: string[]) => Promise<string[]>
];

const extractIds = (pages: (PartialPageObjectResponse | undefined)[]) =>
    (pages.filter((page) => page !== undefined) as PartialPageObjectResponse[]).map(
        (page) => page.id
    );

const initialiseMainStages = (notion: Client, databaseIds: DatabaseIDs): OutputType => [
    () => createWeekPages(notion, databaseIds.weeks, { skip: 0, take: 18 }).then(extractIds),
    () => createWeekPages(notion, databaseIds.weeks, { skip: 18, take: 17 }).then(extractIds),
    () => createWeekPages(notion, databaseIds.weeks, { skip: 35, take: 17 }).then(extractIds),
    async (weekIds: string[]) => {
        const monthIds = extractIds(await createMonthPages(notion, databaseIds.months, weekIds));
        const quarterIds = extractIds(await createQuarterPages(notion, databaseIds.quarters, monthIds));
        const page = await createYearPage(notion, databaseIds.years, quarterIds);
        return extractIds([page]);
    }
];

export default async function main() {
    global.notion = new Client({
        auth: process.env.NOTION_TOKEN,
        logLevel: LogLevel.INFO,
        timeoutMs: 600_000
    })

    const databaseIds = await findDatabases(notion)
    const mainStages = initialiseMainStages(notion, databaseIds);

    const weekIds = [];

    weekIds.push(...(await mainStages[0]()) ?? []);
    weekIds.push(...(await mainStages[1]()) ?? []);
    weekIds.push(...(await mainStages[2]()) ?? []);
    await mainStages[3](weekIds);
}
