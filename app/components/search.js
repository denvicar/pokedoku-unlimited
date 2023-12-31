'use client'
import {useState} from "react";
import Button from "@/app/components/button";
import Fuse from 'fuse.js'

export default function Search({pokemons, inputRef, handlePick, imageToShow}) {
    let [name, setName] = useState("")
    const options = {
        includeScore: false,
        keys: ['display_name']
    }
    const fuse = new Fuse(pokemons,options)


    return <div className={"h-fit"}>
        <input ref={inputRef} autoCorrect={"off"} autoComplete={"off"} className={"relative ml-[8%] bg-slate-200 placeholder-gray-800/75 dark:placeholder-gray-50/75 px-2 dark:bg-slate-800 rounded-full border border-slate-800 dark:border-slate-50 w-[84%] h-10 hover:bg-slate-400 focus:bg-slate-400 dark:hover:bg-slate-600 dark:focus:bg-slate-600 focus:outline-none"} value={name} onChange={(e) => setName(e.target.value)} type="text"
               placeholder="Start writing the pokemon name..."/>



        <div hidden={name.trim()===''} className={"h-[40vh] overflow-y-scroll mt-5"}>
            {name.trim()!=='' &&
                fuse.search(name)
                    .map(searchItem => searchItem.item)
                    .slice(0,10)
                    .map(p =>
                    <div key={p.pokedex_number} className={"flex flex-row flex-nowrap gap-0 text-[0.75rem] md:text-sm ml-2"}>
                        <div className={"flex-none w-1/5 md:w-[8%]"}><img className={" flex-none"} src={p[imageToShow]} alt={p.name} /></div>
                        <div className={"flex-auto mt-6"}><span className={"align-middle mr-2"}>{p.display_name}</span>
                        <span className={"mr-1 align-middle"}>{p.types[0]}</span>
                            {p.types.length >1 && <span className={" align-middle"}>{p.types[1]}</span>}</div>
                        <div className={"mt-5 mr-1 w-1/5 flex-none"}><button className={"w-[90%] h-8 disabled:bg-gray-500 bg-blue-200 dark:bg-blue-800 hover:bg-blue-500 rounded-full py-1 px-2 font-semibold"} onClick={() => {
                            setName(""); handlePick(p)
                        }}>{"Pick"}</button></div>
                    </div>)}
        </div>
    </div>
}