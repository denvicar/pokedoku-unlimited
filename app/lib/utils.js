export const getRandomArrayElement = (ts) => {
    let i = Math.floor(Math.random()*ts.length)
    return ts[i]
}

export const pokemonToCategoryArray = (pokemon) => {
    let ret = [...pokemon.types, pokemon.region]
    if (pokemon.is_legendary || pokemon.is_mythical) ret.push("Legendary")
    if (pokemon.is_mega) ret.push("Mega")
    if (pokemon.types.length===1) ret.push("Mono-Type")
    return ret
}