const decodingArray = "abcdefghijklmnopqrstuvwxyz0123456789@#"

const types = [
    'fire',
    'water',
    'grass',
    'electric',
    'ice',
    'poison',
    'ground',
    'normal',
    'rock',
    'flying',
    'ghost',
    'dark',
    'dragon',
    'fairy',
    'fighting',
    'psychic',
    'bug',
    'steel',
]
const regions = [
    'Kanto',
    'Johto',
    'Hoenn',
    'Sinnoh',
    'Unova',
    'Kalos',
    'Alola',
    'Galar',
    'Paldea',
    'Hisui',
]
const special = [
    'Legendary',
    'Monotype',
    'Mega',
    'Fossil',
    'Baby',
    'Evolved',
    'BaseForm',
    'Dual Type',
    'Paradox',
    'Mythical'
]

const SCHEMA_SIZE = 3

export {types,regions,special, SCHEMA_SIZE, decodingArray}