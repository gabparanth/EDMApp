const STITCH_APP_ID = 'edmapp-cyexg';
const client = stitch.Stitch.initializeDefaultAppClient(STITCH_APP_ID);


// auth anonymously for testing only 

function checkAuth(callback) {
    client.auth
      .loginWithCredential(new stitch.AnonymousCredential())
      .then((user) => {
        callback(true);
      });
  }


function s3upload() {
    var files = document.getElementById('fileUpload').files;
    if (files) 
    {

        var file = files[0];
        var fileName = file.name;

        checkAuth(function (isAuthenticated) {
            client.callFunction('uploadFileToS3', [file, fileName ]).then(() => {
        
            console.log("I'm in");
        
            });
        });



    //   var file = files[0];
    //   var fileName = file.name;
    //   var filePath = 'my-first-bucket-path/' + fileName;
    //   var fileUrl = 'https://' + bucketRegion + '.amazonaws.com/my-    first-bucket/' +  filePath;
    //   s3.upload({
    //      Key: filePath,
    //      Body: file,
    //      ACL: 'public-read'
    //      }, function(err, data) {
    //      if(err) {
    //      reject('error');
    //      }
    //      alert('Successfully Uploaded!');
    //      }).on('httpUploadProgress', function (progress) {
    //      var uploaded = parseInt((progress.loaded * 100) / progress.total);
    //      $("progress").attr('value', uploaded);
    //    });
    }
 };

function uploadFile(file, i) {
    
    checkAuth(function (isAuthenticated) {
    client.callFunction('uploadFileToS3', [file, "afileName", "aType"]).then(() => {

    console.log("I'm in")

  formData.append('upload_preset', 'ujpu6gyk')
  formData.append('file', file)
    });
});
}

// function uploadFile(file, i) {
// //   var url = 'https://api.cloudinary.com/v1_1/joezimim007/image/upload'
//   var xhr = new XMLHttpRequest()
//   var formData = new FormData()
//   xhr.open('POST', url, true)
//   xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

//   // Update progress (can be used to show progress indicator)
//   xhr.upload.addEventListener("progress", function(e) {
//     updateProgress(i, (e.loaded * 100.0 / e.total) || 100)
//   })

//   xhr.addEventListener('readystatechange', function(e) {
//     if (xhr.readyState == 4 && xhr.status == 200) {
//       updateProgress(i, 100) // <- Add this
//     }
//     else if (xhr.readyState == 4 && xhr.status != 200) {
//       // Error. Inform the user
//     }
//   })

//   formData.append('upload_preset', 'ujpu6gyk')
//   formData.append('file', file)
//   xhr.send(formData)
// }