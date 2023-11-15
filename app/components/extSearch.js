'use client'
import {useState} from "react";
import {pokemonToCategoryArray} from "@/app/lib/utils";

export default function ExtendedSearch({pokemons}) {
    let [params,setParams] = useState("")

    function filterPokemons() {
        return pokemons
            .filter(p => {
                let pcat = pokemonToCategoryArray(p).map(cat => cat.toLowerCase()).map(cat => {
                    if (cat === 'dual type') return 'dualtype'
                    if (cat === 'first in line') return 'first'
                    if (cat === 'last in line') return 'last'
                    if (cat === 'gender difference') return 'gender'
                    if (cat === 'stone evolved') return 'stone'
                    return cat
                })
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
                            <div className={"w-1/5"}><img src={p.sprite_url} alt={p.name} /></div>
                            <div><span className={"align-middle mr-2 leading-[5rem]"}>{p.display_name}</span>
                                <span className={"mr-1 leading-[5rem] align-middle"}>{p.types[0]}</span>
                                {p.types.length >1 && <span className={"leading-[5rem] align-middle mr-1"}>{p.types[1]}</span>}
                                <span className={"leading-[5rem] align-middle mr-1"}>{p.region}</span></div>
                        </div>)}

        </div>
    )
}