// Classes
const Hero = require('../src/Hero');

describe("Hero", function () {
    var mockData = { "id": 0, "localized_name": "foobar" }
    var testHero;

    beforeEach(function () {
        testHero = new Hero(mockData);
    });

    describe("#number", function () {
        it("sets the number attribute to the id of the mock data", function () {
            let number = testHero.number;
            expect(number).toEqual(mockData.id);
        });
    });

    describe("#name", function() {
        it("sets the name attribute to the localized_name of the mock data", function() {
            let name = testHero.name;
            expect(name).toEqual(mockData.localized_name);
        });
    })
});
