import React, { useEffect, useState } from 'react'
import ammaQuotes from "./amma-quotes.json";
import bg from '../bg-images/bg-4.jpg';
import carousalBg from './bg-2.jpg'
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
                   Bhargo Devasya Deemahi
                   Dhiyo Yona Prachodayaath
                   `;
  const [searchText, setSearchText] = useState("");
  const [quotes, setQuotes] = useState([])

  const handleGo = (quote) =>{    
    const quotes = ammaQuotes.filter((q)=>q.TITLE.toLowerCase() === quote.TITLE.toLowerCase());   
    //console.log(quotes)
    setQuotes([...quotes]);
    setSearchText(quote.TITLE)
  }

  const handleSearch = (e) =>{
    setSearchText(e.target.value)
    const quotes = ammaQuotes.filter((quote)=>quote.TITLE.toLowerCase().includes(e.target.value.toLowerCase()));   
    setQuotes([...quotes])
  }
 

  useEffect(()=>{
    setQuotes([...ammaQuotes])
  },[]);

  //  useEffect(() => {
  //         fetch(`${API_URL}/track-visit`);
  //     }, []);
  return (
<div className="flex w-full flex-col justify-start items-start bg-cover bg-center" style={{backgroundImage: `url(${pageBg})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center',}}>
  {/* Main content */}
  <div className="flex w-full justify-center items-center flex-col">
    <div className="flex  w-full m-2 justify-center items-center flex-col">
      <h1 className="m-5 text-5xl font-sans text-red-700">AMMA (GAYATHRI MA)'s TRUTH PREACHINGS</h1>
      <div className="flex w-full m-3   justify-center items-start flex-wrap ">
        <div className="flex max-w-sm w-full m-2 flex-col justify-start items-center">
          <h1 className="w-full text-white">Search or Click on Quotes to go directly</h1> 
          <div className="flex max-w-sm  gap-2 w-full ">    
            <Input icon={Search} style={{width:"300px",backgroundColor:'#fff',color:'#333'}} value={searchText}  placeholder="Search quotes" onChange={handleSearch} />   
            <button className="bg-blue-400 p-1 rounded-xl text-white 
            hover:bg-amber-600 transition hover:-translate-y-0.5 h-8 m-2" onClick={()=> {
            setQuotes([...ammaQuotes]);
            setSearchText("")
            }}>Reset</button> 
          </div>             
          <div className="max-w-sm h-auto max-h-120 overflow-y-auto flex flex-col">           
            {quotes && 
            quotes.sort((a, b) => a.TITLE.toLowerCase().localeCompare(b.TITLE))
            .map((q,index)=>(
            <div key={index}  className="flex w-full justify-center even:bg-pink-100 odd:bg-pink-300 underline cursor-pointer">
            <h1 className="flex pl-3 text-start  w-full " onClick={()=>handleGo(q)}>{q.TITLE}</h1>
            </div>
            ))
            }
          </div>
        </div>
        <Carousel items={quotes} bg={bg} cover={bg} coverText={coverText} searchText={searchText}/>
      </div>
    </div>
  </div>
</div>

  )
}

export default Quotes
