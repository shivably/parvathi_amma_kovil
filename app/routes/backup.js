var fs = require('fs');
var cron = require('node-cron');

module.exports = {

    schedule: function () {
        cron.schedule('0 0 0 * * *', () => {
            try {
                console.log('sqlitedb was copied to backup.sqlite3');
                var dt = (new Date()).toLocaleDateString().replace(/\//g, '-');
                fs.promises.copyFile('app/data/sqlitedb', 'app/db_backup/backup_' + dt + '.sqlite3');
            } catch (e) {
                console.log('The file could not be copied');
            }
        
        });
    }
}