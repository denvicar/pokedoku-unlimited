//import './globals.css'
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
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css"/>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Press+Start+2P" />
            <link rel={"icon"} href={"/favicon.ico"} sizes={"any"} />
        </head>
        <body className={inter.className + " container-fluid"}>
        <nav>
            <ul>
                <li><Link href="/">Pokedoku</Link></li>
                <li><Link href="/regionquiz/">Region quiz</Link></li>
                <li><Link href="/typequiz/">Type quiz</Link></li>

            </ul>
        </nav>

        {children}</body>
        </html>
    )
}
