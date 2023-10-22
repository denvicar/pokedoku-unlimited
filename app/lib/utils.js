const paradox_pokemons = [
    'great-tusk',
    'scream-tail',
    'brute-bonnet',
    'flutter-mane',
    'slither-wing',
    'sandy-shocks',
    'roaring-moon',
    'koraidon',
    'walking-wake',
    'raging-bolt',
    'iron-treads',
    'iron-bundle',
    'iron-hands',
    'iron-jugulis',
    'iron-moth',
    'iron-thorns',
    'iron-valiant',
    'miraidon',
    'iron-leaves',
    'iron-crown'
]

export const getRandomArrayElement = (ts) => {
    let i = Math.floor(Math.random()*ts.length)
    return ts[i]
}

export const pokemonToCategoryArray = (pokemon) => {
    let ret = [pokemon.name, ...pokemon.types, pokemon.region]
    if (pokemon.is_legendary || pokemon.is_mythical) ret.push("Legendary")
    if (pokemon.is_mega) ret.push("Mega")
    if (pokemon.is_fossil) ret.push("Fossil")
    if (pokemon.is_baby) ret.push("Baby")
    if (pokemon.is_base_form) ret.push("BaseForm")
    else ret.push("Evolved")
    if (pokemon.types.length===1) ret.push("Monotype")
    else ret.push("Dual Type")
    if (paradox_pokemons.includes(pokemon.name)) ret.push("Paradox")
    return ret
}


export const checkWinningPicks = (picks) => {
    if (picks.every(row => row.every(item => item!==null))) return true
}

export const areSetsEqual = (setA, setB) => {
    if (setA.size !== setB.size) {
        return false
    }

    for (const pokemon of setA) {
        if (!setB.has(pokemon)) {
            return false
        }
    }
    return true
}