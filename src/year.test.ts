import createYearPage from './year';

test('creates a page for 2025 with the correct cover image', async () => {
    const quarterIds = new Array(4).fill(0).map((_, i) => `xq${i + 1}x`); // e.g. xq2x
    const parentId = 'year-db';

    await createYearPage(notion, parentId, quarterIds);

    const accessGrant = process.env.STORJ_ACCESS_GRANT as string;
    const bucketName = process.env.STORJ_BUCKET_NAME as string;

    expect(notion.pages.create).toHaveBeenCalledWith({
        cover: {
            type: 'external',
            external: {
                url: `https://link.storjshare.io/raw/${accessGrant}/${bucketName}/2025.png`
            }
        },
        parent: {
            type: 'database_id',
            database_id: parentId
        },
        properties: {
            Year: { title: [{ text: { content: '2025' } }] },
            Quarters: { relation: quarterIds.map((id) => ({ id })) }
        }
    });
});

