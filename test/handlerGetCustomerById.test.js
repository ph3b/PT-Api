/**
 * Created by mattiden on 08.06.15.
 */
var port = 5000;
require('../app.js')(port);
var expect = require('expect.js');
var db = require('../config/db');
var http = require('superagent');
var secrect = require('./../config/config').secret;
var jwt = require('jsonwebtoken');

var apiUrl = "http://localhost:" + port +"/api";



describe('Trainer gets customer by id', function(){
    var customer_id;
    var token;
    var trainer_id;
    var TrainerWithoutCustomersToken = jwt.sign({trainer_id: 1},secrect);
    before(function(done){
        var trainer = {
            "firstname" : "mathias",
            "lastname" : "iden",
            "password"   : "hawaii",
            "email" : "mathiaserkul@me.com"
        };
        var customer = {
            "firstname" : "Mathias",
            "lastname"  : "Iden",
            "email"     : "mathias@xlib.no",
            "postal_code" : 5221,
            "street_address" : "Sleipners vei 54",
            "city" : "Bergen"
        };

        http.post(apiUrl + '/trainer/new')
            .send(trainer)
            .end(function(err, res){
                trainer_id = res.body.trainer_id;
                http.post(apiUrl + '/trainer/login')
                    .send({email: trainer.email, password: trainer.password})
                    .end(function(err, res){
                        token = res.body.token;
                        http.post(apiUrl + '/customer/new')
                            .send(customer)
                            .set('x-access-token', token)
                            .end(function(err, res){
                                customer_id = res.body.customer_id;
                                done();
                            });
                    });
            })
    });
    after(function(done){
        db.delete().from("Trainer")
            .then(function(){
                return db.delete().from("Customer")
            })
            .then(function(){
                done();
            })
    });
    it('Should return a customer of the trainer', function(done){
        http.get(apiUrl + "/customer/" + customer_id)
            .set("x-access-token", token)
            .end(function(err, res){
                expect(res.body.customer.customer_id).to.be.eql(customer_id);
                expect(res.body.customer.email).to.be.eql("mathias@xlib.no");
                expect(res.body.customer.firstname).to.be.eql("Mathias");
                expect(res.body.customer.lastname).to.be.eql("Iden");
                done();
            })
    });
    it('Should return error of the trainer', function(done){
        http.get(apiUrl + "/customer/" + customer_id)
            .set("x-access-token", TrainerWithoutCustomersToken)
            .end(function(err, res){
                expect(res.body.message).to.be.eql("This is not your customer");
                done();
            })
    });

    it('Should error when no id is sent', function(done){
        http.get(apiUrl + "/customer")
            .set("x-access-token", token)
            .end(function(err, res){
                expect(err.status).to.be(404);
                done();
            })
    })
});