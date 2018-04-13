const fs = require('fs')
const mockery = require('mockery');
const HeroCollection = require('../src/HeroCollection');
const Hero = require('../src/Hero');

describe("HeroCollection", function () {
    var mockResponse = fs.readFileSync(__dirname + '/mocks/heroes.json', 'utf8');
    var testHeroCollection;

    beforeEach(function (done) {
        testHeroCollection = new HeroCollection();

        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });
     
        mockery.registerMock('request-promise', function () {
            return Bluebird.resolve(mockResponse.trim());
        });
     
        done();
    });
     
    afterEach(function (done) {
        mockery.disable();
        mockery.deregisterAll();
        done();
    });

    describe("#heroes", function() {
        it("should initialize attribute heroes to empty array", function() {
            expect(testHeroCollection.heroes.length).toBe(0);
        });
    });

    describe(".parseHeroes", function() {
        it("parses the mock and fills #heroes with Hero instances", async function() {
            await testHeroCollection.parseHeroes();
            expect(testHeroCollection.heroes.length).toEqual(JSON.parse(mockResponse).length);
        });
    });
});