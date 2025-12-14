"use client"

import { useState } from "react"
import Link from "next/link"

export default function Searchbar(){
    const [searchTerm, setSearchTerm] = useState("")

    const searchChange = (event) => {
        setSearchTerm(event.target.value)
    }

    return(
        <div>
            <input value={searchTerm} onChange={searchChange} placeholder="Search for books" className="px-1 border w-100 rounded-md"></input>
            <Link href={`../results/${searchTerm}`} className="px-2 py-1 mx-3 bg-cyan-600">Search</Link>
        </div>
    )
}