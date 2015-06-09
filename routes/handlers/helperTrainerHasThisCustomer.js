/**
 * Created by mattiden on 08.06.15.
 */
var db = require('./../../config/db');

module.exports = function(trainer_id, customer_id, callback){
    db.select()
        .from("Customer").join("TrainerHasCustomer")
        .where("Customer.customer_id", "=", customer_id)
        .then(function(customer){
            for(var i = 0; i < customer.length; i++){
                if(customer[0].trainer_id === trainer_id){
                    /* istanbul ignore else */
                    if(typeof(callback) === typeof(Function)) return callback(true);
                }
            }
            /* istanbul ignore else */
            if(typeof(callback) === typeof(Function)) return callback(false);
        })
};