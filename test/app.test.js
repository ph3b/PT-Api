/**
 * Created by mattiden on 06.06.15.
 */
var port = 5000;
require("../app")(port);
var expect = require("expect.js");
var http = require("superagent");

var apiUrl = "http://localhost:" + port + "/api/";

describe("App running", function(){
    it('Should respond to get request',function(done){
        http
            .get(apiUrl + 'hello')
            .end(function(err, res){
                expect(res.body.message).to.be.equal("Hello world");
                done();
            })
    })
});