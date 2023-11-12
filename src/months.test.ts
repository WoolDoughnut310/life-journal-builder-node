import createMonthPages from './months';

test('creates a page for April 2025 with the correct cover image', async () => {
    const weekIds = new Array(52).fill(0).map((_, i) => `x2025-w${i + 1}x`);
    const parentId = 'month-db';

    await createMonthPages(notion, parentId, weekIds);

    const accessGrant = process.env.STORJ_ACCESS_GRANT as string;
    const bucketName = process.env.STORJ_BUCKET_NAME as string;

    expect(notion.pages.create).toHaveBeenCalledWith({
        cover: {
            type: 'external',
            external: {
                url: `https://link.storjshare.io/raw/${accessGrant}/${bucketName}/april.png`
            }
        },
        parent: {
            type: 'database_id',
            database_id: parentId
        },
        properties: {
            Month: { title: [{ text: { content: '2025-04' } }] },
            Dates: {
                date: {
                    start: '2025-04-01',
                    end: '2025-04-30'
                }
            },
            Weeks: {
                relation: [15, 16, 17, 18].map((id) => ({
                    id: `x2025-w${id}x`
                }))
            }
        }
    });
});

