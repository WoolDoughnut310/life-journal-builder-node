export function retrieveImage(name?: string) {
    if (!name) return '';

    const accessGrant = process.env.STORJ_ACCESS_GRANT as string;
    const bucketName = process.env.STORJ_BUCKET_NAME as string;
    return `https://link.storjshare.io/raw/${accessGrant}/${bucketName}/${name}.png`;
}
