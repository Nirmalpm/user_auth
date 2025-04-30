import React, { useEffect, useState } from 'react'
import Ch1 from "./English-Hindi/Gita-Chapter1.json";
import MalCh1 from "./Malayalam/chapter1.json";

import bg from '../Gita/ch1-bg.jpg';
import Carousel from './English-Hindi/GitaSlider';
import MalCarousel from './Malayalam/GitaSlider';
import pageBg from './pageBg.jpg'

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "";

const BhagavadGita = () => {
  const [switchToMal, setSwitchToMal] = useState(false)   ;    
  return (
    <div className="flex w-full flex-col justify-start  items-start bg-cover bg-center " style={{backgroundImage: `url(${pageBg})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center',}}>   
    <div className=" flex  w-full  justify-center items-center flex-col">        
            <div className="flex  w-full  justify-center items-center flex-col  ">
              <div className="w-full text-right text-white underline hover:text-amber-500 cursor-pointer"
              onClick={()=> setSwitchToMal(!switchToMal)}>Toggle Mal/Eng
              </div>
              <h1 className="m-5 text-7xl font-sans text-red-700 ">BHAGAVAD GITA</h1>  
              {switchToMal ? <MalCarousel verse={MalCh1} bg={bg}/> :<Carousel verse={Ch1} bg={bg}/>  }    
            </div>
        
    </div>
    </div>
  )
}

export default BhagavadGita
