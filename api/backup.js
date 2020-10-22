import { v2 as cloudinary } from 'cloudinary'
import multer from 'multer'
import fs from 'fs'

const fileUploader = multer({
  storage: multer.memoryStorage(),
  limits: { files: 1, fileSize: 1024 * 1024 * 1024 },
})

cloudinary.config({
  cloud_name: 'marcelotokarnia',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

module.exports = async (req, res) => {
  if (req.method === "POST") {
      res.writeHead(200, { 'content-type': 'text/plain', 'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Max-Age': 86400,
      });
      const uploadFile = fileUploader.single('file')
      await new Promise(resolve => uploadFile(req, res, resolve))
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'decabecanomato', use_filename: true },
          (error, result) => {
            if (error) {
              resolve(error)
            }
            resolve(result)
          }
        )
        fs.createReadStream(req.file.buffer).pipe(stream)
      })
      res.write('received upload: \n\n');
      return res.end(JSON.stringify({ result }))

    } else {
        return res.end("Send a POST request.");
    }
}
