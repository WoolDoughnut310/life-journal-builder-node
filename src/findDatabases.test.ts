import findDatabases from './findDatabases';
import { Client } from '@notionhq/client';

describe('retrieves database IDs from a workspace', () => {
    let notion: Client;
    const names = ['Weeks', 'Months', 'Quarters', 'Years'];
    const createDBMock = (title: string) => ({
        id: `db-${title.toLowerCase()}`,
        title: [{ plain_text: title }]
    });

    beforeEach(() => {
        notion = new Client();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('resolves with correct DB IDs', async () => {
        notion.search.mockResolvedValueOnce({
            results: [...names.map(createDBMock), createDBMock('Houses'), createDBMock('School')]
        });

        const returned = await findDatabases();

        expect(returned).toEqual(
            Object.fromEntries(names.map((name) => [name.toLowerCase(), `db-${name.toLowerCase()}`]))
        );
    });

    it('throws with insufficient databases', async () => {
        notion.search.mockResolvedValueOnce({
            results: [createDBMock('Months')]
        });

        await expect(() => findDatabases()).rejects.toThrowError();
    });
});
