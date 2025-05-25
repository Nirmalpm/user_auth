import React from 'react'
import LeftPanel from './LeftPanel'
import RightPanel from './RightPanel'

const Home = () => {
  return (
    <div className="flex flex-wrap mt-5  w-full gap-2 h-full overflow-y-auto justify-center">  
       {/* Left Panel */}
      <div className="flex border-1 border-gray-400 flex-col min-w-[220px] md:w-1/5 p-3 h-150 overflow-y-auto scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-blue-600">
      <LeftPanel />
      </div>
      <div className="flex text-2xl max-w-5xl flex-wrap w-3/7">
      <p className="font-thin">Welcome to Pro-Health Life Care Hospital, a state-of-the-art multi-specialty healthcare institution 
        committed to delivering exceptional medical care with compassion and integrity.
        Situated in the heart of the city, Pro-Health Life Care stands as a beacon of hope and healing 
        for patients from all walks of life.
        Since its inception in 2022, our hospital has been dedicated to providing world-class healthcare 
        services by integrating cutting-edge technology, experienced medical professionals, and a patient-centric approach.</p> 
          
     </div>
     {/* Right Panel */}
      <div className="flex flex-col min-w-[250px] md:w-1/5 p-3  h-150">
      <RightPanel />
      </div>
    </div>
    
  )
}

export default Home
