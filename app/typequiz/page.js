'use client'
import getData from "@/app/lib/db";
import {useEffect, useState} from "react";
import Image from "next/image";
import {types} from "@/app/lib/constants";

export default function RegionQuiz() {
    let [pokemons, setPokemons] = useState([])
    let [score, setScore] = useState(0)
    let [guess, setGuess] = useState('')
    let [disabled, setDisabled] = useState([...types,'none'].map(r=>false))
    let [partial,setPartial] = useState(false)
    let [guessColor,setGuessColor] = useState('')

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
        if (current.types.includes(r) || (current.types.length===1 && r==='none')) {
            if(partial) {
                setScore(score + 1)
                setGuess('')
                setPartial(false)
                setDisabled(disabled.map(x => false))
                let index = Math.floor(Math.random()*pokemons.length)
                setCurrent(pokemons[index])
            } else {
                setPartial(true)
                setGuess('Correct, pick other type')
                setGuessColor('green')
                setDisabled(disabled.map((region,index) => index === i ? true : region))
            }

        } else {
            setScore(0)
            setGuess('Wrong guess! Try again')
            setGuessColor('red')
            setDisabled(disabled.map((region,index) => index === i ? true : region))
        }
    }

    return current !== null && <article>
        <h1>Score: {score}</h1>
        <Image src={current.sprite_url} alt={current.name} width={200} height={200}/>
        <h3>{current.display_name}</h3>
        {guess !== '' && <span style={{color:guessColor}}>{guess}</span>}
        <div>{types.map((r,i) => <button role={"button"} style={{width:'30%',margin:'5px',padding:'auto'}} disabled={disabled[i]} key={r} onClick={() => handleClick(r,i)} aria-label={r} >{r}</button>)}
            <button role={"button"} style={{width:'30%',margin:'5px',padding:'auto'}} disabled={disabled[types.length]} onClick={() => handleClick('none',types.length)} aria-label={'none'} >none</button>
        </div>
    </article>
}

