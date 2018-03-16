var axios = require('axios')

exports.resend = function (fileContent) {
    // var uri = fileContent.settings.httpFallbackConfiguration.uri;
    var uri = "http://httpbin.org/post";

    console.log('resending to', uri);

    return axios.post(uri, {field: "value"})
        .then(function (response) {
            console.log("Response from post:", response.data.data);
        })
}