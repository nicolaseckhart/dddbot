// Libraries
const rp = require('request-promise');
const sinon = require('sinon');
const fs = require('fs');

// Classes
const HeroCollection = require('../src/HeroCollection');
const Hero = require('../src/Hero');

describe("HeroCollection", function () {
    var mockData = fs.readFileSync(__dirname + '/mocks/responses/heroes.json', 'utf8');
    var testHeroCollection;

    beforeEach(function () {
        testHeroCollection = new HeroCollection();
        sinon.stub(rp, 'Request').resolves(mockData);
    });

    afterEach(function () {
        rp.Request.restore();
    });

    describe("#heroes", function () {
        it("should initialize attribute heroes to empty array", function () {
            expect(testHeroCollection.heroes.length).toBe(0);
        });
    });

    describe("With loaded heroes", function () {
        describe(".parseHeroes", function () {
            it("parses the mock and fills #heroes with Hero instances", async function () {
                await testHeroCollection.parseHeroes();
                expect(testHeroCollection.heroes.length).toEqual(JSON.parse(mockData).length);
            });
        });

        describe(".heroNameFromNumber", function () {
            it("can find a hero by it's number", async function () {
                await testHeroCollection.parseHeroes();
                expect(testHeroCollection.heroNameFromNumber(12)).toEqual("Phantom Lancer");
                expect(testHeroCollection.heroNameFromNumber(52)).toEqual("Leshrac");
            });
        });
    });
});