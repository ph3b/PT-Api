/**
 * Created by mattiden on 06.06.15.
 */
var db = require('knex');

var config = {
    client: 'mysql',
    connection: {
        host     : 'localhost',
        port     : 8889,
        user     : 'root',
        password : 'root',
        database : 'ptDb'
    }
};

module.exports = db(config);