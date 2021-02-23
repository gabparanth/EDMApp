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
        console.log(files);
        callback(files);
    });
});
}

function printList(files) {



    var table = document.getElementById('fileList');

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

    files.forEach((file) => {
        var row = document.createElement('tr');
        row.setAttribute('class', 'table-body');
        // var tblUser = document.createElement('td');
        var tblName = document.createElement('td');
        var tblOwner = document.createElement('td');
        // var tblDelete = document.createElement('td');
        // var tblWhitelisted = document.createElement('td');

        // var tblStatus = document.createElement('td');
        // var tblEditconfiguration = document.createElement('td');

        // tblUser.innerHTML = cluster.email;
        tblName.innerHTML = file.fileName;
        tblOwner.innerHTML = file.owner;
        // tblStatus.innerHTML = cluster.whitelistingPolicy;
        // tblWhitelisted.innerHTML = cluster.pausedCluster;

        // var editConfigurationButton = document.createElement('button');
        // editConfigurationButton.innerHTML = "..."
        // editConfigurationButton.setAttribute('onclick', `editConfiguration('${cluster._id}','${cluster.project_name}','${cluster.cluster_name}','${cluster.whitelistingPolicy}')`);
        // editConfigurationButton.setAttribute('class', 'three-dot-button');
        // tblEditconfiguration.appendChild(editConfigurationButton);

        // row.appendChild(tblUser);
        row.appendChild(tblName);
        row.appendChild(tblOwner);
        // row.appendChild(tblStatus);
        // row.appendChild(tblEditconfiguration);

        table.appendChild(row);
    });
}



getFiles(function (files) {
    printList(files);
}); 


function dropHandler(ev) {
    console.log('File(s) dropped');
  
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  
    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (var i = 0; i < ev.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (ev.dataTransfer.items[i].kind === 'file') {
          var file = ev.dataTransfer.items[i].getAsFile();
          console.log('... file[' + i + '].name = ' + file.name);
          client.callFunction('pushFile', [file]).then((file) => {
            console.log(file);
            callback(file);
        });
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (var i = 0; i < ev.dataTransfer.files.length; i++) {
        console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
      }
    }
  }