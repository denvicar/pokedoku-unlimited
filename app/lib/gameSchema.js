import {special, types, SCHEMA_SIZE, regions} from "@/app/lib/constants";

// genero 3 righe pescando totalmente a caso tra tipi, regioni e speciali
// rimuovo tutto quello che ho scelto e mi tengo quanto disponibile per le colonne
// recupero i pokemon filtrano per quelli che hanno le caratteristiche di riga
// ottengo i disponibili di colonna
// pesco 3 a caso

const generateRows = (availableTypes) => {
    let rows = new Set()
    while(rows.size<SCHEMA_SIZE) {
        let type = getRandomElement([...availableTypes])
        if (type) {
            rows.add(type)
            availableTypes.delete(type)
        }
    }
    return rows
}

function generateColumns(pokemons) {
    let rows = new Set()
    let columns = new Set()

    while (columns.size !== 2) {
        columns = new Set()
        let availableTypes = new Set(types)
        rows = generateRows(availableTypes)
        let pokemonTypes = simplifyPokemons(pokemons,rows)
        for (let i = 0; i<SCHEMA_SIZE-1; i++) {
            availableTypes = getAvailableTypesByRows([...rows], pokemonTypes, availableTypes)
            let type = getRandomElement([...availableTypes])
            if (type) {
                columns.add(type)
                availableTypes.delete(type)
            }
        }
    }

    return [rows,columns]

}

const buildSchema = (pokemons) => {
    let partialSchema = generateColumns(pokemons)
    let rows = partialSchema[0]
    let columns = partialSchema[1]


    // filtro per regione, non posso fare mitici e leggendari per ora
    // devo filtrare le regioni per trovare quelle che hanno tutte le righe
    let availableRegions = getAvailableRegionsByRows([...rows])
    columns.add(getRandomElement([...availableRegions]))
    return [[...rows],[...columns]]
}

const getAvailableTypesByRows = (rows, pokemonTypes, availableTypes) => {
    let returnTypes = new Set()
    let pokemonExists = false
    for (const type of availableTypes) {
        for (let i = 0; i<rows.length; i++) {
            for (const pt of pokemonTypes) {
                if ((pt[0]===type || pt[1]===type) && (pt[0]===rows[i] || pt[1]=== rows[i])) {
                    pokemonExists = true
                    break
                }
            }
            if (pokemonExists === false) break
            pokemonExists = false
            if (i===rows.length-1) returnTypes.add(type)
        }
    }
    return returnTypes
}

const getAvailableRegionsByRows = (rows) => {
    let r = new Set(regions)
    if (rows.includes('dark')) r.delete('Kanto')
    r.delete('Hisui')
    return r
}

const getRandomElement = (ts) => {
    let i = Math.floor(Math.random()*ts.length)
    return ts[i]
}

const simplifyPokemons = (pokemons,rows) => {
    return Array.from(pokemons.values())
        .filter(p => p.types.length > 1)
        .filter(p => rows.has(p.types[0]) || rows.has(p.types[1]))
        .map(p => p.types)
}

export {buildSchema}