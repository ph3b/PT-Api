/**
 * Created by mattiden on 06.06.15.
 */
var db = require('../../config/db');
var secret = require('../../config/config').secret;
var Joi = require('joi');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var loginSchema = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.required()
});

module.exports = function(request, response){
        Joi.validate(request.body,loginSchema, function(submittedDataIsInvalid){
            if(submittedDataIsInvalid){
                response.status(401);
                response.send({message: "Invalid username or password"});
            }
            else {
                db.select('trainer_id','password', 'email')
                    .from("Trainer")
                    .where({email: request.body.email})
                    .then(function(user){
                        if(user.length && bcrypt.compareSync(request.body.password, user[0].password)){
                            var token = jwt.sign({trainer_id: user[0].trainer_id, email: user[0].email}, secret,{expiresInMinutes:1440});
                            response.status(200);
                            response.send({message: "Logged in", token: token});
                        }
                        else {
                            response.status(401);
                            response.send({message: "Invalid username or password"});
                        }
                    })
            }
        })
};