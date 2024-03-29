/**
 * Created by mattiden on 06.06.15.
 */
/**
 * Created by mattiden on 06.06.15.
 */
var port = 5000;
require("../app")(port);
var expect = require("expect.js");
var http = require("superagent");
var db = require('./../config/db');

var apiUrl = "http://localhost:" + port +"/api";

describe("Trainer signs up", function(){

    before(function(done){
        db.insert({
            firstname: "mathias",
            lastname: "iden",
            password: "hawaii",
            email: "onlymathias@mac.com"
        }).into("Trainer").then(function(err, res){
            done();
        });
    });
    after(function(done){
        db.delete().from("Trainer").then(function(err, res){
            done();
        });
    });

    it('Should return error when submitting form without email',function(done){
        var payload = {
            "password"   : "hawaii"
        };

        http.post(apiUrl + '/trainer')
            .send(payload)
            .end(function(err, res){
                expect(res.body.message).to.be.eql('invalid payload');
                done();
            })
    });

    it('Should return error when submitting no payload',function(done){
        http.post(apiUrl + '/trainer')
            .end(function(err, res){
                expect(res.body.message).to.be.eql("invalid payload");
                done();
            })
    });

    it('Should give error when user submits form with pre-existing email in database',function(done){
        var payload = {
            "firstname" : "mathias",
            "lastname" : "iden",
            "password"   : "hawaii",
            "email" : "onlymathias@mac.com"
        };

        http.post(apiUrl + '/trainer')
            .send(payload)
            .end(function(err, res){
                expect(res.body.message).to.be.eql("User already exists.");
                done();
            })
    });

    it('Should add user to database when submitting valid form',function(done){
        var payload = {
            "firstname" : "mathias",
            "lastname" : "iden",
            "password"   : "hawaii",
            "email" : "mathiaserkul@me.com"
        };

        http.post(apiUrl + '/trainer')
            .send(payload)
            .end(function(err, res){
                expect(res.body.message).to.be.eql("Added.");
                expect(res.body.trainer_id).to.be.a("number");
                done();
            })
    });

});
