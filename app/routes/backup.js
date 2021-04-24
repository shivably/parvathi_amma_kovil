var fs = require('fs');

function backup_db () {
    try {
        console.log('sqlitedb was copied to backup.sqlite3');
        fs.promises.copyFile('app/data/sqlitedb', 'app/data/backup.sqlite3');
    } catch {
        console.log('The file could not be copied');
    }

    // By using COPYFILE_EXCL, the operation will fail if backup.sqlite3 exists.
    // try {
    //   await copyFile('../data/sqlitedb', 'backup.sqlite3', constants.COPYFILE_EXCL);
    //   console.log('sqlitedb was copied to backup.sqlite3');
    // } catch {
    //   console.log('The file could not be copied');
    // }
}

backup_db()