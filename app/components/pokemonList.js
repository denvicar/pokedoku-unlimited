'use client'

import Image from "next/image";
import {regions} from "@/app/lib/constants";

export default function PokemonList({pokemons,types}) {
    function filterPokemons(pList) {
        if (regions.includes(types[1])) {
            return pList.filter(p => p.region === types[1] && (p.types[0]===types[0] || p.types[1]===types[0]))
        } else {
            return pList
                .filter(p => {
                    return (p.types[0]===types[0] || p.types[0]===types[1]) &&
                        (p.types[1]===types[0] || p.types[1]===types[1])
                })
        }
    }

    let displayedList = filterPokemons(pokemons)
    return <ul>
        {types.length===2 &&
            displayedList
                .map(p => <li key={p.pokedex_number}>
                    <Image width={80} height={80} src={p.sprite_url} alt={p.name} />
                    <span style={{marginRight:'5px'}}>{p.display_name}</span>
                    <span style={{marginRight:'5px'}}>{p.types[0]}</span>
                    {p.types.length >1 && <span style={{marginRight:'5px'}}>{p.types[1]}</span>}
                    </li>)}
    </ul>

}