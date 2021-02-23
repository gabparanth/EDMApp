const STITCH_APP_ID = 'edmapp-cyexg';
const client = stitch.Stitch.initializeDefaultAppClient(STITCH_APP_ID);

// auth with google 

function checkAuth(callback) {
    if (!client.auth.isLoggedIn) {
        if (client.auth.hasRedirectResult()) {
            client.auth.handleRedirectResult().then(user => {
                callback(true);
            });
        } else {
            const credential = new stitch.GoogleRedirectCredential();
            client.auth.loginWithRedirect(credential);
        }
    } else {
        callback(true);
    }

}


// auth anonymously for testing only 

// function checkAuth(callback) {
//     client.auth
//       .loginWithCredential(new stitch.AnonymousCredential())
//       .then((user) => {
//         callback(true);
//       });
//   }


function getFiles(callback) {
    checkAuth(function (isAuthenticated) {
    client.callFunction('toto', []).then((files) => {
        console.log(client);
        console.log(files);
        callback(files);
    });
});
}

function printList(files) {

    var table = document.getElementById('filesList');
/*
    table.innerHTML = `<tr class=table-body>
    <td>
      File Name
    </td>
    <td>
      File owner
    </td>
    <td>
    Status
    </td>
    <td>
    Edit configuration
    </td>
    <td>s
              
    </td>
  </tr>`;
  */

    files.forEach((file) => {
        var row = document.createElement('tr');
        row.setAttribute('class', 'table-body');
        // var tblUser = document.createElement('td');
        var tblId = document.createElement('td');
        var tblThumbnail = document.createElement('td');
        var tblName = document.createElement('td');
        var tblOwner = document.createElement('td');
        var tblUrl = document.createElement('td');
        var tblDownlad = document.createElement('td');
        // var tblDelete = document.createElement('td');
        // var tblWhitelisted = document.createElement('td');

        // var tblStatus = document.createElement('td');
        // var tblEditconfiguration = document.createElement('td');

        // tblUser.innerHTML = cluster.email;
        //var mime_type = file.type;
        
        switch (file.type) {
            case 'jpg':
                tblThumbnail.innerHTML = '<img src="' + file.url + '" style="height:50px;">';
                break;
            case 'png':
                tblThumbnail.innerHTML = '<img src="' + file.url + '" style="height:50px;">';
                break;
            case 'jpeg':
                tblThumbnail.innerHTML = '<img src="' + file.url + '" style="height:50px;">';
                break;
            case 'gif':
                tblThumbnail.innerHTML = '<img src="' + file.url + '" style="height:50px;">';
                break;
            case 'pdf':
                tblThumbnail.innerHTML = '<img src="img/pdf_icon.png" style="width:32px;">';
                break;
            case 'doc':
                tblThumbnail.innerHTML = '<img src="img/msword_icon.png" style="width:32px;">';
                break;
            default:
                tblThumbnail.innerHTML = '<img src="img/generic_file_icon.png" style="width:32px;">';
        }
        
        tblId.innerHTML = file._id;
        //tblThumbnail.innerHTML = file.type;
        tblName.innerHTML = file.fileName;
        tblOwner.innerHTML = file.owner;
        tblUrl.innerHTML = file.url;
        tblDownlad.innerHTML = '<a download="' + file.fileName + '" href="' + file.url + '" title="Download"><img src="img/download_icon.png" style="width:32px"></a>';
        // tblStatus.innerHTML = cluster.whitelistingPolicy;
        // tblWhitelisted.innerHTML = cluster.pausedCluster;

        // var editConfigurationButton = document.createElement('button');
        // editConfigurationButton.innerHTML = "..."
        // editConfigurationButton.setAttribute('onclick', `editConfiguration('${cluster._id}','${cluster.project_name}','${cluster.cluster_name}','${cluster.whitelistingPolicy}')`);
        // editConfigurationButton.setAttribute('class', 'three-dot-button');
        // tblEditconfiguration.appendChild(editConfigurationButton);

        // row.appendChild(tblUser);
        row.appendChild(tblId);
        row.appendChild(tblThumbnail);
        row.appendChild(tblName);
        row.appendChild(tblOwner);
        row.appendChild(tblUrl);
        row.appendChild(tblDownlad);
        // row.appendChild(tblStatus);
        // row.appendChild(tblEditconfiguration);

        table.appendChild(row);
    });
}



getFiles(function (files) {
    printList(files);
});

/*
function getFiles_hj(callback) {
  checkAuth(function (isAuthenticated) {
    client.callFunction('toto', []).then((files) => {
      callback(files);
    });
  });
}
*/
/*
getFiles_hj(function (files) {
  return files;
});
*/
function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
        if ((encoded.length % 4) > 0) {
          encoded += '='.repeat(4 - (encoded.length % 4));
        }
        resolve(encoded);
      };
      reader.onerror = error => reject(error);
    });
  }



function s3upload() {
    var files = document.getElementById('fileUpload').files;
    if (files) 
    {

        var file = files[0];
        var fileName = file.name;

        const reader = new FileReader();
        reader.onloadend = () => {
          // use a regex to remove data url part
          const base64String = reader.result
            .replace("data:", "")
            .replace(/^.+,/, "");
    
          // log to console
          // logs wL2dvYWwgbW9yZ...
        //   console.log(base64String);
          checkAuth(function (isAuthenticated) {
            client.callFunction('uploadFileToS3', [base64String, fileName ]).then((base64String) => {
            
            console.log("I'm in");
            console.log(base64String)
        
            });


    });

        };
        
        reader.readAsDataURL(file);


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
