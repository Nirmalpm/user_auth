import React, { useEffect, useState } from 'react'


import bg from '../Gita/bg2.jpg';
import Carousel from './English-Hindi/GitaSlider';
import MalCarousel from './Malayalam/GitaSlider';
import pageBg from './pageBg.jpg'
import { assignChapter } from './Malayalam/assignChapter';

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "";

const BhagavadGita = () => {
  const [switchToMal, setSwitchToMal] = useState(false);  
  const [chno,setChno]   = useState(0);  
  const [ch,setCh]   = useState(null);  
  const [text,setText] = useState("English");
  const [title,setTitle] = useState("BHAGAVAD GITA");

  useEffect(()=>{
    const ch = assignChapter(chno);
    setCh(ch);
    console.log("chno",chno)
  },[chno]);

  const handleLang = () =>{
    if(text === 'English'){
      setText("Malayalam")
      setTitle("ഭഗവദ്ഗീത")
    }else if (text === 'Malayalam'){
      setText("English")
      setTitle("BHAGAVAD GITA")
    }
  }

  const toggler = () =>{
    return (
      <div className="flex rounded shadow-2xl shadow-red-500 items-center justify-center border-4 border-gray-400 ">
        <span className={` w-10 font-bold p-1 cursor-pointer ${text==="English" ?'bg-white text-blue-800':'bg-gray-400 text-white'}`} onClick={handleLang}>ENG</span>
        <span className={` w-10 font-bold p-1 cursor-pointer ${text==="Malayalam" ?'bg-white text-blue-800':'bg-gray-400 text-white'}`} onClick={handleLang}>MAL</span>
      </div>
    )
  }

  
  return (
    <div className="flex w-full flex-col justify-start  items-start bg-cover bg-center " style={{backgroundImage: `url(${pageBg})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center',}}>   
    <div className=" flex  w-full  justify-center items-center flex-col">        
            <div className="flex  w-full  justify-center items-center flex-col bg-blue ">
                <h1 className="m-5 text-5xl font-sans text-white bg-blue-900 p-3 shadow-xl shadow-amber-200">{title}</h1> 
                {toggler()}
              {text === 'Malayalam' ? ch ? <MalCarousel verse={ch} bg={bg} setChno={setChno}/>:null :<Carousel bg={bg}/>  }    
            </div>
        
    </div>
    </div>
  )
}

export default BhagavadGita
