/**
 * Created by mattiden on 08.06.15.
 */
var db = require('./../../config/db');
var Joi = require('Joi');
var TrainerHasThisCustomer = require('./helperTrainerHasThisCustomer');

module.exports = function(request, response){
    var customer_id = request.params.customer_id;
    TrainerHasThisCustomer(request.validToken.trainer_id, customer_id, function(hasThisCustomer){
        if(hasThisCustomer){
            db.select()
                .from("Customer")
                .where("customer_id", "=", customer_id)
                .then(function(customer){
                    response.send({customer: customer[0]})
                })
        } else {
            response.send({message:"This is not your customer"});
        }
    })
};