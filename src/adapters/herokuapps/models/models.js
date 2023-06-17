export class RetrieveHerokuHeroModel {
    constructor(id, name, image) {
        this.id = id;
        this.name = name;
        this.image = image;
    }

    static fromJSON(json) {
        return new RetrieveHerokuHeroModel(json.id, json.name, json.image);
    }
}

export class RetrieveHerokuHeroProfileModel {
    constructor(str, int, agi, luk) {
        this.int = int;
        this.str = str;
        this.agi = agi;
        this.luk = luk;
    }

    static fromJSON(json) {
        return new RetrieveHerokuHeroProfileModel(json.int, json.str, json.agi, json.luk);
    }
}