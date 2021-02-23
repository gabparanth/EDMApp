exports = function(base64EncodedImage, fileName, fileType) {
    // Convert the base64 encoded image string to a BSON Binary object
    const binaryImageData = BSON.Binary.fromBase64(base64EncodedImage, 0);
    // Instantiate an S3 service client
    const s3Service = context.services.get('S3').s3('eu-west-1');
    // Put the object to S3
    return s3Service.PutObject({
      'Bucket': 'edmapp',
      'Key': fileName,
      'ContentType': 'png',
      'Body': binaryImageData
    })
    .then(putObjectOutput => {
      console.log(putObjectOutput);
      // putObjectOutput: {
      //   ETag: <string>, // The object's S3 entity tag
      // }
      return putObjectOutput
    })
    .catch(console.error);
  };