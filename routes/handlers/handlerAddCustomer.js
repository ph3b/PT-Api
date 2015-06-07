/**
 * Created by mattiden on 06.06.15.
 */
var db = require('../../config/db');
var Joi = require('joi');

var customerSchema = Joi.object().keys({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().email().required(),
    street_address : Joi.string().alphanum(),
    postal_code : Joi.string().alphanum(),
    city : Joi.string()
});

module.exports = function(request, response){
    var trainer_id = request.validToken.trainer_id;

    if(request.body){
        Joi.validate(request.body, customerSchema, function(submittedDataIsInvalid){
            if(submittedDataIsInvalid){
                response.send({message: submittedDataIsInvalid.details[0].message});
            }
            else {
                db.select()
                    .from("Customer")
                    .where({email: request.body.email})
                    .then(function(existingCustomer){
                        if(existingCustomer.length){
                            response.send({message: "Customer already exists"})
                        }
                        else {
                            db.transaction(function(trans){
                                db.transacting(trans)
                                    .insert({
                                    firstname: request.body.firstname,
                                    lastname: request.body.lastname,
                                    email: request.body.email,
                                    street_address : request.body.street_address,
                                    postal_code : request.body.postal_code,
                                    city: request.body.city
                                    })
                                    .into("Customer")
                                    .then(function(newCustomerId, err){
                                        if(err){
                                            trans.rollback();
                                            response.send({message: "something went wrong"})
                                        }
                                        else {
                                            db.transacting(trans)
                                                .insert({
                                                trainer_id : trainer_id,
                                                customer_id : newCustomerId[0]
                                                })
                                                .into("TrainerHasCustomer")
                                                .then(function(resultId, err){
                                                    if(err){
                                                        trans.rollback();
                                                        response.send({message: "something went wrong"})
                                                    }
                                                    else{
                                                        trans.commit();
                                                        response.send({message:"customer added", customer_id: newCustomerId[0]});
                                                    }
                                                })
                                        }
                                    })
                            });
                        }
                    })
            }
        })
    }
};