'use client'

import Image from "next/image";
import {regions} from "@/app/lib/constants";
import {pokemonToCategoryArray} from "@/app/lib/utils";

export default function PokemonList({pokemons,types}) {
    function filterPokemons(pList) {
        return pList
            .filter(p => {
                let pokemonCategoryArray = pokemonToCategoryArray(p)
                return pokemonCategoryArray.includes(types[0]) && pokemonCategoryArray.includes(types[1]);
            })
    }

    let displayedList = filterPokemons(pokemons)
    return <ul style={{padding:0,margin:0,listStyle:'none'}}>
        {types.length===2 &&
            displayedList
                .map(p => <li style={{listStyleType:'none'}} key={p.pokedex_number}>
                    <Image width={80} height={80} src={p.sprite_url} alt={p.name} />
                    <span style={{marginRight:'5px'}}>{p.display_name}</span>
                    <span style={{marginRight:'5px'}}>{p.types[0]}</span>
                    {p.types.length >1 && <span style={{marginRight:'5px'}}>{p.types[1]}</span>}
                    </li>)}
    </ul>

}