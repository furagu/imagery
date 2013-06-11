var _ = require('underscore'),
    querystring = require('querystring')

module.exports = function (http) {
    http.IncomingMessage.prototype.get_ip = function() {
        return this.headers['x-real-ip'] || this.client.remoteAddress
    }

    function respond (code, message, headers) {
        this.writeHead(code || 200, headers || {"Content-Type": "text/plain"})
        if (message) this.write(message)
        this.end()
    }
    http.ServerResponse.prototype.send_404 = _.partial(respond, 404, '404 Not Found')
    http.ServerResponse.prototype.send_500 = _.partial(respond, 500)

    http.ServerResponse.prototype.send_json = function(obj, options) {
        var json = JSON.stringify(obj),
            res = _.bind(respond, this)
        if (options && options.callback)
            res(200, options.callback + '(' + json + ')', {"Content-Type": "text/javascript"})
        else if (options && options.jsonredirect)
            res(302, null, {"Location": options.jsonredirect + '?' + querystring.escape(json)})
        else
            res(200, json, {"Content-Type": "text/plain", "Access-Control-Allow-Origin": "*"})
    }

    http.ServerResponse.prototype.send_json_error = function(error, message, data, options) {
        if (typeof error === 'string') {
            error = {error: error}
            if (message) error.message = message
            if (data) _.extend(error, data)
        }
        delete error.stack
        error.success = false
        this.send_json(error, options)
    }
}
