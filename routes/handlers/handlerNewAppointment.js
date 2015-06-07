/**
 * Created by mattiden on 07.06.15.
 */
var db = require('../../config/db');
var Joi = require('joi');

var appointmentSchema = Joi.object().keys({
    date: Joi.date().required(),
    description: Joi.string(),
    customer_id : Joi.string().alphanum().required(),
    trainer_id : Joi.string().alphanum().required()
});

module.exports = function(request, reponse){
    Joi.validate(request.body, appointmentSchema, function(err){
        if(err){
            response.send({message: err.details[0].message});
        }
        db.insert({
            date : request.body.date,
            description : request.body.description,
            customer_id : request.body.customer_id,
            trainer_id : request.body.trainer_id
        }).into("Appointment")
            .then(function(newAppointmentId, err){
                if(err){
                    reponse.send({message:"could not add appointment"});
                }
                else {
                    reponse.send({message:"added", appointment_id : newAppointmentId[0]});
                }
            })
    })
};