/**
 * Created by mattiden on 06.06.15.
 */
var jwt = require('jsonwebtoken');
var secret = require('../../config/config').secret;

module.exports = function(request, response, next){
    var token = request.body.token || request.query.token || request.headers['x-access-token'];
    if(token){
        jwt.verify(token, secret, function(err, validToken){
            if(err){
                return response.send({message: "invalid token"})
            }
            else {
                request.validToken = validToken;
                next();
            }
        })
    }
    else {
        return response.status(401).send({message: "Please provide a token"});
    }
};