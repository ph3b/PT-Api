/**
 * Created by mattiden on 06.06.15.
 */
var db = require('../../config/db');
var Joi = require('joi');

var customerSchema = Joi.object().keys({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().email().required(),
    postal_code : Joi.number(),
    street_address: Joi.string(),
    city: Joi.string()
});

module.exports = function(request, response){
    var trainer_id = request.validToken.trainer_id;
    var customer_id;

    if(request.body){
        Joi.validate(request.body, customerSchema, function(submittedDataIsInvalid){

            // First, check if submitted form is valid
            if(submittedDataIsInvalid){
                response.send({message: submittedDataIsInvalid.details[0].message});
            }
            else {

                // Second, check if customer already exists
                db.select()
                    .from("Customer")
                    .where({email: request.body.email})
                    .then(function(existingCustomer){
                        if(existingCustomer.length){
                            response.send({message: "Customer already exists"});
                        }
                        else {

                            // Since everything is ok we add the customer to the database
                            db.transaction(function(trans){
                                // We use a transaction because we need to add an entry to the TrainerCustomer-relationship database
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
                                        customer_id = newCustomerId[0];
                                        /* istanbul ignore if */
                                        if(err){
                                            trans.rollback();
                                            response.send({message: "something went wrong"});
                                        }
                                        else {
                                            // Customer was added successfully, now we link trainer and the newly added customer
                                            return db.transacting(trans)
                                                .insert({
                                                trainer_id : trainer_id,
                                                customer_id : customer_id
                                                })
                                                .into("TrainerHasCustomer")
                                        }
                                    })
                                    .then(function(resultId, err){
                                        /* istanbul ignore if */
                                        if(err){
                                            // Something went wrong, rollback transaction and tell user
                                            trans.rollback();
                                            response.send({message: "Customer was not added"});
                                        }
                                        else{
                                            // Everything was fine, go ahead and commit.
                                            return trans.commit()
                                        }
                                    })
                                    .then(function(){
                                        // Inform our user that the customer was added
                                        response.send({message:"customer added", customer_id: customer_id});
                                    })
                                    .catch(function(e){
                                    })
                            });
                        }
                    })
            }
        })
    }
};