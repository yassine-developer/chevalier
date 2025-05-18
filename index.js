class Chevalier {
    constructor(name, strength, magic, life = 100, mana = 50, potions = 2) {
        this.name = name;
        this.strength = strength;
        this.magic = magic;
        this.life = life;
        this.mana = mana;
        this.potions = potions;
    }

    shout() {
        return `${this.name} est pret pour le combat !`;
    }

    attack(target) {
        let degats;
        if (this.strength === target.strength) {
            degats = 10;
        } else if (this.strength > target.strength) {
            degats = Math.round((this.strength - target.strength) * 0.8 + 2);
        } else {
            degats = Math.round((target.strength - this.strength) * 0.5 + 1);
        }

        target.getDamages(degats);
        return `${this.name} attaque ${target.name} et lui inflige ${degats} points de dégâts.`;
    }

    magicAttack(target) {
        if (this.mana < 20) {
            return `${this.name} n'a pas assez de mana pour lancer un sort.`;
        }
        this.mana -= 20;
        target.getDamages(this.magic);
        return `${this.name} lance un sort sur ${target.name} et lui inflige ${this.magic} points de dégâts.`;
    }

    getDamages(amount) {
        this.life -= amount;
        if (this.life < 0) {
            this.life = 0;
        }
        // else{
        // return `${this.name} subit ${amount} points de dégâts, PV restants : ${this.life.toFixed(2)}`;
        // }
    }

    usePotion() {
        if (this.potions <= 0) {
            return `${this.name} n'a plus de potions.`;
        }
        if (this.life === 100) {
            return `${this.name} a déjà tous ses PV.`;
        }
        this.potions--;
        this.life += 30;
        if (this.life > 100) this.life = 100;
        return `${this.name} utilise une potion, PV actuels : ${this.life}, potions restantes : ${this.potions}`;
    }

    isDead() {
        return this.life <= 0;
    }
}


document.getElementById('knights').style.display = 'grid';
document.querySelector('.container').style.display = 'none';
document.querySelector('#log').style.display = 'none';

let chevalier1, chevalier2;

document.getElementById('knights').addEventListener('submit', function (e) {
    e.preventDefault();

    // Recuperer les donnees pour les chevaliers
    const name1 = document.getElementById('nameInput1').value;
    const strength1 = parseInt(document.getElementById('strength1').value);
    const magic1 = parseInt(document.getElementById('magicInput1').value);

    const name2 = document.getElementById('nameInput2').value;
    const strength2 = parseInt(document.getElementById('strength2').value);
    const magic2 = parseInt(document.getElementById('magicInput2').value);


    chevalier1 = new Chevalier(name1, strength1, magic1);
    chevalier2 = new Chevalier(name2, strength2, magic2);

    // Cacher le formulaire et montrer les chevaliers
    document.getElementById('knights').style.display = 'none';
    document.querySelector('.container').style.display = 'flex';
    document.querySelector('#log').style.display = 'block';

    // Mettre a jour l'interface
    updateInterface();
    logFight(chevalier1.shout());
    logFight(chevalier2.shout());
});

function updateInterface() {

    //mettre a jour l'interface pour le chavalier1
    document.getElementById('name1').textContent = chevalier1.name;
    document.getElementById('life1').textContent = Math.round(chevalier1.life);
    document.getElementById('mana1').textContent = chevalier1.mana;
    document.getElementById('potions1').textContent = chevalier1.potions;
    const pourcentageVie1 = Math.max(0, Math.min(chevalier1.life, 100));
    document.getElementById('barreVie1').style.width = `${pourcentageVie1}%`;

    //mettre a jour l'interface pour le chavalier2
    document.getElementById('name2').textContent = chevalier2.name;
    document.getElementById('life2').textContent = Math.round(chevalier2.life);
    document.getElementById('mana2').textContent = chevalier2.mana;
    document.getElementById('potions2').textContent = chevalier2.potions;
    const pourcentageVie2 = Math.max(0, Math.min(chevalier2.life, 100));
    document.getElementById('barreVie2').style.width = `${pourcentageVie2}%`;

    // Desactiver les boutons si le chevalier1 est mort
    document.getElementById('attack1').disabled = chevalier1.isDead() || chevalier2.isDead();
    document.getElementById('magic1').disabled = chevalier1.isDead() || chevalier2.isDead();
    document.getElementById('potion1').disabled = chevalier1.isDead() || chevalier1.potions === 0 || chevalier1.life === 100 || chevalier2.isDead();

    // Desactiver les boutons si le chevalier2 est mort
    document.getElementById('attack2').disabled = chevalier2.isDead() || chevalier1.isDead();
    document.getElementById('magic2').disabled = chevalier2.isDead() || chevalier1.isDead();
    document.getElementById('potion2').disabled = chevalier2.isDead() || chevalier2.potions === 0 || chevalier2.life === 100 || chevalier1.isDead();
    

}

//les log du combat
function logFight(message) {
    const logElement = document.querySelector("#log");
    //li faut afficher les messages recu lorsque les bouttons sont actionner
    logElement.innerHTML += message + "<br>";
}




//les actions des bouttons

document.querySelector("#attack1").addEventListener('click', () => {
    logFight(chevalier1.attack(chevalier2));
    updateInterface();
    if (chevalier2.isDead()) {
        logFight(`${chevalier2.name} est mort. ${chevalier1.name} gagne le combat!`)
    }
})

document.querySelector("#magic1").addEventListener('click', () => {
    logFight(chevalier1.magicAttack(chevalier2));
    updateInterface();
    if (chevalier2.isDead()) {
        logFight(`${chevalier2.name} est mort. ${chevalier1.name} gagne le combat!`)
    }
})

document.querySelector("#potion1").addEventListener(('click'), () => {

    logFight(chevalier1.usePotion());
    updateInterface();
})

document.querySelector("#attack2").addEventListener('click', () => {
    logFight(chevalier2.attack(chevalier1));
    updateInterface();
    if (chevalier1.isDead()) {
        logFight(`${chevalier1.name} est mort. ${chevalier2.name} gagne le combat!`)
    }
})

document.querySelector("#magic2").addEventListener('click', () => {
    logFight(chevalier2.magicAttack(chevalier1));
    updateInterface();
    if (chevalier1.isDead()) {
        logFight(`${chevalier1.name} est mort. ${chevalier2.name} gagne le combat!`)
    }
})

document.querySelector("#potion2").addEventListener(('click'), () => {

    logFight(chevalier2.usePotion());
    updateInterface();
})

