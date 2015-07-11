/**
 * Created by mattiden on 09.06.15.
 */
var TrainerHasThisCustomer = require('./../routes/handlers/helperTrainerHasThisCustomer');

/**
 * Created by mattiden on 07.06.15.
 */
var port = 5000;
require('../app.js')(port);
var expect = require('expect.js');
var db = require('../config/db');
var http = require('superagent');
var secret  = require('../config/config').secret;
var jwt     = require('jsonwebtoken');

var apiUrl = "http://localhost:" + port +"/api";

describe('Module: Check if Trainer has this customer', function(){
    var token;
    var trainer_id;
    before(function(done){
        var payload = {
            "firstname" : "mathias",
            "lastname" : "iden",
            "password"   : "hawaii",
            "email" : "mathiaserkul@me.com"
        };
        http.post(apiUrl + '/trainer')
            .send(payload)
            .end(function(err, response){
                http.post(apiUrl + '/trainer/login')
                    .send({email: payload.email, password: payload.password})
                    .end(function(err, res){
                        token = res.body.token;
                        trainer_id = response.body.trainer_id;
                        done();
                    });
            })
    });
    after(function(done){
        db.delete().from("Trainer").then(function(){
            db.delete().from("Customer").then(function(){
                done();
            })
        })
    });
    it('Should say the Trainer does not have this customer',function(done){
        TrainerHasThisCustomer(trainer_id, 55, function(hasThisCustomer){
            expect(hasThisCustomer).to.be.eql(false);
            done();
        });
    });

    it('Should say the Trainer has this customer',function(done){
        var newCustomer = {
            "firstname" : "Mathias",
            "lastname"  : "Iden",
            "email"     : "mathias@xlib.no"
        };
        http.post(apiUrl + '/customer')
            .send(newCustomer)
            .set('x-access-token', token)
            .end(function(err, res){
                TrainerHasThisCustomer(trainer_id, res.body.customer_id, function(hasThisCustomer){
                    expect(hasThisCustomer).to.be.eql(true);
                    done();
                });
            });
    });


});
