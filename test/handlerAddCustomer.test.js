/**
 * Created by mattiden on 06.06.15.
 */
var port = 5000;
require("../app")(port);
var expect  = require("expect.js");
var http    = require("superagent");
var db      = require('./../config/db');
var secret  = require('../config/config').secret;
var jwt     = require('jsonwebtoken');

var apiUrl = "http://localhost:" + port +"/api";

describe('Trainer adds customer', function(){
    var token;
    before(function(done){
        var payload = {
            "firstname" : "mathias",
            "lastname" : "iden",
            "password"   : "hawaii",
            "email" : "mathiaserkul@me.com"
        };

        http.post(apiUrl + '/trainer/new')
            .send(payload)
            .end(function(err, res){
                http.post(apiUrl + '/trainer/login')
                    .send({email: payload.email, password: payload.password})
                    .end(function(err, res){
                        token = res.body.token;
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
    it('Should add customer when form is valid', function(done){

        var newCustomer = {
            "firstname" : "Mathias",
            "lastname"  : "Iden",
            "email"     : "mathias@xlib.no"
        };
        http.post(apiUrl + '/customer/new')
            .send(newCustomer)
            .set('x-access-token', token)
            .end(function(err, res){
                expect(res.body.message).to.be.eql("customer added");
                done();
            });
    })
});
