
/*********************************************************/
/*Setup: Connect to Box Account, confirm token is active*/
/*******************************************************/

var BoxSDK = require('box-node-sdk');

// Initialize the SDK with your app credentials
var sdk = new BoxSDK({
    clientID: '7x3kazshqxgq7wbj1vw7e39lz9nxpn52',
    clientSecret: 'HZ8LNoYXcJ2QzLdFUUUsvnTu2GKQvDMU'
});

var client = BoxSDK.getBasicClient('OWrqI60ybDX2ciGNQqoNJ7LRNsmYusCq');

client.users.get(client.CURRENT_USER_ID)
    .then(user => console.log('Hello', user.name, '! Your Token has not expired.', '\n'))
    .catch(err => console.log('Got an error!', err));

/* Quandl Info */
//https://blog.quandl.com/api-for-interest-rate-data
//Quandl API Key = cD1gHE9FAux1DyAiQR-A
//https://www.quandl.com/api/v3/datasets/FRED/DTB3.json?api_key=cD1gHE9FAux1DyAiQR-A

const url_rate = 'https://www.quandl.com/api/v3/datasets/FRED/DTB3.json?api_key=cD1gHE9FAux1DyAiQR-A'

/******************************************************/
/*Connects to Quandl API and writes Data to text file*/
/****************************************************/

function write() {
    const got = require('got');

    got(url_rate, { json: true }).then(response => {
        console.log('Data Received...')
        console.log(' *' + response.body.dataset.name + '*');
        console.log('  Last Entry: ' + response.body.dataset.data[0][0]);
        console.log('  Rate: ' + response.body.dataset.data[0][1])
        console.log('\n')
        let fs = require('fs');
        let date = response.body.dataset.data[0][0];
        x = date.replace(/\-/g, '/');
        let rate = response.body.dataset.data[0][1];

        fs.appendFile('./reports/US3MTBill.txt', '\n' + x + ' ' + rate, (err) => {

            console.log('File Appended...');
        });

    }).catch(error => {
        console.log("error");
    });
}

/*********************************************/
/*Uploads the text file to Box using the API*/
/*******************************************/

function upload() {
    console.log("Upload Method Called...")
    //file id = 557093287867
    //folder id = 92960112130
    //** upload file **
    var url_box = 'https://api.box.com/2.0/files/:557093287867'

    var fs = require('fs');
    var stream = fs.createReadStream('./reports/US3MTBill.txt');
    var folderID = '92960112130'
    client.files.uploadFile(folderID, 'US3MTBill.txt', stream)
        .then(file => {
            console.log('Successfully Uploaded File')
            /* file -> {
                total_count: 1,
                entries: 
                [ { type: 'file',
                    id: '11111',
                    file_version: 
                        { type: 'file_version',
                        id: '22222',
                        sha1: '0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33' },
                    sequence_id: '0',
                    etag: '0',
                    sha1: '0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33',
                    name: 'My File.pdf',
                    description: '',
                    size: 68431,
                    path_collection: 
                        { total_count: 1,
                        entries: 
                        [ { type: 'folder',
                            id: '0',
                            sequence_id: null,
                            etag: null,
                            name: 'All Files' } ] },
                    created_at: '2017-05-16T15:18:02-07:00',
                    modified_at: '2017-05-16T15:18:02-07:00',
                    trashed_at: null,
                    purged_at: null,
                    content_created_at: '2017-05-16T15:18:02-07:00',
                    content_modified_at: '2017-05-16T15:18:02-07:00',
                    created_by: 
                        { type: 'user',
                        id: '33333',
                        name: 'Test User',
                        login: 'test@example.com' },
                    modified_by: 
                        { type: 'user',
                        id: '33333',
                        name: 'Test User',
                        login: 'test@example.com' },
                    owned_by: 
                        { type: 'user',
                        id: '33333',
                        name: 'Test User',
                        login: 'test@example.com' },
                    shared_link: null,
                    parent: 
                        { type: 'folder',
                        id: '0',
                        sequence_id: null,
                        etag: null,
                        name: 'All Files' }
                    item_status: 'active' } ] }
            */
        }).catch(error => {
            console.log("error");
        });

}

//Execute script
write();
setTimeout(upload, 2000);
