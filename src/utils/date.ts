import getYear from 'date-fns/getYear/index.js';
import addDays from 'date-fns/addDays/index.js';
import format from 'date-fns/format/index.js';
import { retrieveImage } from './images';
import { createPage } from './notion';
import type { Client } from '@notionhq/client';
import nextMonday from 'date-fns/nextMonday/index.js';
import isMonday from 'date-fns/isMonday/index.js';

interface DateRange {
    start: string;
    end: string;
}

export interface Pagination {
    skip: number;
    take: number;
}

interface Options {
    getDateRanges: () => (DateRange | undefined)[];
    getImageName?: (i: number) => string;
    getTitle: (year: string, i: number) => string;
    databaseId: string;
    dateRangeField: string;
    relations?: {
        name: string;
        ids: string[];
        // 0-indexed
        getSelection: (year: number, i: number) => [number, number];
    };
}

export function formatDate(date: Date) {
    return format(date, 'yyyy-MM-dd');
}

export function getCurrentYear() {
    return getYear(new Date());
}

// Return the date range for n weeks/months/quarters/years,
// dictated by the endOfFunction (so there could be endOfMonth, e.g.)
export function getDateRanges(
    endOfFunction: (date: Date, params?: { [key: string]: number }) => Date,
    n: number,
    params: { [key: string]: number } = {},
) {
    const year = getCurrentYear();
    const ranges: (DateRange | undefined)[] = [];

    let start = new Date(`1 Jan ${year}`);

    if (params.weekStartsOn && !isMonday(start)) {
        // The start of a week MUST be a Monday
        start = nextMonday(start);
    }


    for (let i = 0; i < n; i++) {
        const end = endOfFunction(start, params);

        ranges.push(
            {
                start: formatDate(start),
                end: formatDate(end)
            }
        );

        start = addDays(end, 1);
    }

    return ranges;
}

// Create a Notion page for each date range,
// set with title, coverImage, relations?,
// for the given type of object
export async function createTimeRangePages(notion: Client, type: string, options: Options) {
    const year = getCurrentYear();
    const dateRanges = options.getDateRanges();

    return Promise.all(
        dateRanges.map(async (dateRange, i) => {
            if (!dateRange) return Promise.resolve(undefined);
            console.log(`creating ${type} ${i} in range ${dateRange.start} -> ${dateRange.end}`);

            const coverImage = retrieveImage(options.getImageName?.(i + 1));
            let relationsOutput: { [key: string]: string[] } = {};

            if (options.relations) {
                relationsOutput = {
                    [options.relations.name]: options.relations.ids.slice(
                        ...options.relations.getSelection(year, i)
                    )
                };
            }

            const response = await notion.pages.create(
                createPage(type, options.getTitle(year.toString(), i + 1), coverImage, options.databaseId, {
                    [options.dateRangeField]: dateRange,
                    ...(options.relations ? relationsOutput : {})
                })
            );

            return response;
        })
    );
}
