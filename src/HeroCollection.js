// Libraries
const rp = require('request-promise');

// Classes
const Hero = require('./Hero');

class HeroCollection {
    constructor() {
        this.heroes = [];
    }

    async parseHeroes() {
        let heroData = await rp('https://api.opendota.com/api/heroes');
        heroData = JSON.parse(heroData);
        for (let i = 0; i < heroData.length; i++) {
            this.heroes.push(new Hero(heroData[i]));
        }
    }

    heroNameFromNumber(number) {
        for (let i = 0; i < this.heroes.length; i++) {
            if (this.heroes[i].number == number) {
                return this.heroes[i].name;
            }
        }
    }
}
module.exports = HeroCollection;