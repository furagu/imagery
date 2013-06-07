var
    http = require('http'),
    url = require('url'),
    sys = require('sys'),
    formidable = require('formidable'),
    util = require('util'),
    conf = {
        port: 8500,
        trusted: ['127.0.0.1'],
    }

var server = http.createServer(function (req, res) {
    sys.puts('url ' + req.url)

    var uri = url.parse(req.url).pathname
    switch (uri) {
    case '/':
        serveUploadForm(req, res)
        break
    case '/upload':
        handleUpload(req, res)
        break
    }
})

server.listen(conf.port)

function serveUploadForm(req, res) {
    // TODO: serve to trusted IPs only
    res.writeHead(200, {"Content-Type": "text/html"})
    res.write(
        '<form action="/upload" method="post" enctype="multipart/form-data">'+
        '<input type="text" name="options" value=\'{"profile": "raw"}\'>'+
        '<input type="file" name="file" multiple="multiple">'+
        '<input type="submit" value="Upload">'+
        '</form>' +

        '<form action="/download" method="get">'+
        '<input type="text" name="options" value=\'{"profile": "raw"}\'>'+
        '<input type="text" name="url">'+
        '<input type="submit" value="Download">'+
        '</form>'
    )
    res.end()
}

function handleUpload(req, res) {
    parseUploadRequest(req, function(err, fields, files) {
        res.writeHead(200, {'content-type': 'text/plain'})
        res.write('received upload:\n\n')
        res.write(util.inspect([fields, files]))
        res.end()
    })
}

function parseUploadRequest(req, cb) {
    var form = new formidable.IncomingForm(),
        files = []

    form.parse(req, function(err, fields) {
        // TODO: handle errors
        cb(false, fields, files)
    })

    form.onPart = function(part) {
        var file
        if (part.filename) {
            file = {name: part.filename, data: ''}
            part.on('data', function(buffer) {file.data += buffer})
            part.on('end',  function() {form._maybeEnd()})
            files.push(file)
        } else
            form.handlePart(part)
    }
}
