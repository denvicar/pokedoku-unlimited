import {special, types, SCHEMA_SIZE, regions} from "@/app/lib/constants";
import {getRandomArrayElement, pokemonToCategoryArray} from "@/app/lib/utils";

// genero 3 righe pescando totalmente a caso tra tipi, regioni e speciali
// rimuovo tutto quello che ho scelto e mi tengo quanto disponibile per le colonne
// recupero i pokemon filtrano per quelli che hanno le caratteristiche di riga
// ottengo i disponibili di colonna
// pesco 3 a caso
let categories = [...types,...regions,...special]

const generateRows = (availableCategories) => {
    let rows = new Set()
    while(rows.size<SCHEMA_SIZE) {
        let type = getRandomArrayElement([...availableCategories])
        if (type) {
            rows.add(type)
            availableCategories.delete(type)
        }
    }
    return rows
}

function generateColumns(pokemons) {
    let rows = new Set()
    let columns = new Set()

    while (columns.size !== 3) {
        columns = new Set()
        let availableCategories = new Set(categories)
        rows = generateRows(availableCategories)
        let pokemonCategories = mapPokemonsToCategoryArray(pokemons,rows)
        for (let i = 0; i<SCHEMA_SIZE; i++) {
            availableCategories = getAvailableCategoriesByRows([...rows], pokemonCategories, availableCategories)
            let category = getRandomArrayElement([...availableCategories])
            if (category) {
                columns.add(category)
                availableCategories.delete(category)
            }
        }
    }

    return [rows,columns]

}

const buildSchema = (pokemons) => {
    let completeSchema = generateColumns(pokemons)
    let rows = completeSchema[0]
    let columns = completeSchema[1]


    // filtro per regione, non posso fare mitici e leggendari per ora
    // devo filtrare le regioni per trovare quelle che hanno tutte le righe
    // let availableRegions = getAvailableRegionsByRows([...rows])
    // columns.add(getRandomArrayElement([...availableRegions]))
    return [[...rows],[...columns]]
}

const getAvailableCategoriesByRows = (rows, pokemonCategoryArray, availableCategories) => {
    let returnCategories = new Set()
    let pokemonExists = false
    for (const cat of availableCategories) {
        for (let i = 0; i<rows.length; i++) {
            for (const pCats of pokemonCategoryArray) {
                if (pCats.includes(rows[i]) && pCats.includes(cat)) { // verficare che il pokemon abbia sia row[i] che cat
                    pokemonExists = true
                    break
                }
            }
            if (pokemonExists === false) break
            pokemonExists = false
            if (i===rows.length-1) returnCategories.add(cat)
        }
    }
    return returnCategories
}


const mapPokemonsToCategoryArray = (pokemons,rows) => {
    return Array.from(pokemons.values())
        .map(p => pokemonToCategoryArray(p))
        .filter(pArray => pArray.some(category => rows.has(category)))
}

export {buildSchema}