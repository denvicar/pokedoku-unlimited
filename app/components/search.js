'use client'
import {useState} from "react";
import Button from "@/app/components/button";

export default function Search({pokemons, handlePick}) {
    let [name, setName] = useState("")

    return <div>
        <input className={"bg-slate-800 px-2 rounded-full border border-slate-50 w-5/6 h-10 ml-1 hover:bg-slate-600 focus:bg-slate-600 focus:outline-none"} value={name} onChange={(e) => setName(e.target.value)} type="text"
               placeholder="Start writing the pokemon name..."/>




            {name.trim()!=='' &&
            pokemons
                .filter(p => p.name.includes(name.trim().toLowerCase()))
                .map(p =>
                    <div key={p.pokedex_number} className={"flex flex-row flex-nowrap justify-around"}>
                        <img src={p.sprite_url} alt={p.name} />
                        <div><span className={"align-middle mr-2 leading-[5rem]"}>{p.display_name}</span>
                        <span className={"mr-1 leading-[5rem] align-middle"}>{p.types[0]}</span>
                            {p.types.length >1 && <span className={"leading-[5rem] align-middle"}>{p.types[1]}</span>}</div>
                        <div className={"mt-6"}><Button handleClick={() => handlePick(p)} label={"Pick"} /></div>
                    </div>)}

    </div>
}