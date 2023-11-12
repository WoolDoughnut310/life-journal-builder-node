const { Resvg } = require("@resvg/resvg-js");
const fs = require("fs/promises");
const process = require("process");
const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");
const getYear = require("date-fns/getYear");

dotenv.config();

const client = new S3Client({
    endpoint: process.env.S3_ENDPOINT,
    region: "eu-west-1",
});

async function main() {
    const year = (getYear(new Date()) + 1).toString();

    const filename = `${year}.png`;
    const firstPart = year.slice(0, 2);
    const lastPart = year.slice(2);

    console.log("Reading original file...");
    let contents = await fs.readFile("./2023.svg");
    contents = contents.toString();

    contents = contents
        .replace(
            `style="stroke-width:0.264583">20`,
            `style="stroke-width:0.264583">${firstPart}`
        )
        .replace(`id="tspan2333">23`, `id="tspan2333">${lastPart}`);

    console.log("Source file edited");

    // convert SVG to PNG buffer
    const resvg = new Resvg(contents, {
        background: "rgb(255, 255, 255)",
    });
    const buffer = resvg.render().asPng();

    console.log("Converted to PNG format");

    // upload to Storj (AWS)
    await client.send(
        new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: filename,
            Body: buffer,
        })
    );

    console.log("Uploaded!");
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });

