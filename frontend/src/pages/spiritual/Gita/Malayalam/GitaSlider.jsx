import React, { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import fullGita from "./gita-malayalam.json";

const getChapter = (num)=>{   
  return fullGita.Chapters[num];
}

const Carousel = ({bg}) => {
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    mode: "snap",
    slides: {
      perView: 1,
      spacing: 10,
    },
  });

  const firstCh = getChapter(0);
  const [ch, setCh] = useState(firstCh);

  const handleChapter = (num) =>{
    const ch = getChapter(num);
    setCh(ch);
  }



  const chapters = Array.from({ length: 18 }, (_, i) => `അദ്ധ്യായം ${i + 1}`);

  return (
    <div className="w-full max-w-7xl  flex justify-center items-start flex-wrap ">
      <div className="flex justify-center items-center bg-gray-300   mt-30">
        <ul className="flex w-full flex-col ">
        <li key={-2} className="flex pl-5 pr-5 justify-center even:bg-amber-300 odd:bg-amber-400 underline cursor-pointer" onClick={()=>handleChapter(0)}>
          ഗീതാധ്യാനം
        </li>
        <li key={-1} className="flex pl-5 pr-5 justify-center even:bg-amber-300 odd:bg-amber-400 underline cursor-pointer" onClick={()=>handleChapter(1)}>
          ഗീതാമാഹാത്മ്യം
        </li>
        {chapters.map((chapter, index) => (
        <li key={index} className="flex pl-5 pr-5 justify-center even:bg-amber-300 odd:bg-amber-400 underline cursor-pointer" onClick={()=>handleChapter(index+2)}>
          {chapter}
        </li>
          ))}
        </ul>
      </div>
      <div className=" w-full max-w-2xl flex justify-center items-center flex-col ">
        
        <div className="bg-yellow-400 p-1 rounded-xl text-center flex flex-col mt-5">
          <h1 className="font-bold text-xl text-red-800"><span className="font-normal text-sm text-red-900">{ch.Subchapter_title}</span> ( {ch.chapter_title})</h1>
        </div>
        <div className="relative w-full max-w-xl mx-auto mt-2  flex   h-150 mb-10" >
          <button
            onClick={() => instanceRef.current?.prev()}
            className="mt-60 -left-6 transform h-20 bg-gray-400 text-white rounded-full shadow hover:bg-gray-100"
          >
            <ChevronLeft size={24} />
          </button>
          {/* Carousel */}
          <div ref={sliderRef} key={ch.key} className="keen-slider rounded-3xl overflow-hidden w-full flex bg-cover bg-center  " style={{ backgroundImage: `url(${bg})`}}>
          <div className="absolute inset-0 bg-black opacity-50"></div>
            
            {ch.verses.map((q,index)=>{
              
              return (
          <div
                className="keen-slider__slide flex items-center justify-center font-normal   overflow-auto rounded-3xl  flex-col  "
                key={`${ch.key}_${index}`}   style={{
                  overflowY: 'auto',
                  height: '600px',
                }}
              >     <strong className="text-center text-white">{q.SlokaNumber}</strong>                  
                    <span className="relative  p-2 text-white ">{q.verse} </span>
                    <span className="relative  p-2 text-white ">{q.meaning} </span>
                    {/* <span className="flex w-full rounded-3xl  border border-gray-500 shadow-lg
                    shadow-zinc-950 p-3 bg-cover bg-center " style={{ backgroundImage: `url(${bg})` }} dangerouslySetInnerHTML={{ __html: q.QUOTE }}></span> */}
              </div>
        )})}        
          </div>
          <button
            onClick={() => instanceRef.current?.next()}
            className="mt-60 -right-6 h-20 mt-30transform  bg-gray-400 text-white  rounded-full shadow hover:bg-gray-100"
          >
            <ChevronRight size={24} />
          </button>
          {/* Prev Button */}
          

          {/* Next Button */}
          
        </div>
      </div>
    </div>
  );
};

export default Carousel;
