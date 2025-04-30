import React, { useEffect } from 'react';
import { NavLink, Outlet } from 'react-router';

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "";

const SpiritualQuotes = () => {
    useEffect(() => {
        fetch(`${API_URL}/track-visit`);
    }, []);
 const activeLink = `text-center bg-amber-500 p-2 rounded-xl text-white hover:bg-amber-500 hover:-translate-y-0.5 transition w-full mr-2 mb-1`;
 const link = `text-center bg-blue-500 p-2 rounded-xl text-white hover:bg-amber-500 hover:-translate-y-0.5 transition w-full mr-2 mb-1`;

  return (
  <div className="flex sticky w-full flex-col justify-center items-center">
  {/* Sticky header */}
    <div className="flex flex-col  mt-20 w-full bg-gray-700 justify-center items-center z-50">
      <h1 className="text-center text-3xl md:text-7xl font-bold m-6 bg-gradient-to-r from-red-500 
        to-emerald-400 bg-clip-text text-transparent leading-tight">
        Spirituality: Food of the Soul / Atma
      </h1>
      <div className="flex w-1/2 justify-evenly">
        <NavLink to="" end className={({isActive})=> isActive ? activeLink :link}>Swami</NavLink>
        <NavLink to="amma" className={({isActive})=> isActive ? activeLink :link}>Amma</NavLink>
        <NavLink  to="gita" className={({isActive})=> isActive ? activeLink :link}>Bhagavad Gita</NavLink>
      </div>
    </div>
    <div className="flex flex-row w-full min-w-sm ">  
    {/* Main content */}
      <div className="flex  justify-center items-start  w-full">  
          <Outlet/>
      </div>
    </div>
</div>

  )
}

export default SpiritualQuotes
