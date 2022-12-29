const { S3 } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const fs = require("fs");

const s3 = new S3({
  endpoint: "https://endpoint.4everland.co",
  signatureVersion: "v4",
  credentials: {
    accessKeyId: "",
    secretAccessKey: "",
  },
  region: "us-west-2",
});

const pinFile = async (filename, chess) => {
  try {
    const readableStreamForFile = await fs.createReadStream(
      `./images/${filename}.png`
    );
    const params = {
      Bucket: "a-love-letter-to-kasparov",
      Key: filename.toString(),
      Body: readableStreamForFile,
      ContentType: "image/png",
    };

    const task = new Upload({
      client: s3,
      queueSize: 3, // 3 MiB
      params,
    });

    task.on("httpUploadProgress", (e) => {
      const progress = ((e.loaded / e.total) * 100) | 0;
      console.log(progress, e);
    });
    await task.done();

    const data = await s3.headObject({
      Bucket: "a-love-letter-to-kasparov",
      Key: filename.toString(),
    });

    const headers = chess.header();
    const nftJson = {
      Name: `#${filename} - ${headers.White} vs ${headers.Black}`,
      image: `ipfs://${data.Metadata["ipfs-hash"]}`,
      attributes: [
        { value: headers.White, trait_type: "White" },
        { value: headers.Black, trait_type: "Black" },
        { value: headers.Result, trait_type: "Result" },
        { value: headers.Date, trait_type: "Date" },
        { value: headers.Event, trait_type: "Event" },
      ],
    };
    const finalNFT = JSON.stringify(nftJson);
    await fs.writeFileSync(`./chess-art/${filename}`, finalNFT);
  } catch (err) {
    console.log(err);
  }
};

module.exports = pinFile;
