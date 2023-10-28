'use client'

import {pokemonToCategoryArray} from "@/app/lib/utils";
import Button from "@/app/components/button";

export default function PokemonList({pokemons,types,imageToShow}) {
    function filterPokemons() {
        return pokemons
            .filter(p => {
                let pokemonCategoryArray = pokemonToCategoryArray(p)
                return pokemonCategoryArray.includes(types[0]) && pokemonCategoryArray.includes(types[1]);
            })
    }

    let displayedList = filterPokemons()
    return <div className={"h-fit max-h-[60vh] overflow-y-scroll"}>
        {types.length===2 &&
            displayedList
                .map(p =>
                    <div key={p.pokedex_number} className={"flex flex-row flex-nowrap justify-around"}>
                        <div className={"w-1/5 flex-none md:w-[8%]"}><img src={p[imageToShow]} alt={p.name} /></div>
                        <div><span className={"align-middle mr-2 leading-[5rem]"}>{p.display_name}</span>
                            <span className={"mr-1 leading-[5rem] align-middle"}>{p.types[0]}</span>
                            {p.types.length >1 && <span className={"leading-[5rem] align-middle"}>{p.types[1]}</span>}</div>
                    </div>)}
    </div>

}