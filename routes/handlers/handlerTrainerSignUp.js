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
    if(request.body.email && request.body.password){
            db.select()
                .from("Trainer")
                .where({email: request.body.email})
                .then(function(arrayWithExistingUser){
                    if(arrayWithExistingUser.length){
                        response.send({message: "User already exists."});
                        throw 0
                    }
                    else {
                        var password = bcrypt.hashSync(request.body.password, 10);
                        return db.insert({
                            firstname: request.body.firstname,
                            lastname: request.body.lastname,
                            password: password,
                            email: request.body.email
                            })
                            .into("Trainer")
                    }
                })
                .then(function(result, userWasNotAddedToDatabase){
                    /* istanbul ignore if */
                    if(userWasNotAddedToDatabase){
                        response.send({message: "Could not add user to database"});
                    }
                    else {
                       response.send({message: "Added.", trainer_id: result[0]});
                    }
                })
                .catch(function(e){
                });
    }
    else {
        response.send({message: "invalid payload"});
    }
};