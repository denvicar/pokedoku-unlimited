'use client'
import {useState} from "react";
import {pokemonToCategoryArray} from "@/app/lib/utils";
import PokemonList from "@/app/components/pokemonList";

export default function ExtendedSearch({pokemons}) {
    let [params,setParams] = useState("")

    function filterPokemons() {
        return pokemons
            .filter(p => {
                let pcat = pokemonToCategoryArray(p).map(cat => cat.toLowerCase()).map(cat => cat==='dual type' ? 'dualtype' : cat)
                return params.split(" ").every(param => pcat.includes(param.toLowerCase()))
            })
    }


    return (
        <div className={"mt-5 w-full"}>
            <h1 className={"text-2xl font-bold text-center"}>Parameters separated by space</h1>
            <input className={"bg-slate-200 placeholder-gray-800/75 dark:placeholder-gray-50/75 px-2 dark:bg-slate-800 rounded-full border border-slate-800 dark:border-slate-50 w-[90%] h-10 ml-[5%] hover:bg-slate-400 focus:bg-slate-400 dark:hover:bg-slate-600 dark:focus:bg-slate-600 focus:outline-none"}
                   type={"text"} placeholder={"Insert parameters"} value={params} onChange={(e) => setParams(e.target.value)} />

                {params!=='' && filterPokemons()
                    .map(p =>
                        <div key={p.pokedex_number} className={"flex flex-row flex-nowrap justify-around"}>
                            <img src={p.sprite_url} alt={p.name} />
                            <div><span className={"align-middle mr-2 leading-[5rem]"}>{p.display_name}</span>
                                <span className={"mr-1 leading-[5rem] align-middle"}>{p.types[0]}</span>
                                {p.types.length >1 && <span className={"leading-[5rem] align-middle"}>{p.types[1]}</span>}</div>
                        </div>)}

        </div>
    )
}