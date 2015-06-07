/**
 * Created by mattiden on 06.06.15.
 */
var port = 5000;
require("../app")(port);
var expect = require("expect.js");
var http = require("superagent");
var db = require('./../config/db');
var jwt = require('jsonwebtoken');
var secret = require('../config/config').secret;

var apiUrl = "http://localhost:" + port +"/api";

describe('Trainer logs in', function(){
    before(function(done){
        var payload = {
            "firstname" : "mathias",
            "lastname" : "iden",
            "password"   : "validpassword",
            "email" : "valid@email.com"
        };

        http.post(apiUrl + '/trainer/new')
            .send(payload)
            .end(function(err, res){
                done();
            })
    });
    after(function(done){
        db.delete().from("Trainer").then(function(err, res){
            done();
        });
    });

    it('Should give error when user tries invalid credentials', function(done){
        var invalidCredentials = {email: "invalid@email.com", password: "itooaminvalid"};
        http.post(apiUrl + '/trainer/login')
            .send(invalidCredentials)
            .end(function(err, res){
                expect(res.status).to.be.eql(401);
                expect(res.body.message).to.be.eql("Invalid username or password");
            });
        done();
    });

    it('Should give valid token when user tries valid credentials', function(done){
        var invalidCredentials = {email: "valid@email.com", password: "validpassword"};
        http.post(apiUrl + '/trainer/login')
            .send(invalidCredentials)
            .end(function(err, res){
                jwt.verify(res.body.token,secret, function(err, decoded){
                    expect(res.status).to.be.eql(200);
                    expect(res.body.message).to.be.eql("logged in");
                    expect(err).to.be(null);
                    done();
                });
            });
    })

});