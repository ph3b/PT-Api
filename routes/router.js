/**
 * Created by mattiden on 06.06.15.
 */
var router = require('express').Router();
var TrainerSignUpHandler = require("./handlers/handlerTrainerSignUp");
var TrainerLoginHandler = require('./handlers/handlerLogin');
var AddCustomerHandler = require('./handlers/handlerAddCustomer');
var TokenValidatorHandler = require('./handlers/handlerTokenValidator');

router.get('/hello', function(req, res){
    res.send({message:"Hello world"});
});

router.post('/trainer/new', TrainerSignUpHandler);
router.post('/trainer/login', TrainerLoginHandler);
router.post('/customer/new', TokenValidatorHandler, AddCustomerHandler);

module.exports = router;