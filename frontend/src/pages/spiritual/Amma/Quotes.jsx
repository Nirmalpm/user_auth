import React, { useEffect, useState } from 'react'
import ammaQuotes from "./amma-quotes.json";
import bg from '../bg-images/bg-4.jpg';
import carousalBg from './bg-1.jpg'
import Carousel from '../../../components/Slider';
import pageBg from './pageBg.jpg'

import Input from '../../../components/Input';
import { Text, Search, CircleArrowLeft } from 'lucide-react';

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "";

const Quotes = () => {
  const coverText=` Om Bhur Bhuva Suvah
                   Tat savitur varenyam
                   Bhargo Devasya Deemahi`;
  const [searchText, setSearchText] = useState("");
  const [quotes, setQuotes] = useState([])

  const handleGo = (quote) =>{    
    const quotes = ammaQuotes.filter((q)=>q.TITLE.toLowerCase() === quote.TITLE.toLowerCase());   
    console.log(quotes)
    setQuotes([...quotes])
  }

  const handleSearch = (e) =>{
    setSearchText(e.target.value)
    const quotes = ammaQuotes.filter((quote)=>quote.TITLE.toLowerCase().includes(e.target.value.toLowerCase()));   
    setQuotes([...quotes])
  }
 

  useEffect(()=>{
    setQuotes([...ammaQuotes])
  },[]);
  return (
    <div className="flex w-full flex-col justify-start items-start bg-cover bg-center" style={{backgroundImage: `url(${pageBg})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center',}}>
 
  {/* Main content */}
 <div className="flex p-3 w-full m-2 justify-center items-center flex-col">
      <div className="flex p-3 w-full m-2 justify-center items-center flex-col">
        <h1 className="m-5 text-5xl font-sans text-red-700">AMMA (GAYATHRI MA)'s TRUTH PREACHINGS</h1>
        <div className="flex w-full m-3 p-3  justify-center items-center flex-wrap ">
          <div>
          <h1>Search or Click on Quotes to go directly</h1>  
          <div className="flex gap-2">    
            <Input icon={Search} style={{width:"300px"}} value={searchText}  placeholder="Search quotes" onChange={handleSearch} />   
            <button className="bg-blue-400 p-1 rounded-xl text-white 
            hover:bg-amber-600 transition hover:-translate-y-0.5 h-8" onClick={()=> {
              setQuotes([...ammaQuotes]);
              setSearchText("")
              }}>Clear</button> 
          </div>             
            <div className="w-full max-w-md m-2 h-auto max-h-170 overflow-y-auto   ">           
            {quotes && 
                quotes.sort((a, b) => a.TITLE.toLowerCase().localeCompare(b.TITLE))
                .map((q)=>(
                  <div className="flex  justify-center even:bg-gray-400 odd:bg-gray-300 underline cursor-pointer">
                    <h1 className="text-start  w-3/4" onClick={()=>handleGo(q)}>{q.TITLE}</h1></div>
                ))
            }
            </div>
          </div>
         
            <Carousel items={quotes} bg={bg} cover={carousalBg} coverText={coverText}/>
        </div>
        
      </div>
   
  </div>
</div>

  )
}

export default Quotes
