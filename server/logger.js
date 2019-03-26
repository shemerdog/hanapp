const bunyan = require('bunyan');
const path = require("path");
const fs = require('fs');

const LOG_DIR_NAME = 'log';
const LOG_FILE_NAME = 'hanapp.log';
const LOG_DIR = path.join(__dirname, LOG_DIR_NAME);
const LOG_FILE = path.join(LOG_DIR, LOG_FILE_NAME);

const init = () => {
    console.log(`Checking and creating logs folder: ${LOG_DIR}`);
    if ( !fs.existsSync( LOG_DIR ) ) {
        fs.mkdirSync(LOG_DIR);
    }
};

init();

module.exports = bunyan.createLogger({
        name: 'hanappLogger',
        streams: [{
            level: 'debug',		// loging level
            type: 'rotating-file',
            path: LOG_FILE, // log DEBUG to file
            period: '1w',   // weekly rotation
            count: 3        // keep 3 back copies
        },{
            level: 'info',                  // logging level
            stream: process.stdout          // log INFO to console.log
        }]
    });
