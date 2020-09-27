import AWS from 'aws-sdk';
import fs from 'fs'
import fsHelper from './fsHelper';
import util from 'util';
import config from '../../config/config';
import sharp from 'sharp';

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

function uploadImagePromise(key, buffer) {
    const s3 = ConfigureS3();

    var params = {
        Key: key,
        Body: buffer,
        Bucket: config.aws.s3BucketName,
        ACL: 'public-read'
    };

    return s3.upload(params).promise();
}

function uploadImagesResized(userId, file) {
    return new Promise((resolve, reject) => {
        if (!file) resolve(undefined);
        if (!userId || userId.length == 0) reject('uploadImageFilePromise: userId is empty');
        
        userId = encodeURIComponent(userId);
        let filename = encodeURIComponent(`${file.filename}_${file.originalname}`);
        let resultData = {};
        const buffer = fs.createReadStream(file.path);
        const hiRezImageKey = `${userId}/images/${filename}`;
        const medRezImageKey = `${userId}/images/med-rez/${filename}`;
        const thumbImageKey = `${userId}/images/thumb/${filename}`;

        uploadImagePromise(hiRezImageKey, buffer)
            .then(hiRezData => {
                resultData.hiRezData = hiRezData;
                return resizeImage(800, file)
            })
            .then(medRezBuffer => {
                return uploadImagePromise(medRezImageKey, medRezBuffer);
            })
            .then(medRezData => {
                resultData.medRezData = medRezData;
                return resizeImage(200, buffer);
            })
            .then(thumbBuffer => {
                return uploadImagePromise(thumbImageKey, thumbBuffer);
            })
            .then(thumbData => {
                resultData.thumbData = thumbData;
                return fsHelper.fsUnlink(file.path);                
            })
            .then(() => resolve(resultData))
            .catch(error => {
                fsHelper.fsUnlink(file.path).then(() => reject(error));
            });
    });
}

function resizeImage(size, file) {
    return sharp(file.path)
            .resize({ height: size })
            .toBuffer();
}

function deleteImagesFromUserFolder(imageRecords) {
    return new Promise((resolve, reject) => {
        if (imageRecords.length === 0) return resolve();

        //TODO: Include some validation so that all keys must include the userid
        var keyList = imageRecords.map(image => { 
            var imageKeys = [{ Key: image.hiRez.key }];

            if (image.medRez && image.medRez.key)
                imageKeys.push({ Key: image.medRez.key });

            if (image.thumbnail && image.thumbnail.key)
                imageKeys.push({ Key: image.thumbnail.key });

            return imageKeys;

        }).flat();        
        
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
        });
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

export default { 
    ConfigureS3, 
    uploadImagesResized,
    deleteImagesFromUserFolder, 
    listUserFolderContents
};