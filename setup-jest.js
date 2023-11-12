const { Client } = require("@notionhq/client");
// const S3 = require("aws-sdk/clients/s3");

const dotenv = require('dotenv');

dotenv.config({ path: './.env' })

jest.spyOn(process, 'exit').mockImplementation(jest.fn());

// global.getSignedUrlMock = jest.mock("@aws-sdk/s3-request-presigner", () => {
//     return {
//         getSignedUrl: jest.fn((client, command) => {
//             return `${image}-`
//         }
//     }
// })
// global.getSignedUrlMock = jest
//     .spyOn(S3.prototype, "getSignedUrl")
//     .mockImplementation((op, params) => {
//         if (op !== "getObject") return;
//         return `image-${params.Key}`;
//     })

const mockCreatePage = jest.fn(() => {
    return Promise.resolve({id: Math.round(Math.random() * 100)});
});

jest.mock("@notionhq/client", () => {
    return {
        __esModule: true,
        Client: jest.fn().mockImplementation(() => {
            return {pages: {create: mockCreatePage}}
        })
    }
});

beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("20 Aug 2025"));
    global.notion = new Client({auth: ""});})

afterAll(() => {
    jest.useRealTimers()
});

beforeEach(() => {
    Client.mockClear();
})
