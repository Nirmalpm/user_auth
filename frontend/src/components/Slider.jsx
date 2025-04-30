import React, { useEffect, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { ChevronLeft, ChevronRight } from "lucide-react";


const Carousel = ({items,bg, cover,coverText, endPage}) => {
  console.log(items.length)
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    mode: "snap",
    slides: {
      perView: 1,
      spacing: 10,
    },
  });


  return (
    <div  className="relative max-w-xl flex min-w-xs w-full flex-col items-center">
      <h1 className="text-2xl fond-semibold text-white mb-2">Slide/Swipe for Quotes</h1>
    <div  className="  flex w-full">
       <button
        onClick={() => instanceRef.current?.prev()}
        className="mt-10 -left-6 transform h-20 bg-gray-600 text-white rounded-full shadow hover:bg-gray-100"
      >
        <ChevronLeft size={24} />
      </button>
      {/* Carousel */}
      <div ref={sliderRef} key={items.length}  className="keen-slider rounded overflow-hidden " >
         {cover &&  
         <div className="keen-slider__slide rounded-3xl ">
            <div className="flex relative">
              <img src={cover} alt="1" className="w-full rounded-3xl" />
              {
              coverText && 
              <div className="absolute w-full flex inset-0 rounded-3xl opacity-100
              text-white text-center items-end  pb-10 justify-center">
                <div className="flex"><h1 className="text-3xl font-semibold text-green-100 " style={{ whiteSpace: 'pre-line' }}>{coverText}</h1></div>
              </div>
              }
            </div>            
         </div>         
        }
        {/* {
          coverText && 
          <div className="absolute w-full flex inset-0 rounded-3xl opacity-100
           text-white text-center items-end  pb-10 justify-center">
            <div className="flex"><h1 className="text-3xl font-semibold text-gray-100 " style={{ whiteSpace: 'pre-line' }}>{coverText}</h1></div>
          </div>
        } */}
        
        {items.map((q,index)=>(
			<div
            className="keen-slider__slide  items-center justify-start font-normal   overflow-auto rounded-3xl  flex-col"
            key={index}
            style={{
              overflowY: 'auto',
              height: '600px',
            }}
          >     
          		<span className="flex  rounded-3xl   shadow-lg
                 shadow-zinc-950  bg-cover bg-center min-h-120 text-gray-900 flex-col" style={{ backgroundImage: `url(${bg})` }}>
                  <div className="text-center pl-3 font-sans text-2xl bg-red-400 bg-gradient-to-r from-yellow-300 to-red-800  mb-2 rounded-2-xl  text-white">{q.TITLE}</div>
                  <div className="p-3" style={{ whiteSpace: 'pre-line' }}>{q.QUOTE}</div>
                  </span>
                 {/* <span className="flex w-full rounded-3xl  border border-gray-500 shadow-lg
                 shadow-zinc-950 p-3 bg-cover bg-center " style={{ backgroundImage: `url(${bg})` }} dangerouslySetInnerHTML={{ __html: q.QUOTE }}></span> */}
        	</div>
		))}     
      {
        endPage?  <div className="keen-slider__slide rounded-3xl">{endPage}</div> : null
      }   
      </div>
      <button
        onClick={() => instanceRef.current?.next()}
        className="mt-10 -right-6 h-20 mt-30transform  bg-gray-600 text-white  rounded-full shadow hover:bg-gray-100"
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
