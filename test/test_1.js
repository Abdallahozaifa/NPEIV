var assert = require('assert');
var server = require('../server');
var app = require('express')();
var request = require("request");
var expect = require("chai").expect;



describe('server', function() {

  describe('/', function() {
    it("returns status 200", function(done) {
      var url = "https://npeiv-webapp-abdallahozaifa.c9users.io/";
      request(url, function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });
  });

});
