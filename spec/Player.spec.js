// Libraries
const rp = require('request-promise');
const sinon = require('sinon');
const fs = require('fs');

// Classes
const Player = require('../src/Player');
const HeroCollection = require('../src/HeroCollection');
const Hero = require('../src/Hero');

describe("Player", function () {
    // Response mocks
    var playerMock = fs.readFileSync(__dirname + '/mocks/responses/player.json', 'utf8');
    var playerExtraMock = fs.readFileSync(__dirname + '/mocks/responses/playerExtra.json', 'utf8');
    var playerWLMock = fs.readFileSync(__dirname + '/mocks/responses/playerWL.json', 'utf8');
    var playerHeroesMock = fs.readFileSync(__dirname + '/mocks/responses/playerHeroes.json', 'utf8');

    // HeroCollection for injection into testPlayer
    var heroesMock = JSON.parse(fs.readFileSync(__dirname + '/mocks/responses/heroes.json', 'utf8'));
    var testHeroCollection = new HeroCollection();
    for (let i = 0; i < heroesMock.length; i++) {
        testHeroCollection.heroes.push(new Hero(heroesMock[i]));
    }

    // Test subjects
    var testPlayer;

    beforeEach(function () {
        testPlayer = new Player(JSON.parse(playerMock).profile.account_id, testHeroCollection);
    });

    describe("basic attributes", function () {
        describe("#id", function () {
            it("sets the id through the constructor", function () {
                expect(testPlayer.id).toEqual(JSON.parse(playerMock).profile.account_id);
            });
        });

        describe("#apiBasePath", function () {
            it("sets the apiBasePath correctly through the constructor", function () {
                expect(testPlayer.apiBasePath).toEqual(`https://api.opendota.com/api/players/${JSON.parse(playerMock).profile.account_id}`);
            });
        });

        describe("#heroCollection", function () {
            it("sets the heroCollection through the constructor", function () {
                expect(testPlayer.heroCollection.heroes.length).toEqual(testHeroCollection.heroes.length);
            });
        });
    })

    describe(".parsePlayerInformation", function () {
        it("calls all three sub-functions from the parsePlayerInformation", async function () {
            let parseProfileStub = sinon.stub(testPlayer, 'parseProfile').returns(Promise.resolve());
            let parseWinLoseStub = sinon.stub(testPlayer, 'parseWinLose').returns(Promise.resolve());
            let parseHeroesStub = sinon.stub(testPlayer, 'parseHeroes').returns(Promise.resolve());

            await testPlayer.parsePlayerInformation();

            sinon.assert.calledOnce(parseProfileStub);
            sinon.assert.calledOnce(parseWinLoseStub);
            sinon.assert.calledOnce(parseHeroesStub);

            testPlayer.parseProfile.restore();
            testPlayer.parseWinLose.restore();
            testPlayer.parseHeroes.restore();
        });
    });

    describe("parse api information", function () {
        afterEach(function () {
            rp.Request.restore();
        })

        describe(".parseProfile", function () {
            it("parses all the relevant profile information", async function () {
                sinon.stub(rp, 'Request').resolves(playerMock);
                await testPlayer.parseProfile();
                expect(testPlayer.username).toEqual(JSON.parse(playerMock).profile.personaname);
                expect(testPlayer.avatar).toEqual(JSON.parse(playerMock).profile.avatar);
                expect(testPlayer.rank).toEqual(JSON.parse(playerMock).rank_tier);
                expect(testPlayer.estimatedRank).toEqual(JSON.parse(playerMock).mmr_estimate.estimate);
            });

            it("parses all the relevant profile information (without leadboardRank and mainname)", async function () {
                sinon.stub(rp, 'Request').resolves(playerExtraMock);
                await testPlayer.parseProfile();
                expect(testPlayer.username).toEqual(JSON.parse(playerExtraMock).profile.personaname);
                expect(testPlayer.avatar).toEqual(JSON.parse(playerExtraMock).profile.avatar);
                expect(testPlayer.rank).toEqual(JSON.parse(playerExtraMock).rank_tier);
                expect(testPlayer.estimatedRank).toEqual(JSON.parse(playerExtraMock).mmr_estimate.estimate);
                expect(testPlayer.mainname).toEqual(JSON.parse(playerExtraMock).profile.name);
                expect(testPlayer.leaderboardRank).toEqual(JSON.parse(playerExtraMock).leaderboard_rank);
            });
        });

        describe(".parseWinLose", function () {
            it("parses the wins and losses", async function () {
                sinon.stub(rp, 'Request').resolves(playerWLMock);
                await testPlayer.parseWinLose();
                expect(testPlayer.wins).toEqual(JSON.parse(playerWLMock).win);
                expect(testPlayer.losses).toEqual(JSON.parse(playerWLMock).lose);
            });
        });

        describe(".parseHeroes", function () {
            it("parses the wins and losses", async function () {
                sinon.stub(rp, 'Request').resolves(playerHeroesMock);
                await testPlayer.parseHeroes();
                expect(testPlayer.heroData).toEqual(JSON.parse(playerHeroesMock));
            });
        });
    });

    describe(".fullName", function () {
        it("returns the username if no mainname set", function () {
            testPlayer.username = "foobar";
            expect(testPlayer.fullName).toEqual("foobar");
        });

        it("returns the mainname attached if set", function () {
            testPlayer.username = "foobar";
            testPlayer.mainname = "foobaz";
            expect(testPlayer.fullName).toEqual(`foobar (foobaz)`)
        });
    });

    describe(".numericalRank", function () {
        it("returns the correct rank number", function () {
            testPlayer.rank = 75;
            expect(testPlayer.numericalRank).toEqual(7);
        });
    });

    describe(".numericalTier", function () {
        it("returns the correct tier number", function () {
            testPlayer.rank = 75;
            expect(testPlayer.numericalTier).toEqual(5);
        });
    });

    describe(".readableRank", function () {
        it("returns the correctly formated rank text", function () {
            testPlayer.rank = 75;
            expect(testPlayer.readableRank).toEqual(`Divine [5]`);
        });

        it("adds the suffix if player on leaderboard", function () {
            testPlayer.rank = 75;
            testPlayer.leaderboardRank = 520;
            expect(testPlayer.readableRank).toEqual(`Divine [5] - Rank 520`);
        });
    });

    describe(".winrate", function () {
        it("should calculate the winrate correctly", function () {
            testPlayer.wins = 2710;
            testPlayer.losses = 1551;
            expect(testPlayer.winrate).toEqual('63.60');
        });
    });

    describe(".heroWinrate", function () {
        it("should calculate the hero winrate correctly", function () {
            expect(testPlayer.heroWinrate(100, 50)).toEqual('50.00');
        });
    });

    describe(".heroSummary", function () {
        it("should calculate the hero winrate correctly", function () {
            testPlayer.heroData = JSON.parse(playerHeroesMock);
            let expectedSummary = "**1:** Lone Druid (played: 672, winrate: 67.71%)\n**2:** Nature's Prophet (played: 506, winrate: 64.82%)\n**3:** Batrider (played: 185, winrate: 65.41%)\n**4:** Clockwerk (played: 165, winrate: 68.48%)\n**5:** Broodmother (played: 165, winrate: 64.85%)\n";
            expect(testPlayer.heroSummary).toEqual(expectedSummary);
        });
    });

    describe(".embedify", function () {
        it("shoud return an embed object", function () {
            testPlayer.rank = 75;
            testPlayer.heroData = JSON.parse(playerHeroesMock);
            expect(testPlayer.embedify().ember).toBeTruthy;
        });
    });
});