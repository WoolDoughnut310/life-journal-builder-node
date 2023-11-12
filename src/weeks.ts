import { getDateRanges, createTimeRangePages } from './utils/date';
import endOfWeek from 'date-fns/endOfWeek/index.js';
import type { Client } from '@notionhq/client';

function getWeekRanges() {
    return getDateRanges(endOfWeek, 52, { weekStartsOn: 1 });
}

export default function createWeekPages(
    notion: Client,
    databaseId: string,
) {
    return createTimeRangePages(notion, 'Week', {
        getDateRanges: getWeekRanges,
        getTitle: (year: string, i: number) => `${year}-W${i.toString().padStart(2, '0')}`,
        databaseId,
        dateRangeField: 'Dates'
    });
}

