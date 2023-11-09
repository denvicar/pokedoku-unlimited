 const getRandomArrayElement = (ts) => {
    let i = Math.floor(Math.random()*ts.length)
    return ts[i]
}

 const pokemonToCategoryArray = (pokemon) => {
    let ret = [pokemon.name, ...pokemon.types, pokemon.region]
    if (pokemon.is_legendary) ret.push("Legendary")
    if (pokemon.is_mythical) ret.push("Mythical")
    if (pokemon.is_mega) ret.push("Mega")
    if (pokemon.is_fossil) ret.push("Fossil")
    if (pokemon.is_baby) ret.push("Baby")
    if (pokemon.is_base_form) ret.push("BaseForm")
    if (!pokemon.is_base_form && !pokemon.first_in_line) ret.push("Evolved")
    if (pokemon.types.length===1) ret.push("Monotype")
    else ret.push("Dual Type")
    if (pokemon.is_paradox) ret.push("Paradox")
    if (pokemon.is_gmax) ret.push("Gmax")
     if (pokemon.first_in_line) ret.push("First in line")
     if (pokemon.last_in_line) ret.push("Last in line")
     if (pokemon.has_gender_differences) ret.push("Gender difference")
    return ret
}


 const checkWinningPicks = (picks) => {
    if (picks && picks.every(row => row.every(item => item!==null))) return true
}

 const areSetsEqual = (setA, setB) => {
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

 function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function filterPokemons(pokemons) {
    return pokemons.filter(p=>!p.name.includes("minior") && !p.name.includes("pumpkaboo") && !p.name.includes("ogerpon"))
}

export  {getRandomArrayElement,pokemonToCategoryArray, checkWinningPicks, areSetsEqual, shuffleArray, filterPokemons}
