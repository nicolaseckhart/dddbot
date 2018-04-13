class Hero {
    constructor(data) {
        this.number = data.id;
        this.name = data.localized_name;
    }
}
module.exports = Hero;