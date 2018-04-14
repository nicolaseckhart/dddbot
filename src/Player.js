// Libraries
const rp = require('request-promise');

// Config & Data
const ranks = require('./data/ranks.json');

// Classes
const HeroCollection = require('./HeroCollection');
const Hero = require('./Hero');

class Player {
    constructor(id, heroCollection) {
        this.id = id;
        this.apiBasePath = `https://api.opendota.com/api/players/${this.id}`;
        this.heroCollection = heroCollection;
    }

    async parsePlayerInformation() {
        await this.parseProfile();
        await this.parseWinLose();
        await this.parseHeroes();
    }

    async parseProfile() {
        let response, data;

        // Parse the basic data
        response = await rp(this.apiBasePath);
        data = JSON.parse(response);
        this.username = data.profile.personaname;
        this.avatar = data.profile.avatar;
        this.rank = data.rank_tier;
        this.estimatedRank = data.mmr_estimate.estimate;
        if (data.profile.name) this.mainname = data.profile.name;
        if (data.leaderboard_rank) this.leaderboardRank = data.leaderboard_rank;
    }

    async parseWinLose() {
        let response, data;

        // Parse the W/L stats
        response = await rp(`${this.apiBasePath}/wl`);
        data = JSON.parse(response);
        this.wins = data.win;
        this.losses = data.lose;
    }

    async parseHeroes() {
        let response, data;

        // Parse the hero related data
        response = await rp(`${this.apiBasePath}/heroes`);
        data = JSON.parse(response);
        this.heroData = data;
    }

    get fullName() {
        let fullName = `${this.username}`;
        if (this.mainname) fullName += ` (${this.mainname})`;
        return fullName;
    }

    get numericalRank() {
        return parseInt(this.rank.toString().split('')[0]);
    }

    get numericalTier() {
        return parseInt(this.rank.toString().split('')[1]);
    }

    get readableRank() {
        let readableRank = `${ranks[this.numericalRank - 1]} [${this.numericalTier.toString()}]`;
        if (this.leaderboardRank) readableRank += ` - Rank ${this.leaderboardRank}`;
        return readableRank;
    }

    get winrate() {
        return ((this.wins * 100) / (this.wins + this.losses)).toFixed(2);
    }

    get heroSummary() {
        let summary = '';
        for (let i = 0; i < 5; i++) {
            let hero = this.heroData[i];
            summary += `**${i + 1}:** ${this.heroCollection.heroNameFromNumber(hero.hero_id)} (played: ${hero.games}, winrate: ${this.heroWinrate(hero.games, hero.win)}%)\n`
        }
        return summary;
    }

    heroWinrate(gamesPlayed, gamesWon) {
        return ((gamesWon * 100) / gamesPlayed).toFixed(2);
    }

    embedify() {
        return {
            embed: {
                color: 0x00AE86,
                author: {
                    name: this.fullName,
                    icon_url: this.avatar
                },
                title: `Stalk ${this.username} on OpenDota`,
                url: `https://www.opendota.com/players/${this.id}`,
                description: `**Rank:** ${this.readableRank}\n**Estimated MMR:** ${this.estimatedRank}\n**Wins/Losses:** ${this.wins}/${this.losses}`,
                thumbnail: {
                    url: `https://www.opendota.com/assets/images/dota2/rank_icons/rank_icon_${this.numericalRank}.png`
                },
                fields: [
                    {
                        name: "Most Played Heroes",
                        value: this.heroSummary
                    }
                ],
                timestamp: new Date(),
                footer: {
                    icon_url: "https://www.opendota.com/assets/images/logo.png",
                    text: "Data parsed through the OpenDota API"
                }
            }
        };
    }
}
module.exports = Player;