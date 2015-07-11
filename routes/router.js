/**
 * Created by mattiden on 06.06.15.
 */
var router = require('express').Router();
var TrainerSignUpHandler    = require("./handlers/handlerTrainerSignUp");
var loginHandler     = require('./handlers/handlerLogin');
var NewCustomerHandler      = require('./handlers/handlerNewCustomer');
var TokenValidatorHandler   = require('./handlers/handlerTokenValidator');
var NewAppointmentHandler   = require('./handlers/handlerNewAppointment');
var GetCustomerByIdHandler  = require('./handlers/handlerGetCustomerById');

router.get('/hello', function(req, res){
    res.send({message:"Hello world"});
});
router.get('/restricted', TokenValidatorHandler, function(req, res){
    res.send({message:"you are authorized"});
});
router.post('/trainer', TrainerSignUpHandler);
router.post('/trainer/login', loginHandler);
router.post('/customer', TokenValidatorHandler, NewCustomerHandler);
router.get('/customer/:customer_id', TokenValidatorHandler, GetCustomerByIdHandler);
router.post('/appointment', TokenValidatorHandler, NewAppointmentHandler);

module.exports = router;