import { getDateRanges, createTimeRangePages } from './utils/date';
import endOfQuarter from 'date-fns/endOfQuarter/index.js';
import quartersToMonths from 'date-fns/quartersToMonths/index.js';
import type { Client } from '@notionhq/client';

function getQuarterRanges() {
    return getDateRanges(endOfQuarter, 4);
}

function getMonthSelection(_: number, i: number): [number, number] {
    return [quartersToMonths(i), quartersToMonths(i + 1)];
}

export default function createQuarterPages(notion: Client, databaseId: string, monthIds: string[]) {
    return createTimeRangePages(notion, 'Quarter', {
        getDateRanges: getQuarterRanges,
        getImageName: (i: number) => `q${i}`,
        getTitle: (year: string, i: number) => `${year}-Q${i}`,
        databaseId,
        dateRangeField: 'Date Range',
        relations: {
            name: 'Months',
            ids: monthIds,
            getSelection: getMonthSelection
        }
    });
}

