'use client'

export default function Button({handleClick, label}) {
    return <button className={"disabled:bg-gray-500 bg-blue-200 dark:bg-blue-800 hover:bg-blue-500 rounded-full py-1 px-2 font-semibold"} onClick={handleClick}>{label}</button>
}