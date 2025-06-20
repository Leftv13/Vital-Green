const PAGE_URL = process.env.NODE_ENV === 'production'
    ? ''
    : process.env.LOCAL_URL;


    //Windows endpoint = http://localhost:3000
    //Mac endpoint =  http://127.0.0.1:3000

  const MONGO_URI = process.env.NODE_ENV === 'production'
      ? process.env.MONGO_URI_PROD
      : process.env.MONGO_URI_TEST

 module.exports = {PAGE_URL, MONGO_URI} ;