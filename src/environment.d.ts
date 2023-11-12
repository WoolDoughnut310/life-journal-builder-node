declare global {
    namespace NodeJS {
        interface ProcessEnv {
            STORJ_ACCESS_GRANT: string
            STORJ_BUCKET_NAME: string
            AWS_ACCESS_KEY_ID: string
            AWS_SECRET_ACCESS_KEY: string
            S3_ENDPOINT: string
            NOTION_TOKEN: string
        }
    }
}

export { }
