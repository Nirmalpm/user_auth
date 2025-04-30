import React, { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { ChevronLeft, ChevronRight } from "lucide-react";


const Carousel = ({verse,bg}) => {
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    mode: "snap",
    slides: {
      perView: 1,
      spacing: 10,
    },
  });

  return (
    <div className="relative w-full flex justify-center items-center flex-col ">
      <h1 className="font-bold text-5xl text-gray-800">{verse.TITLE}</h1>
      <div className="relative w-full max-w-xl mx-auto mt-10  flex  " >
        <button
          onClick={() => instanceRef.current?.prev()}
          className="mt-10 -left-6 transform h-20 bg-gray-400 text-white rounded-full shadow hover:bg-gray-100"
        >
          <ChevronLeft size={24} />
        </button>
        {/* Carousel */}
        <div ref={sliderRef} className="keen-slider rounded-3xl overflow-hidden w-full flex bg-cover bg-center  " style={{ backgroundImage: `url(${bg})`}}>
        <div class="absolute inset-0 bg-black opacity-50"></div>
          
          {verse.QUOTE.map((q,index)=>{
            const [key, dialog] = Object.entries(q)[0];
            return (
        <div
              className="keen-slider__slide flex items-center justify-center font-normal   overflow-auto rounded-3xl  flex-col  "
              key={index} 
            >     <strong className="text-center text-white">Verse {dialog.verse_number}</strong>
                <span className="flex w-full rounded-3xl   border-gray-500 shadow-lg
                  shadow-zinc-950 p-3 min-h-120 text-gray-900 items-center " ></span>
                  <span className="absolute  p-2 text-white text-3xl">{dialog.text} </span>
                  <hr className="w-full bg-white h-1"/>
                  <span className="relative  p-2 text-white text-3xl">{dialog.meaning} </span>
                  {/* <span className="flex w-full rounded-3xl  border border-gray-500 shadow-lg
                  shadow-zinc-950 p-3 bg-cover bg-center " style={{ backgroundImage: `url(${bg})` }} dangerouslySetInnerHTML={{ __html: q.QUOTE }}></span> */}
            </div>
      )})}        
        </div>
        <button
          onClick={() => instanceRef.current?.next()}
          className="mt-10 -right-6 h-20 mt-30transform  bg-gray-400 text-white  rounded-full shadow hover:bg-gray-100"
        >
          <ChevronRight size={24} />
        </button>
        {/* Prev Button */}
        

        {/* Next Button */}
        
      </div>
    </div>
  );
};

export default Carousel;
