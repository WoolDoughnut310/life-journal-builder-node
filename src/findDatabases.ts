
import type { Client } from '@notionhq/client';
import type { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints';

export interface DatabaseIDs {
    weeks: string;
    months: string;
    quarters: string;
    years: string;
}

export default async function findDatabases(notion: Client) {
    const response = await notion.search({ filter: { property: 'object', value: 'database' } });
    const databaseIds: DatabaseIDs = { weeks: '', months: '', quarters: '', years: '' };

    let title: string;
    let id: string;

    let missing = ['weeks', 'months', 'quarters', 'years'];

    for (const database of response.results as DatabaseObjectResponse[]) {
        title = database.title
            .map((titleObj) => titleObj.plain_text)
            .join('')
            .toLowerCase();
        id = database.id;

        switch (title) {
            case 'weeks':
            case 'months':
            case 'quarters':
            case 'years':
                databaseIds[title] = id;
                missing = missing.filter((val) => val !== title);
                break;
        }
    }

    if (missing.length > 0)
        throw new Error(`missing the following database(s): ${missing.join(', ')}`);

    return databaseIds;
}
