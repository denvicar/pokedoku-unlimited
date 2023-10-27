export const getRandomArrayElement = (ts) => {
    let i = Math.floor(Math.random()*ts.length)
    return ts[i]
}

export const pokemonToCategoryArray = (pokemon) => {
    let ret = [pokemon.name, ...pokemon.types, pokemon.region]
    if (pokemon.is_legendary) ret.push("Legendary")
    if (pokemon.is_mythical) ret.push("Mythical")
    if (pokemon.is_mega) ret.push("Mega")
    if (pokemon.is_fossil) ret.push("Fossil")
    if (pokemon.is_baby) ret.push("Baby")
    if (pokemon.is_base_form) ret.push("BaseForm")
    else ret.push("Evolved")
    if (pokemon.types.length===1) ret.push("Monotype")
    else ret.push("Dual Type")
    if (pokemon.is_paradox) ret.push("Paradox")
    return ret
}


export const checkWinningPicks = (picks) => {
    if (picks && picks.every(row => row.every(item => item!==null))) return true
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