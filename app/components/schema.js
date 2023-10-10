'use client'
import {useEffect, useState} from "react";

import Search from "@/app/components/search";
import Image from "next/image";
import {regions, types as constTypes} from "@/app/lib/constants";
import {buildSchema} from "@/app/lib/gameSchema";
import PokemonList from "@/app/components/pokemonList";
import '../home.css'
import {pick} from "next/dist/lib/pick";
import {pokemonToCategoryArray} from "@/app/lib/utils";

export default function Schema({pokemons}) {
    let [show, setShow] = useState(false)
    let [picked, setPicked] = useState([[null, null, null], [null, null, null], [null, null, null]])
    let [types, setTypes] = useState([])
    let [lastIndexes, setLastIndexes] = useState([])
    let [guess,setGuess] = useState('')
    let [guessColor, setGuessColor] = useState('')
    let [schema,setSchema] = useState()
    let [solutionTypes,setSolutionTypes] = useState([])
    let [surrender,setSurrender] = useState(false)
    let [win,setWin] = useState(false)

    useEffect(() => {
        let ignore = false;
        if (!ignore) {
            if (localStorage.getItem("schema")) {
                setSchema(JSON.parse(localStorage.getItem("schema")))
            } else {
                let s = buildSchema(pokemons)
                setSchema(s)
                localStorage.setItem("schema", JSON.stringify(s))
            }
        }
        return ()=>{ignore=true}
    }, [pokemons]);

    useEffect(() => {
        let ignore = false;
        if (!ignore) {
            if (localStorage.getItem("picks")) {
                setPicked(JSON.parse(localStorage.getItem("picks")))
            }
        }
        return ()=>{ignore=true}
    }, [pokemons]);

    function updatePicks(p) {
        let newPicked = picked.map((row, i) => i !== lastIndexes[0] ? row : row.map((col, j) => j !== lastIndexes[1] ? col : p))
        setPicked(newPicked)
        localStorage.setItem("picks",JSON.stringify(newPicked))
    }

    function handleTableClick(rowIndex, colIndex) {
        setGuessColor('')
        setGuess('')
        if(!surrender && !win) {
            setTypes([schema[0][rowIndex], schema[1][colIndex]])
            setLastIndexes([rowIndex, colIndex])
            console.log("Picked cell with types ", types)
            setShow(true)
        } else {
            console.log('Surrendered so showing solution')
            setSolutionTypes([schema[0][rowIndex],schema[1][colIndex]])
        }
    }

    function handlePokemonPick(p) {
        setShow(false)
        let pokemonCategoryArray = pokemonToCategoryArray(p)

        if (pokemonCategoryArray.includes(types[0]) && pokemonCategoryArray.includes(types[1])) {
            updatePicks(p)
            setGuessColor("green")
            setGuess("Correct guess!")
        } else {
            setGuessColor("red")
            setGuess("Wrong guess!")
        }

        if (picked.every(row=> row.every(item=>item))) setWin(true)
    }

    function getCellContent(row, col) {
        if (picked[row][col] === null) {
            return <div className={types[0]===schema[0][row] && types[1]===schema[1][col] ? 'clicked':''} style={{border:'1px solid white',height:'4.5em',width:'4.5em'}} onClick={(e) => handleTableClick(row, col)}></div>
        } else {
            if(!surrender && !win) {
                return <Image src={picked[row][col].sprite_url} alt={picked[row][col].name} width={150} height={150}/>
            } else {
                return <Image src={picked[row][col].sprite_url} alt={picked[row][col].name} width={150} height={150} onClick={()=>handleTableClick(row,col)}/>
            }
        }
    }

    function handleSurrender() {
        if (!surrender) {
            setWin(false)
            setSurrender(true)
            setGuess('')
            setGuessColor('')
            setShow(false)
        } else {
            handleRegenerate()
        }
    }

    function handleRegenerate() {
        setWin(false)
        setPicked([[null, null, null], [null, null, null], [null, null, null]])
        setShow(false)
        setGuess('')
        setGuessColor('')
        setTypes([])
        setLastIndexes([])
        setSolutionTypes([])
        setSurrender(false)
        let s = buildSchema(pokemons)
        setSchema(s)
        localStorage.setItem("schema",JSON.stringify(s))
        localStorage.removeItem("picks")

    }

    return schema && <>
        <button onClick={()=> handleRegenerate()}>Regenerate schema</button>
        <button onClick={() => handleSurrender()}>{surrender ? 'Restart':'Surrender'}</button>
        <table >
            <thead>
            <tr>
                <th scope="col"><div style={{width:"4em"}}></div></th>
                {schema[1].map(t => <th scope="col" key={t}>{constTypes.includes(t) ? <Image width={75} height={75} src={"/"+t+".png"}  alt={t}/> : <span className={"schema-text"}>{t}</span> }</th>)}
            </tr>
            </thead>
            <tbody>
            {schema[0].map((type, i) => {
                return <tr key={type}>
                    <th scope="row">{constTypes.includes(type) ? <Image width={75} height={75} src={"/"+type+".png"}  alt={type}/> : <span className={"schema-text"}>{type}</span>}</th>
                    <td>
                        {getCellContent(i, 0)}
                    </td>
                    <td>
                        {getCellContent(i, 1)}
                    </td>
                    <td>
                        {getCellContent(i, 2)}
                    </td>
                </tr>
            })}
            </tbody>
        </table>
        {guess!=='' && <span style={{color:guessColor}}>{guess}</span>}
        {show && <Search pokemons={pokemons} handlePick={handlePokemonPick}/>}
        <PokemonList pokemons={pokemons} types={solutionTypes} />

    </>
}