import { endOfMonth, endOfWeek } from 'date-fns';
import { formatDate, getDateRanges } from './date';

test('formats the Date object for 2025/07/29', () => {
    const date = new Date('2025/07/29');
    expect(formatDate(date)).toBe('2025-07-29');
});

test('skips a certain number of ranges', () => {
    const dateRanges = getDateRanges(endOfMonth, 12, {}, { skip: 5, take: 7 });

    expect(dateRanges).toHaveLength(12);
    expect(dateRanges.slice(0, 5).every((value) => value === undefined)).toBe(true);
    expect(dateRanges[5]).toEqual({
        start: '2025-06-01',
        end: '2025-06-30'
    });
});

test("skips certain number of ranges, but doesn't stop at the end of the limit", () => {
    const dateRanges = getDateRanges(endOfWeek, 52, { weekStartsOn: 1 }, { skip: 10, take: 19 });

    expect(dateRanges).toHaveLength(29);
    expect(dateRanges.slice(0, 10).every((value) => value === undefined)).toBe(true);
    expect(dateRanges[10]).toEqual({
        start: '2025-03-10',
        end: '2025-03-16'
    });
});
