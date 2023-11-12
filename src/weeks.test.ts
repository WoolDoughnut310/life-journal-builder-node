import createWeekPages from './weeks';

it('creates a page for Week 29 of 2025', async () => {
    const parentId = 'week-db';

    await createWeekPages(notion, parentId);

    expect(notion.pages.create).toHaveBeenCalledWith({
        parent: {
            type: 'database_id',
            database_id: parentId
        },
        properties: {
            Week: { title: [{ text: { content: '2025-W29' } }] },
            Dates: {
                date: {
                    start: '2025-07-14',
                    end: '2025-07-20'
                }
            }
        }
    });
});

