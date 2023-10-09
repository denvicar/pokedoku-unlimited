'use client'
import {useState} from "react";
import Image from "next/image";

export default function Search({pokemons, handlePick}) {
    let [name, setName] = useState("")
    let p = ""

    return <div>
        <input value={name} onChange={(e) => setName(e.target.value)} type="text"
               placeholder="Start writing the pokemon name..."/>

        <ul style={{padding:0,margin:0}}>
            {name.trim()!=='' &&
            pokemons
                .filter(p => p.name.includes(name.trim().toLowerCase()))
                .map(p => <li style={{listStyleType:'none'}} key={p.pokedex_number}>
                    <Image width={80} height={80} src={p.sprite_url} alt={p.name} />
                    <span style={{marginRight:'5px'}}>{p.display_name}</span>
                    <span style={{marginRight:'5px'}}>{p.types[0]}</span>
                    {p.types.length >1 && <span style={{marginRight:'5px'}}>{p.types[1]}</span>}
                    <span role={"button"} onClick={() => handlePick(p)}>Pick</span></li>)}
        </ul>
    </div>
}