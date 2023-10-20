'use client'
import {useState} from "react";
import {regions, types} from "@/app/lib/constants";
import {getRandomArrayElement} from "@/app/lib/utils";

export default function TypeQuiz({pokemons}) {
    let [score, setScore] = useState(0)
    let [guess, setGuess] = useState('')
    let [disabled, setDisabled] = useState([...types,'none'].map(r=>false))
    let [partial,setPartial] = useState(false)
    let [guessColor,setGuessColor] = useState('')
    let [current, setCurrent] = useState(getRandomArrayElement(pokemons))
    let [bgColor, setBgColor] = useState(types.map(()=>({})))

    function handleClick(r,i) {
        if (current.types.includes(r) || (current.types.length===1 && r==='none')) {
            if(partial) {
                setScore(score + 1)
                setGuess('')
                setPartial(false)
                setDisabled(disabled.map(x => false))
                setBgColor(bgColor.map(() => ({})))
                let index = Math.floor(Math.random()*pokemons.length)
                setCurrent(pokemons[index])
            } else {
                setPartial(true)
                setGuess('Correct, pick other type')
                setGuessColor('green')
                setDisabled(disabled.map((region,index) => index === i ? true : region))
                setBgColor(bgColor.map((region, index) => index === i ? ({backgroundColor:"green"}):region))
            }

        } else {
            setScore(0)
            setGuess('Wrong guess! Try again')
            setGuessColor('red')
            setDisabled(disabled.map((region,index) => index === i ? true : region))
        }
    }

    return <div className={"flex flex-col flex-nowrap gap-2 px-2"}>
        <h1 className={"font-bold text-2xl mt-2"}>Guess the types</h1>
        <h2 className={"font-semibold text-xl"}>Score: {score}</h2>
        <img className={"w-3/6"} src={current.sprite_url} alt={current.name}/>
        <h3 className={"text-lg"}>{current.display_name}</h3>
        {guess !== '' && <span style={{color:guessColor}}>{guess}</span>}
        <div className={"flex flex-row flex-wrap place-content-stretch"}>
            {[...types,'none']
                .map((r,i) =>
                    <div className={"basis-1/3 px-3"} key={r}>
                        <button className={"w-full mb-2 disabled:bg-gray-500 bg-blue-200 dark:bg-blue-800 hover:bg-blue-500 rounded-full py-1 px-2 font-semibold"}
                                disabled={disabled[i]} style={bgColor[i]} onClick={() => handleClick(r,i)}>{r}</button>
                    </div> )}
        </div>
    </div>
        // <div>{types.map((r,i) => <button role={"button"} style={{width:'30%',margin:'5px',padding:'auto'}} disabled={disabled[i]} key={r} onClick={() => handleClick(r,i)} aria-label={r} >{r}</button>)}
        //     <button role={"button"} style={{width:'30%',margin:'5px',padding:'auto'}} disabled={disabled[types.length]} onClick={() => handleClick('none',types.length)} aria-label={'none'} >none</button>
        // </div>
}

