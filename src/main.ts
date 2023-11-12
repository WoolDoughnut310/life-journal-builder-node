import { Client, LogLevel } from '@notionhq/client'
import createWeekPages from './weeks'
import createMonthPages from './months'
import createQuarterPages from './quarters'
import createYearPage from './year'
import type { PartialPageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
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


export default async function main() {
    const notion = new Client({
        auth: process.env.NOTION_TOKEN,
        logLevel: LogLevel.INFO,
        timeoutMs: 600_000
    })

    const databaseIds = await findDatabases(notion)

    const weekIds = extractIds(await createWeekPages(notion, databaseIds.weeks));
    const monthIds = extractIds(await createMonthPages(notion, databaseIds.months, weekIds));
    const quarterIds = extractIds(await createQuarterPages(notion, databaseIds.quarters, monthIds));
    await createYearPage(notion, databaseIds.years, quarterIds);
}
