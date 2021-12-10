
const winston = require('winston');
const MongoDB =require('winston-mongodb').MongoDB;
const { createLogger, transports, format } = require('winston');
require('winston-mongodb').MongoDB;

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.simple(),
        winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        winston.format.json(),
    ),
    transports:[
        new winston.transports.MongoDB({
            db : 'mongodb://localhost/sistema-inventario',
            collection: 'historial',
            format: format.combine(
                winston.format.simple(),
                winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
                winston.format.json(),
            ),
        })
    ]
});

module.exports = logger;