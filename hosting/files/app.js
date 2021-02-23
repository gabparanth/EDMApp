const STITCH_APP_ID = 'edmapp-cyexg';
const client = stitch.Stitch.initializeDefaultAppClient(STITCH_APP_ID);


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

function TestCheckAuth(){
    checkAuth(function (isAuthenticated) {
        client.callFunction('toto', []).then((result) => {
            callback(result);
            console.log(result);
        });
    });
}


TestCheckAuth();

// function getFiles(callback) {
//     client.callFunction('toto', []).then((files) => {
//         console.log(files);
//         callback(files);
//     });
// }