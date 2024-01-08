require('dotenv').config();
const express = require('express');
const cors = require('cors');
const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1'
});

const app = express();
const s3 = new AWS.S3();

// CORS configuration

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
};

  // testing for mobile environment:

  // const corsOptions = {
  //   origin: 'ip:port',
  //   optionsSuccessStatus: 200
  // };

app.use(cors(corsOptions));
app.use(express.json());

const port = 3001;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));


// root endpoint

app.get('/', (req, res) => res.send('Backend Service is Running'));

// endpoint for making pre-signed url

app.get('/generate-presigned-url', (req, res) => {
  const params = {
    Bucket: 'aws-profileimage-upload',
    Key: req.query.fileName,
    Expires: 60,
    ContentType: req.query.fileType
  };

  s3.getSignedUrl('putObject', params, (err, url) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Error generating URL');
    }
    res.send({ url });
  });
});

// deletes images

app.get('/delete-image', (req, res) => {

  const fileName = req.query.fileName;
  const deleteParams = {
    Bucket: 'aws-profileimage-upload',
    Key: fileName

  };

  s3.deleteObject(deleteParams, (err, data) => {

    if (err) {
      console.log('Error deleting image:', err);
      return res.status(500).send('Error deleting image');
    }
    res.send({ message: 'Image deleted successfully' });
  });

});