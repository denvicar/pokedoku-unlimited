'use client'
import getData from "@/app/lib/db";
import {useEffect, useState} from "react";
import Image from "next/image";
import {regions} from "@/app/lib/constants";

export default function TypeQuiz() {
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
            setDisabled(disabled.map((region,index) => index === i))
        }
    }

    return current !== null && <div>
        <h1>Score: {score}</h1>
        <Image src={current.sprite_url} alt={current.name} width={200} height={200}/>
        <h3>{current.display_name}</h3>
        {error ?? <span style={{color:'red'}}>{error}</span>}
        {regions.map((r,i) => <button disabled={disabled[i]} key={r} onClick={() => handleClick(r)}>{r}</button>)}
    </div>
}

