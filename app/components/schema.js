'use client'
import {useState} from "react";

import ModalPicker from "@/app/components/modal";
import Search from "@/app/components/search";
import Image from "next/image";
import {regions} from "@/app/lib/constants";

export default function Schema({pokemons, schema}) {
    let [show, setShow] = useState(false)
    let [picked, setPicked] = useState([[null, null, null], [null, null, null], [null, null, null]])
    let [types, setTypes] = useState([])
    let [lastIndexes, setLastIndexes] = useState([])
    let [guess,setGuess] = useState('')
    let [guessColor, setGuessColor] = useState('')

    function handleTableClick(rowIndex, colIndex) {
        setGuessColor('')
        setGuess('')
        setTypes([schema[0][rowIndex], schema[1][colIndex]])
        setLastIndexes([rowIndex, colIndex])
        console.log("Picked cell with types ", types)
        setShow(true)
    }

    function handlePokemonPick(p) {
        setShow(false)
        if (regions.includes(types[1])) {
            if (p.region === types[1] && (p.types[0]===types[0] || p.types[1]===types[0])) {
                setPicked(picked.map((row, i) => i !== lastIndexes[0] ? row : row.map((col, j) => j !== lastIndexes[1] ? col : p)))
            }
        }else if (p.types.length > 1) {
            if ((p.types[0] === types[0] || p.types[1] === types[0]) && (p.types[0] === types[1] || p.types[1] === types[1])) {
                setPicked(picked.map((row, i) => i !== lastIndexes[0] ? row : row.map((col, j) => j !== lastIndexes[1] ? col : p)))
                setGuessColor("green")
                setGuess("Correct guess!")
            } else {
                setGuessColor("red")
                setGuess("Wrong guess!")
            }
        } else {
            setGuessColor("red")
            setGuess("Wrong guess!")
        }
    }

    function getCellContent(row, col) {
        if (picked[row][col] === null) {
            return <button onClick={(e) => handleTableClick(row, col)}>Pick</button>
        } else {
            return <Image src={picked[row][col].sprite_url} alt={picked[row][col].name} width={100} height={100}/>
        }
    }

    return <>
        <table>
            <thead>
            <tr>
                <th scope="col"></th>
                {schema[1].map(t => <th scope="col" key={t}>{t}</th>)}
            </tr>
            </thead>
            <tbody>
            {schema[0].map((type, i) => {
                return <tr key={type}>
                    <th scope="row">{type}</th>
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

    </>
}