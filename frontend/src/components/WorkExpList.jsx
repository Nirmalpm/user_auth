import React, { useEffect, useState } from 'react'
import Education from './Education';
import { useUserStore } from '../store/userStore';
import { Plus } from 'lucide-react';
import toast from "react-hot-toast";
import WorkExp from './WorkExp';

const WorkExpList = () => {
    const [workexps, setWorkexps] = useState([]);
    const [showPlus, setShowPlus] = useState(true);
    
    const {userProfile} = useUserStore();
    useEffect (()=>{
      if(userProfile && userProfile.workexp){
        setWorkexps([...userProfile.workexp]);
      }
    },[userProfile]);

    console.log(workexps)

    const handleSaveAll = (updatedWork) => {
        setWorkexps((prev) => prev.id === updatedWork.id ? updatedWork : prev);
        //updateEducation(userProfile?.userId,userProfile?.profileUserId,updatedEducation)
    }

    const removeBlank= ()=>{
      const eduCopy = [...workexps];
      const filteredList = eduCopy.filter(obj => Object.keys(obj).length !== 0);
      setWorkexps([...filteredList])
    }

    const handleNewWork = () =>{
      setShowPlus(false );
      let isBlank = false;
      workexps.forEach((work)=>{
        if(Object.keys(work).length === 0 ){
          isBlank = true;          
          return;
        }
      });
      if(isBlank){
        toast.error("Please complete education added");
      }else{
        setWorkexps([{},...workexps])
      }      
    }
  return (
    <div className="rounded-xl p-6 border-white/10 border hover:-translate-y-1 transition-all">
        <div className="flex w-full justify-between">
            <h3 className="text-xl font-bold mb-4 text-gray-300">💼 Work Experience</h3>
            <div className="space-y-4 text-gray-300">
                { showPlus ? 
                <Plus  className="size-5 bg-amber-500 rounded hover:-translate-y-0.5  text-gray-900 mb-2 
                hover:shadow-[0_0_25px_rgba(255,255,255,0.8)] cursor-pointer" onClick={handleNewWork}/>
                : null  
                }
            </div>  
        </div>
        <div className="list-disc list-inside text-gray-300 space-y-2">
      {
        workexps.map((work)=>(
            <WorkExp workexp={work} onSaveAll={handleSaveAll} key={work.id} 
            showPlus={setShowPlus} isNew={Object.keys(work).length === 0 ? true : false}
            removeBlank={removeBlank}
            />
        ))
      }
       </div>
    </div>
  )
}

export default WorkExpList
