/**
 * Created by mattiden on 07.06.15.
 */

var port = 5000;
require("../app")(port);
var expect = require("expect.js");
var http = require("superagent");
var db = require('./../config/db');
var secret = require('../config/config').secret;
var jwt = require("jsonwebtoken");

var apiUrl = "http://localhost:" + port +"/api";

describe('Trainer tries to access restricted routes', function(){

    it('Should say that no token was provided when no token is sent', function(done){
        http.get(apiUrl + '/restricted')
            .end(function(err, res){
                expect(res.body.message).to.be.eql("Please provide a token");
                done();
        })
    });
    it('Should say that token was invalid when invalid token is sent', function(done){
        http.get(apiUrl + '/restricted')
            .set("x-access-token", "invalidtoken")
            .end(function(err, res){
                expect(res.body.message).to.be.eql("invalid token");
                done();
            })
    });
    it('Should let user access restricted route', function(done){
        var validToken = jwt.sign("hello", secret);
        http.get(apiUrl + '/restricted')
            .set("x-access-token", validToken)
            .end(function(err, res){
                expect(res.body.message).to.be.eql("you are authorized");
                done();
            })
    })
});