/**
 * Created by mattiden on 07.06.15.
 */
var db = require('../../config/db');
var Joi = require('joi');

var appointmentSchema = Joi.object().keys({
    date: Joi.date().required(),
    description: Joi.string(),
    customer_id : Joi.number().required(),
    trainer_id : Joi.number().required()
});

module.exports = function(request, response){
    request.body.trainer_id = request.validToken.trainer_id;

    Joi.validate(request.body, appointmentSchema, function(err){
        if(err){
            response.send({message: err.details[0].message});
            return;
        }
        db.insert({
            date : request.body.date,
            description : request.body.description,
            customer_id : request.body.customer_id,
            trainer_id : request.body.trainer_id
        }).into("Appointment")
            .then(function(newAppointmentId, err){
                /* istanbul ignore if */
                if(err){
                    response.send({message:"could not add appointment"});
                    return;
                }
                else {
                    response.send({message:"New appointment added", appointment_id : newAppointmentId[0]});
                }
            })
            .catch(function(e){
                /* istanbul ignore next */
                console.error(e);
            });
    })
};