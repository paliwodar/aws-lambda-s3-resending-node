var AWS = new require('aws-sdk')
var sender = require('./senders')

var s3 = new AWS.S3();
var bucket = "bucket-name";


exports.handler = function (event, context) {
    console.log("Running...");

    s3.listObjectsV2({Bucket: bucket, MaxKeys: 10}).promise().then(function (value) {
        value.Contents.forEach(processS3Object)
    }).catch(function (e) {
        console.log(e, e.stack)
    })
}

function processS3Object(content) {
    var filename = content.Key;
    console.log("Processing", filename);

    s3.getObject({Bucket: bucket, Key: filename}).promise()
        .then(function (s3ObjectContent) {
            var fallbackObject = JSON.parse(s3ObjectContent.Body.toString('utf-8'))
            return sender.resend(fallbackObject);
        })
        .then(function () {
            console.log("File sent successfully, deleting")
            return s3.deleteObject({Bucket: bucket, Key: "inexistent file TODO"}).promise()
        })
        .then(function () {
            console.log("File deleted successfully")
        })
        .catch(function (reason) {
            console.log("Something failed")
            console.log(reason.message)
        })
}

