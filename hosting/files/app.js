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

// auth anonymously

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