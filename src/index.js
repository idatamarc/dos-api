/* eslint-disable no-console */
const logger = require('winston');
const app = require('./app');
//const port = app.get('port');
const port = 3030;
const host = 'localhost';
const server = app.listen(port);

server.on('listening', () =>
  logger.info('Feathers application started on http://%s:%d', host, port)
);
