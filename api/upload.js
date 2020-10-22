import { v2 as cloudinary } from 'cloudinary'
import multiparty from 'multiparty'

cloudinary.config({
  cloud_name: 'marcelotokarnia',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}


module.exports = allowCors((req, res) => {
  let form = new multiparty.Form();
  form.parse(req, (err, fields, files) => {
      cloudinary.uploader.upload(files.file[0].path, { folder: 'decabecanomato' }, (error, result) => {
        res.setHeader('content-type', 'application/json' );
        res.status(200).end(JSON.stringify({ location: result.url}));
      })    
  });
})
