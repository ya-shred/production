var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

var mockery = require('mockery');

var moduleUnderTest = '../api/api.js';
mockery.registerAllowable(moduleUnderTest);

var mongoMock = {
    test: function () {
        return 'mocked test';
    }
};
mockery.registerMock('../mongodb/mongodb.js', mongoMock);

mockery.enable({useCleanCache: true});


var api = require(moduleUnderTest);

describe('Socket Server API', function () {
    it('Function connect', function () {
        expect(api.connected({id: 'test'})).to.deep.equal({
            type: 'user_connected',
            data: {
                userId: 'test'
            }
        });
    });

    describe('Function processMessage', function () {
        var testUser = null;

        beforeEach(function () {
            testUser = {id: 'test user'};
        });

        it('unknown command', function (done) {
            var command = {
                type: 'unknown'
            };
            var message = {
                type: 'status',
                data: {
                    status: 'error',
                    message: 'unknown command'
                }
            };
            var res = api.processMessage(testUser, command);
            res.then(function() {
                done('Promise should be rejected');
            }, function(message) {
                expect(message).to.deep.equal(message);
                done();
            });
        });
    });
});