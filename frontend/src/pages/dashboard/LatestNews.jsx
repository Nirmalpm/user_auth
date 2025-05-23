import React, { useEffect, useState } from 'react'
import { useUserStore } from '../../store/userStore'
import { motion } from "framer-motion";

const LatestNews = () => { 
    const {getFreeNews} = useUserStore();
     const [category, setCategory] = useState("Sports");
    const [data, setData] = useState([]);

    useEffect(()=>{
         const fetchData=async() =>{
            const data = await getFreeNews(category);
            setData(data);
          }
          fetchData();
    },[category]);
 /** bg-emerald-900 bg-opacity-80 backdrop-filter 
              backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800  */
  return (
    <div className="rounded flex flex-col border border-gray-800  gap-4 m-3">
        <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    className='max-w-sm w-full mx-auto mt-10 p-8min-w-sm   space-y-2'
                >
         <div className=" gap-1.5 flex flex-wrap p-2">
            <div className="text-blue-900 font-bold">Category:</div>
            <div onClick={()=> setCategory("Sports")} className="text-white cursor-pointer underline hover:text-amber-600">Sports</div>
            <div onClick={()=> setCategory("Business")} className="text-white cursor-pointer underline hover:text-amber-600">Business</div>
            <div onClick={()=> setCategory("Health")} className="text-white cursor-pointer underline hover:text-amber-600">Health</div>
            <div onClick={()=> setCategory("Science")} className="text-white cursor-pointer underline hover:text-amber-600">Science</div>
            <div onClick={()=> setCategory("Entertainment")} className="text-white cursor-pointer underline hover:text-amber-600">Entertainment</div>
         </div>
      <h1 className="text-blue-900 font-bold p-2">Latest {category} News </h1>
      <ul className="p-8">
      {
        data && data.map((d,index)=>(
            <li className=" text-white cursor-pointer list-disc" key={`news_${index}`}>
                <a href={d.websiteUrl} target="_blank" className='underline hover:text-amber-600'><h3>{d.title}</h3></a>
            </li>
        ))
      }
      </ul>
      </motion.div>
    </div>
  )
}

export default LatestNews
