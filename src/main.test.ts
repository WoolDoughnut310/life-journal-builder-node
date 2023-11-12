import main from './main'
import { Client } from '@notionhq/client'

test('initialises a Notion API client and creates the correct number of pages', async () => {
    await main()

    expect(Client).toHaveBeenCalledWith({ auth: process.env.NOTION_TOKEN })
    expect(notion.pages.create).toHaveBeenCalledTimes(52 + 12 + 4 + 1)
})
