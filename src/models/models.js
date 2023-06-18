class _HeroModel {

    constructor(id, name, image) {
        this.id = id;
        this.name = name;
        this.image = image;
    }
}

class _HeroProfileModel {

    constructor(str, int, agi, luk) {
        this.int = int;
        this.str = str;
        this.agi = agi;
        this.luk = luk;
    }
}

export class RetrieveHeroListModel {

    constructor(heroes) {
        this.heroes = heroes;
    }
}

export class RetrieveHeroDetailListModel extends RetrieveHeroListModel{
    
    constructor(heroes) {
        super(heroes);
    }
}

export class RetrieveSingleHeroModel extends _HeroModel {
    constructor(id, name, image) {
        super(id, name, image);
    }
}

export class RetrieveSingleHeroDetailModel extends _HeroModel {

    constructor(id, name, image, str, int, agi, luk) {
        super(id, name, image);
        this.profile = new _HeroProfileModel(str, int, agi, luk);
    }
}
