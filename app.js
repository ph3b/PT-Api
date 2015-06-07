/**
 * Created by mattiden on 06.06.15.
 */
module.exports = function(port){
    var express     = require('express');
    var bodyParser  = require('body-parser');
    var jwt         = require('jsonwebtoken');
    var cors        = require('cors');
    var router      = require('./routes/router');
    var app         = express();
    var port        = port || 3000;


    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
    app.use('/api', router);

    app.listen(port, function(){
        console.log("Server running on: " + port);
    });
}
