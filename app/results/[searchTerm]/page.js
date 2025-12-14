"use client"

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import Header from "../../components/header";

export default function ResultsPage(){
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
            <div>
                <Header/>
                <p>Loading search...</p>
            </div>
        )
    }
    
    if(books.length == 0){
        return(
            <div>
                <Header/>
                <p>No books found for {searchTerm}</p>
            </div>
        )
    }

    return(
        <div>
            <Header/>
            <h1 className="text-2xl px-4 py-2">Results for "{searchTerm}"</h1>
            <div  className="flex flex-col">
                {books.map((book) =>{
                    const info = book.volumeInfo;
                    const thumbnail = info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || '';
                    // <p key={book.id}>{book.volumeInfo.title}</p>
                    // console.log(book.volumeInfo)
                    return (
                        <div key={book.id} className="flex px-6 py-2 items-start">
                            <img src={thumbnail} alt={info.title}/>
                            <div className="flex flex-col p-2 px-4">
                                <Link href={`../../book/${book.id}`} className="text-xl text-cyan-600 hover:underline">{info.title}</Link>
                                <p className="text-lg">By {info.authors}</p>
                                <p className="text-sm">{info.description}</p>

                            </div>
                        </div>

                    )
                })}
            </div>
        </div>
    )
        
}
