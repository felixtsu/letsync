var holder = {};

(function() {
    var fs = require('fs');
    holder.determineReqHandler = function(mod, op) {
        try {
            var modObj = require(mod);
//            var modObj = require('./modules/' + mod + '/index.js');
        } catch(e) {
            if (e.code == 'ENOENT') {
                throw new Error('mod:' + mode + ' does not exists.');

            }
            throw e;

        }
        if (typeof modObj[op] == 'undefined') {
            throw new Error('op:' + op + ' of mod ' + mod + ' is not callable.');
        }


        return function() {
            modObj[op].apply(modObj, arguments)
        };
    }
})();


exports.mapUrl = function(server) {
    server.all('/(:mod)/(:op).go', function(req, res) {
        res.setHeader('Content-Type', 'text/json');
        holder.determineReqHandler(req.params.mod, req.params.op)(req, res);
    });
};