"use client"

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function ResultsPage(){
    // const {searchTerm} = params;
    const params = useParams();
    const searchTerm = params.searchTerm
    const [loading, setLoading] = useState(true);
    const [books, setBooks] = useState([]);

    const fetchBooks = async () => {
        setLoading(true);
        try{
            const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`)
            const data = await res.json();
            console.log(data);
            setBooks(data.items || []);
        }catch (e){
            console.error(`Error fetching books: ${e}`)
        }finally{
            setLoading(false);
        }
    }
    
    useEffect(() => {
        fetchBooks()
    }, [searchTerm]);
    
    if(loading){
        return(
            <p>Loading search...</p>
        )
    }
    
    if(books.length == 0){
        return(
            <p>No books found for {searchTerm}</p>
        )
    }

    return(
        <div>
            <h1 className="text-2xl">Results for {searchTerm}</h1>
            <div>
                {books.map((book) =>(
                    <p key={book.id}>{book.volumeInfo.title}</p>
                    // console.log(book.volumeInfo)
                ))}
            </div>
        </div>
    )
        
}
