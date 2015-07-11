/**
 * Created by mattiden on 07.06.15.
 */
    var port = 5000;
require('../app.js')(port);
var expect = require('expect.js');
var db = require('../config/db');
var http = require('superagent');

var apiUrl = "http://localhost:" + port +"/api";

describe('Trainer adds appointment', function(){
    var token;
    var trainer_id;
    var customer_id;
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
            "email"     : "mathias@xlib.no"
        };

        http.post(apiUrl + '/trainer')
            .send(trainer)
            .end(function(err, res){
                http.post(apiUrl + '/trainer/login')
                    .send({email: trainer.email, password: trainer.password})
                    .end(function(err, res){
                        token = res.body.token;
                        http.post(apiUrl + '/customer')
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

    it('Should give error when customer_id is missing', function(done){
        var appointment = {
            date : Date.now(),
            description : "Løpetrening"
        };

        http.post(apiUrl + '/appointment')
            .send(appointment)
            .set('x-access-token', token)
            .end(function(err, res){
                expect(res.body.message).to.be.eql('"customer_id" is required' );
                done();
        })
    });

    it('Should add appointment when everything is valid', function(done){
        var appointment = {
            date : Date.now(),
            description : "Løpetrening",
            customer_id : customer_id
        };

        http.post(apiUrl + '/appointment')
            .send(appointment)
            .set('x-access-token', token)
            .end(function(err, res){
                expect(res.body.message).to.be.eql("New appointment added");
                expect(res.body.appointment_id).to.be.a("number");
                done();
            })
    });
    //TODO: More schema test
});