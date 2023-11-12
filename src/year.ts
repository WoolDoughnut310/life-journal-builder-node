import { getCurrentYear } from './utils/date';
import { retrieveImage } from './utils/images';
import { createPage } from './utils/notion';
import type { Client } from '@notionhq/client';

export default async function createYearPage(
    notion: Client,
    databaseId: string,
    quarterIds: string[]
) {
    const year = getCurrentYear().toString();
    const coverImage = retrieveImage(year);

    return notion.pages.create(
        createPage('Year', year, coverImage, databaseId, {
            Quarters: quarterIds
        })
    );
}

