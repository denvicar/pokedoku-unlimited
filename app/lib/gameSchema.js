import {special, types, SCHEMA_SIZE, regions, decodingArray} from "@/app/lib/constants";
import {areSetsEqual, getRandomArrayElement, pokemonToCategoryArray} from "@/app/lib/utils";

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
        let solutionSets = []
        columns = new Set()
        let availableCategories = new Set(categories)
        rows = generateRows(availableCategories)
        let pokemonCategories = mapPokemonsToCategoryArray(pokemons,rows)
        for (let i = 0; i<SCHEMA_SIZE; i++) {
            availableCategories = getAvailableCategoriesByRows([...rows], pokemonCategories, availableCategories)
            let category = getRandomArrayElement([...availableCategories])
            if (category) {
                solutionSets.push(...getSolutionSets(rows,category,pokemonCategories))
                if (checkSolutionSets(solutionSets)) columns.add(category)
                availableCategories.delete(category)
            }
        }
    }

    return [rows,columns]

}

const checkSolutionSets = (solutionSets) => {
    for (const set of solutionSets) {
        let count = 1;
        for (let i = 0; i<solutionSets.length; i++) {
            if (areSetsEqual(set, solutionSets[i])) {
                count++
            }
        }
        if (set.size <= count) return false
    }
    return true
}


const getSolutionSets = (rows, colCategory, pokemonCategoryArray) => {
    let solutionSets = []
    for (const rowCategory of rows ) {
        let s = new Set(pokemonCategoryArray
            .filter(pcat => pcat.includes(rowCategory) && pcat.includes(colCategory))
            .map(pcat => pcat[0]))
        if (s.size < 9) solutionSets.push(s)
    }
    return solutionSets
}

const buildSchema = (pokemons) => {
    let completeSchema = generateColumns(pokemons)
    let rows = completeSchema[0]
    let columns = completeSchema[1]
    return [[...rows],[...columns]]
}

const buildHardSchema = (pokemons) => {
    let thirdRow = new Set()
    let rows = []
    let cols = []
    while (thirdRow.size!==3) {
        let s = buildSchema(pokemons)
        rows = s[0]
        cols = s[1]
        thirdRow = new Set()

        let availableTypes = categories.filter(cat => !rows.includes(cat) && !cols.includes(cat))
        let pokemonCategories = mapPokemonsToCategoryArray(pokemons,new Set(rows),new Set(cols))

        for (let i = 0; i < SCHEMA_SIZE; i++) {
            const availableTypesByColumn = availableTypes
                .filter(type => rows
                    .every(rowType => pokemonCategories
                        .filter(pokemon => [type,rowType,cols[i]].every(x=>pokemon.includes(x))).length>0))
            if (availableTypesByColumn.length!==0) {
                const randomType = getRandomArrayElement(availableTypesByColumn)
                thirdRow.add(randomType)
                availableTypes = availableTypes.filter(t => t !== randomType)
            }
        }
    }

    return [rows,cols,[...thirdRow]]
}

const buildSchemaCode = (schema) => {
    let ret = ""
    if (!schema) return ret
    for (let row of schema) {
        for (let col of row) {
            let index = categories.indexOf(col)
            ret += decodingArray.charAt(index)
        }
    }
    return ret
}

const decodeSchemaCode = (code) => {
    if (code.trim().length > 6) return decodeHardSchemaCode(code)
    code = code.trim().substring(0,6).toLowerCase()
    let rows = []
    let cols = []
    for (let i = 0; i< code.length; i++) {
        let index = decodingArray.indexOf(code.charAt(i))

        if (i<3) {
            rows.push(categories[index])
        } else {
            cols.push(categories[index])
        }
    }
    return [[...rows],[...cols]]
}

const decodeHardSchemaCode = (code) => {
    code = code.trim().substring(0,9).toLowerCase()
    let rows = []
    let cols = []
    let third = []
    for (let i = 0; i< code.length; i++) {
        let index = decodingArray.indexOf(code.charAt(i))

        if (i<3) {
            rows.push(categories[index])
        } else if (i>=3 && i<6) {
            cols.push(categories[index])
        } else {
            third.push(categories[index])
        }
    }
    return [rows,cols,third]
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


const mapPokemonsToCategoryArray = (pokemons,rows,cols=new Set()) => {
    return Array.from(pokemons.values())
        .map(p => pokemonToCategoryArray(p))
        .filter(pArray => pArray.some(category => rows.has(category)) && (cols.size===0 || pArray.some(category => cols.has(category))))
}


export {buildSchema, buildSchemaCode, decodeSchemaCode, buildHardSchema}