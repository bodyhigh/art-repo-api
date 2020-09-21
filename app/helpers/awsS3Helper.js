import AWS from 'aws-sdk';
import fs from 'fs'
import fsHelper from './fsHelper';
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
        const s3 = ConfigureS3();
        const uriFileName = encodeURIComponent(`${file.filename}_${file.originalname}`);
        // const uriFileName = encodeURIComponent(file.originalname);
        const uriUserId = encodeURIComponent(userId);
        const userFolderPhotoKey = uriUserId + '/' + uriFileName;
        const filedata = fs.createReadStream(file.path);
    
        var params = {
            Key: userFolderPhotoKey,
            Body: filedata,
            Bucket: config.aws.s3BucketName,
            ACL: 'public-read'
        };
    
        return s3.upload(params).promise();
}

function uploadImageFile(req) {
    return new Promise((resolve, reject) => {
        if (!req.file) resolve(undefined);

        SetupUserFolder(req.identity.id).then((data) => {
            UploadToUserFolder(req.identity.id, req.file).then((fileData) => {
                fsHelper.fsUnlink(req.file.path).then(() => {
                    resolve(fileData);
                }).catch((err) => reject(err));
            }).catch((err) => reject(err));
        }).catch((err) => reject(err));
    });
}

function deleteImagesFromUserFolder(imageRecords) {
    return new Promise((resolve, reject) => {
        console.log(imageRecords.length);

        if (imageRecords.length === 0) return resolve();

        console.log(util.inspect(imageRecords, { colors: true }));

        //TODO: Include some validation so that all keys must include the userid
        var keyList = imageRecords.map(image => { return {Key: image.key} });
        
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

function listUserFolderContents(userId) {
        const s3 = ConfigureS3();
        const bucketName = config.aws.s3BucketName;

        var params = {
            Bucket: config.aws.s3BucketName,
            Prefix: userId
        };

        return s3.listObjectsV2(params).promise();
}

export default { ConfigureS3, SetupUserFolderAsync, SetupUserFolder, UploadToUserFolder, uploadImageFile, deleteImagesFromUserFolder, listUserFolderContents };