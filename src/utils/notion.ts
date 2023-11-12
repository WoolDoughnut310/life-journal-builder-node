import type { CreatePageParameters } from '@notionhq/client/build/src/api-endpoints.js';
import { APIErrorCode, ClientErrorCode, isNotionClientError } from '@notionhq/client';

function createCoverImage(
    image?: string
): { type: 'external'; external: { url: string } } | undefined {
    if (!image) return;
    return {
        type: 'external',
        external: {
            url: image
        }
    };
}

function createTitle(title: string) {
    return {
        title: [
            {
                text: {
                    content: title
                }
            }
        ]
    };
}

function createParentRelation(parentId: string): {
    type: 'database_id';
    database_id: string;
} {
    return {
        type: 'database_id',
        database_id: parentId
    };
}

function isDateRange(object: any): object is { start: string; end: string; } {
    return 'start' in object && 'end' in object;
}

function createProperties(props: { [key: string]: any }) {
    return Object.fromEntries(
        Object.entries(props).map(([name, value]) => {
            const key = name;
            const output: { [key: string]: any } = {};

            if (value instanceof Array) {
                output.relation = value.map((id) => ({ id }));
            } else if (isDateRange(value)) {
                output.date = value;
            }

            return [key, output];
        })
    );
}

export function createPage(
    type: string,
    title: string,
    coverImage: string,
    parentId: string,
    props: { [key: string]: any }
): CreatePageParameters {
    return {
        cover: createCoverImage(coverImage),
        parent: createParentRelation(parentId),
        properties: {
            [type]: createTitle(title),
            ...createProperties(props)
        }
    } as any;
}

export function handleNotionError(error: unknown) {
    if (isNotionClientError(error)) {
        switch (error.code) {
            case ClientErrorCode.RequestTimeout:
                throw new Error(error.message);
            case APIErrorCode.ObjectNotFound:
            case APIErrorCode.Unauthorized:
                throw new Error(error.message);
            default:
                break;
        }
    }
}

