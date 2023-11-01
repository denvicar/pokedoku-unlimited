'use client'
import {useEffect, useMemo, useState} from "react";
import {regions} from "@/app/lib/constants";
import {getRandomArrayElement, shuffleArray} from "@/app/lib/utils";
import Fuse from "fuse.js";
import Button from "@/app/components/button";

export default function NameQuiz({pokemons}) {
    let [score, setScore] = useState(0)
    let [error, setError] = useState(null)
    let [disabled, setDisabled] = useState([null,null,null,null].map(r=>false))
    let [current, setCurrent] = useState(getRandomArrayElement(pokemons))
    let [image, setImage] = useState()

    useEffect(() => {
        let ignore = false;
        if (!ignore) {
            let loadedArt = 'sprite_url'
            if (localStorage.getItem("defaultArt")) loadedArt = localStorage.getItem("defaultArt")
            setImage(loadedArt)
        }
        return () => {ignore = true}
    }, []);

    const options = {
        includeScore: false,
        keys: ['display_name']
    }
    const fuse = new Fuse(pokemons,options)
    const searchResult = useMemo(() => fuse
        .search(current.display_name)
        .map(si=>si.item.display_name)
        .filter(p=>p!==current.display_name)
        .slice(0,10),[current.display_name, fuse])

    let nameOptions = useMemo(()=> {
        let ret = new Set()
        ret.add(current.display_name)
        while (ret.size<4) {
            ret.add(getRandomArrayElement(searchResult))
        }
        ret = [...ret]
        shuffleArray(ret)
        return ret
    },[current.display_name,pokemons])

    function handleClick(name,i) {
        if (current.display_name === name) {
            setScore(score + 1)
            setError(null)
            setDisabled(disabled.map(x => false))
            setCurrent(getRandomArrayElement(pokemons))
        } else {
            setScore(0)
            setError('Wrong guess! Try again')
            setDisabled(disabled.map((name,index) => index === i ? true : name))
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
        <h1 className={"font-bold text-2xl mt-2"}>Guess the name</h1>
        <div className={"flex flex-row gap-5 h-8"}><h2 className={"font-semibold text-xl"}>Score: {score}</h2> <Button handleClick={() => handleSwitchClick()} label={image === 'sprite_url' ? 'Switch to art' : 'Switch to sprite'} /></div>
        <img className={"w-3/6"} src={current[image]} alt={current.pokedex_number}/>
        {/*<h3 className={"text-lg"}>{current.display_name}</h3>*/}
        {error !== null && <span style={{color:"red"}}>{error}</span>}
        <div className={"flex flex-row flex-wrap place-content-stretch"}>
            {nameOptions
                .map((name,i) =>
                    <div className={"basis-1/2 px-3"} key={name}>
                        <button className={"w-full mb-2 disabled:bg-gray-500 bg-blue-200 dark:bg-blue-800 hover:bg-blue-500 rounded-full py-1 px-2 font-semibold"}
                                disabled={disabled[i]} onClick={() => handleClick(name,i)}>{name}</button>
                    </div> )}
        </div>
    </div>
}