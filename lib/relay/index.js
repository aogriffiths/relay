// list of banned IPs
var banned = [
'127.0.0.1',
'192.168.2.12'
];

// the middleware function
module.exports = function() {
    
    return function(req, res, next) {
        if (banned.indexOf(req.connection.remoteAddress) > -1) {
            res.end('Banned');
        }
        else { next(); }
    }
    
};
