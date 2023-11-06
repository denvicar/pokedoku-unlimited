'use client'
import {useEffect, useState} from "react";
import {regions, types} from "@/app/lib/constants";
import {getRandomArrayElement} from "@/app/lib/utils";
import Button from "@/app/components/button";

export default function TypeQuiz({pokemons}) {
    const [score, setScore] = useState(0)
    const [guess, setGuess] = useState('')
    const [disabled, setDisabled] = useState([...types,'none'].map(r=>false))
    const [partial,setPartial] = useState(false)
    const [guessColor,setGuessColor] = useState('')
    const [current, setCurrent] = useState(getRandomArrayElement(pokemons))
    const [bgColor, setBgColor] = useState(types.map(()=>({})))
    const [image, setImage] = useState()

    useEffect(() => {
        let ignore = false;
        if (!ignore) {
            let loadedArt = 'sprite_url'
            if (localStorage.getItem("defaultArt")) loadedArt = localStorage.getItem("defaultArt")
            setImage(loadedArt)
        }
        return () => {ignore = true}
    }, []);

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

    function handleSwitchClick() {
        let art = ""
        if (image === 'sprite_url') art = 'artwork_url'
        else art = 'sprite_url'
        setImage(art)
        localStorage.setItem("defaultArt",art)
    }

    return <div className={"flex flex-col flex-nowrap gap-2 px-2"}>
        <h1 className={"font-bold text-2xl mt-2"}>Guess the types</h1>
        <div className={"flex flex-row gap-5 h-8"}><h2 className={"font-semibold text-xl"}>Score: {score}</h2> <Button handleClick={() => handleSwitchClick()} label={image === 'sprite_url' ? 'Switch to art' : 'Switch to sprite'} /></div>
        <img className={"w-3/6"} src={current[image]} alt={current.name}/>
        <h3 className={"text-lg"}>{current.display_name}</h3>
        <span suppressHydrationWarning className={"h-8"} style={{color:guessColor}}>{guess}</span>
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

