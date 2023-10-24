import './globals.css'
import {Inter} from 'next/font/google'
import Link from "next/link";


const inter = Inter({subsets: ['latin']})

export const metadata = {
    title: 'Pokedoku',
    description: 'Generated by create next app',
}

export default function RootLayout({children}) {
    return (
        <html lang="en">
        <head>
            {/*<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css"/>*/}
            <link rel={"icon"} href={"/favicon.ico"} sizes={"any"} />
        </head>
        <body className={inter.className}>
        <nav className={"flex flex-row gap-4 dark:bg-slate-900 bg-slate-200"}>
            <div className={"hover:bg-slate-400 dark:hover:bg-slate-600 rounded-full p-1"}><Link href="/">Pokedoku</Link></div>
            <div className={"hover:bg-slate-400 dark:hover:bg-slate-600 rounded-full p-1"}><Link href="/regionquiz/">Region quiz</Link></div>
            <div className={"hover:bg-slate-400 dark:hover:bg-slate-600 rounded-full p-1"}><Link href="/typequiz/">Type quiz</Link></div>
            {/*<div className={"hover:bg-slate-400 dark:hover:bg-slate-600 rounded-full p-1"}><Link href="/search/">Search</Link></div>*/}
        </nav>

        <div className={"md:w-1/2 lg:w-1/3"}>{children}</div>
        </body>
        </html>
    )
}
