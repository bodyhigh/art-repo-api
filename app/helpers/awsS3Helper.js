import AWS from 'aws-sdk';
import fs from 'fs'
import util from 'util';
import config from '../../config/config';

function ConfigureS3() {
    // AWS Configuration
    AWS.config.update({
        apiVersion: {
            s3: '2006-03-01'
        },
        accessKeyId: config.aws.accessKeyId,
        secretAccessKey: config.aws.secretAccessKey
    });
    
    return new AWS.S3();
}

async function SetupUserFolderAsync(folderName) {
    return await SetupUserFolder(folderName); 
}

function SetupUserFolder(folderName) {
    return new Promise((resolve, reject) => {
        const s3 = ConfigureS3();
        const bucketName = config.aws.s3BucketName;
        
        if (folderName.length === 0) {
            reject(new Error('folderName cannot be empty'));
        }
    
        var keyFolderName = encodeURIComponent(folderName);
        
        s3.headObject({ Key: keyFolderName, Bucket: bucketName }, (err, data) => {
            if (!err) {
                // User Folder Already Exists
                return resolve({ data: data });
            }
        
            if (err.code !== 'NotFound') {
                return reject(err);
            }
    
            s3.putObject({ Key: keyFolderName, Bucket: bucketName }, (err, data) => {
                if (err) {
                    return reject(err);
                }                
                return resolve(data);
            });
        });
    });
}

function UploadToUserFolder(userId, file) {
    // return new Promise((resolve, reject) => {
        const s3 = ConfigureS3();
        const uriFileName = encodeURIComponent(file.filename);
        const uriUserId = encodeURIComponent(userId);
        const userFolderPhotoKey = uriUserId + '//' + uriFileName;
        const filedata = fs.createReadStream(file.path);
    
        var params = {
            Key: userFolderPhotoKey,
            Body: filedata,
            Bucket: config.aws.s3BucketName,
            ACL: 'public-read'
        };
    
        return s3.upload(params).promise();

        // s3.upload(params)
        // // .on('httpUploadProgress', (evt) => console.log(evt))
        // .send(function(err, data) {
        //     if (err) {
        //         return reject(err);
        //     } else {
        //         return resolve(data);
        //     }
        // });
    // });
}

function DeleteImagesFromUserFolder(userId, imageKeys) {
    return new Promise((resolve, reject) => {
        if (imageKeys.length === 0) resolve();

        var keyList = imageKeys.map(id => { return {Key: id} });

        const s3 = ConfigureS3();
        var params = {
            Bucket: config.aws.s3BucketName,
            Delete: {
                Objects: keyList
            }
        };

        s3.deleteObjects(params, function(err, data) {
            if (err) return reject(err);

            return resolve(data);
        })
    });
}

export default { ConfigureS3, SetupUserFolderAsync, SetupUserFolder, UploadToUserFolder, DeleteImagesFromUserFolder };