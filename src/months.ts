import { getDateRanges, createTimeRangePages } from './utils/date';
import endOfMonth from 'date-fns/endOfMonth/index.js';
import format from 'date-fns/format/index.js';
import addMonths from 'date-fns/addMonths/index.js';
import getWeek from 'date-fns/getWeek/index.js';
import nextMonday from 'date-fns/nextMonday/index.js';
import isMonday from 'date-fns/isMonday/index.js';
import type { Client } from '@notionhq/client';

function getMonthRanges() {
    return getDateRanges(endOfMonth, 12);
}

function getMonthName(i: number) {
    return format(addMonths(new Date('1 Jan'), i - 1), 'MMMM').toLowerCase();
}

// Get the range of 0-indexed week numbers that are in
// a given month for a given year
function getWeekSelection(year: number, i: number): [number, number] {
    let start = addMonths(new Date(`1 Jan ${year}`), i);
    const end = endOfMonth(start);

    // A month only includes a certain week if the Monday of
    // the week is in the month
    // e.g. The first week in March 2025 is week 10, despite
    // March 1st being in week 9
    if (!isMonday(start)) {
        start = nextMonday(start);
    }

    let endWeek = getWeek(end, { weekStartsOn: 1 });

    if (endWeek === 1) {
        // The year can't end on the 1st week.
        // `1` means the 1st week of the new year, and
        // we can't slice [48:1] as the result would be empty
        endWeek = 52;
    }

    // e.g. `getWeek(start) = 1`, so week 1 - first week of year
    // but adding {weekStartsOn: 1} makes it week 2 - 2nd week
    // Subtract 2 from start week for 0-based index

    // `getWeek(end) = 5`, so week 5 - fifth week of year
    // again, adding weekStartsOn makes this now 6
    // Subtract only 1 from end week for 0-based index, which
    // allows for slicing a range (i.e. [0,1,2,3,4]) being 5 weeks
    return [getWeek(start, { weekStartsOn: 1 }) - 2, endWeek - 1];
}

export default function createMonthPages(notion: Client, databaseId: string, weekIds: string[]) {
    return createTimeRangePages(notion, 'Month', {
        getDateRanges: getMonthRanges,
        getImageName: (i: number) => getMonthName(i),
        getTitle: (year: string, i: number) => `${year}-${i.toString().padStart(2, '0')}`,
        databaseId,
        dateRangeField: 'Dates',
        relations: {
            name: 'Weeks',
            ids: weekIds,
            getSelection: getWeekSelection
        }
    });
}

