const util = require('../util.js');

module.exports = (client) => {
    util.logger(`[READY] ${client.user.tag} is online.`);
}
