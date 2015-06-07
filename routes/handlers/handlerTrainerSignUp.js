/**
 * Created by mattiden on 06.06.15.
 */
var db = require('../../config/db');
var Joi = require('joi');
var bcrypt = require('bcrypt');

var signUpSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.required(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required()
});

module.exports = function(request, response){
    if(request.body){
        Joi.validate(request.body,signUpSchema, function(submittedDataIsInvalid){
            if(submittedDataIsInvalid){
                response.send({message: submittedDataIsInvalid.details[0].message});
            }
            else {
                db.select().from("Trainer")
                    .where({email: request.body.email})
                    .then(function(arrayWithExistingUser){
                        if(arrayWithExistingUser.length){
                            response.send({message: "User already exists."})
                        }
                        else {
                            var password = bcrypt.hashSync(request.body.password, 10);
                            db.insert({
                                firstname: request.body.firstname,
                                lastname: request.body.lastname,
                                password: password,
                                email: request.body.email
                            }).into("Trainer")
                                .then(function(result, userWasNotAddedToDatabase){
                                    if(userWasNotAddedToDatabase){
                                        response.send({message: "Could not add user to database"});
                                    }
                                    else {
                                        response.send({message: "Added."});
                                    }
                                });
                        }
                    })
            }
        })
    }
    else {
        response.send({message: "invalid payload"});
    }
};