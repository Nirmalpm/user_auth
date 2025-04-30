import React, { useEffect, useState } from 'react'
import babaQuotes from "./baba-quotes.json";
import bg from '../bg-images/bg-4.jpg';
import Carousel from '../../../components/Slider';
import carousalBg from '../Baba/bg-4.jpg'
import pageBg from './pageBg.jpg'
import BackgroundMusic from '../../../components/BackgroundMusic';
import bgmusic from './music/Rudram.mp3'
import vishistam from './music/Vishishta Mantram.mp3'
import KaraokePlayer from '../../../components/KaraokePlayer';

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "";

const Quotes = () => {
  const coverText=` Om Saayeeshvaraaya Vidhmahe
                    Sathya Dhevaaya Dheemahi
                    Thannassarvah Prachodayaath`;
  const endPage = ()=>{
    return (
      <div className="flex flex-col p-3  m-2">  
      <BackgroundMusic path={bgmusic} name={`Sai Rudram`}/> 
      <KaraokePlayer  path={vishistam}/>    
      </div>
    )
  }
  return (
    <div className="flex w-full flex-col justify-start items-start bg-cover bg-center" style={{backgroundImage: `url(${pageBg})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center',}}>
 
  {/* Main content */}
  <div className="flex p-3 w-full m-2 justify-center items-center flex-col">
      <div className="flex p-3 w-full m-2 justify-center items-center flex-col">
        <h1 className="m-5 text-5xl font-sans font-bold text-red-800 ">Sri Sathya Sai Baba's Words of Wisdom</h1>
       
        <Carousel items={babaQuotes} bg={bg} cover={carousalBg} coverText={coverText} endPage={endPage()}/>
      </div>
   
  </div>
</div>

  )
}

export default Quotes
