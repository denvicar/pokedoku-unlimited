'use client'
import getData from "@/app/lib/db";
import {useEffect, useState} from "react";
import Image from "next/image";
import {regions} from "@/app/lib/constants";

export default function RegionQuiz() {
    let [pokemons, setPokemons] = useState([])
    let [score, setScore] = useState(0)
    let [error, setError] = useState(null)
    let [disabled, setDisabled] = useState(regions.map(r=>false))
    useEffect(() => {
        let ignore = false
        getData().then(r => {
            if(!ignore) {
                setPokemons(r)
                let index = Math.floor(Math.random()*r.length)
                setCurrent(r[index])
            }
            })
        return () => {ignore=true}
    },[])
    let [current, setCurrent] = useState(null)

    function handleClick(r,i) {
        if (current.region === r) {
            setScore(score + 1)
            setError(null)
            setDisabled(disabled.map(x => false))
            let index = Math.floor(Math.random()*pokemons.length)
            setCurrent(pokemons[index])
        } else {
            setError('Wrong guess! Try again')
            setDisabled(disabled.map((region,index) => index === i ? true : region))
        }
    }

    return current !== null && <article>
        <h1>Score: {score}</h1>
        <Image src={current.sprite_url} alt={current.name} width={200} height={200}/>
        <h3>{current.display_name}</h3>
        {error !== null && <span style={{color:"red"}}>{error}</span>}
           <div>{regions.map((r,i) => <button role={"button"} style={{width:'45%',margin:'5px',padding:'auto'}} disabled={disabled[i]} key={r} onClick={() => handleClick(r,i)} aria-label={r} >{r}</button>)}
           </div>
    </article>
}

