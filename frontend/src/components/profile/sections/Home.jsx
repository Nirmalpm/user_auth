import React from 'react'
import RevealOnScroll from '../../RevealOnScroll'
import myImage from "../../../assets/images/profile-pic.jpeg"; 
import { NavLink } from 'react-router';

const Home = () => {
  return (
    
    <section id="home" className="min-h-screen flex items-center justify-center relative">
      <RevealOnScroll>
      <div className="flex">
        <div className="text-center z-10 px-4">
        <img src={myImage} alt="Description" width="300" className="rounded-full"/>;
        </div>
        <div className="text-center z-10 px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-500 
          to-cyan-400 bg-clip-text text-transparent leading-right">Hi, I'm Nirmal Kumar</h1>
          <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
          With more than 20+ years of professional experience which includes Retail Product development, 
          Enterprise Application Integration, Web based enterprise application portal development etc.
          </p>
          <div className="flex justify-center space-x-4">
              <NavLink to="#projects"
              className="bg-blue-500 text-white py-3 px-6 rounded font-medium transition relative 
              overflow-hidden hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]"
              >View Projects</NavLink>
              <a href="#contact"
              className="border border-blue-500/50 text-blue-500 py-3 px-6 rounded font-medium 
              transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] 
              hover:bg-blue-500/10"
              >Contact Me</a>
          </div>
        </div>
      </div>
      </RevealOnScroll>
    </section>
  )
}

export default Home
