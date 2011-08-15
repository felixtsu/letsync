module.exports = function(cback) {
    var fill2Zero = function(s) {
        if (s.toString().length == 1) {
            return '0' + s.toString();
        }
        return s;
    };

    var formatDate = function(date) {

        var offset = date.getTimezoneOffset() * 60000 + 8 * 3600000;
        date = new Date(date.getTime() + offset);

        return [date.getUTCFullYear(), fill2Zero(date.getUTCMonth() + 1), fill2Zero(date.getUTCDate())].join('-')
                + 'T'
                + [fill2Zero(date.getUTCHours()), fill2Zero(date.getUTCMinutes()), fill2Zero(date.getUTCSeconds())].join(':')
                + '\+08:00';
    };


    var db = require('./lib/db');
    db.getClient().mset([
        'sys:douban:poller:cron', '*/5 * * * * *',
        'user:felix:passwd', 'qwerty!@#$%^',
//        'douban:felix:id', JSON.stringify({doubanId:'felixtsu', lastPoll:formatDate(new Date())})
    ], function() {
                if (cback) {
                    db.get('sys:douban:poller:cron', function(res) {
                        cback();
                    });
                }
            });
};

