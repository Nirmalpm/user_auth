import React, { useEffect, useState } from 'react'
import Education from './Education';
import { useUserStore } from '../store/userStore';
import { Plus } from 'lucide-react';
import toast from "react-hot-toast";

const EducationList = () => {
    const [educations, setEducations] = useState([]);
    const [showPlus, setShowPlus] = useState(true);
    
    const {userProfile} = useUserStore();
    useEffect (()=>{
      if(userProfile && userProfile.education){
        setEducations([...userProfile.education]);
      }
    },[userProfile]);

    //console.log(educations)

    const handleSaveAll = (updatedEducation) => {
        setEducations((prev) => prev.id === updatedEducation.id ? updatedEducation : prev);
        //updateEducation(userProfile?.userId,userProfile?.profileUserId,updatedEducation)
    }

    const removeBlank= ()=>{
      const eduCopy = [...educations];
      const filteredList = eduCopy.filter(obj => Object.keys(obj).length !== 0);
      setEducations([...filteredList])
    }

    const handleNewEducation = () =>{
      setShowPlus(false );
      let isBlank = false;
      educations.forEach((education)=>{
        if(Object.keys(education).length === 0 ){
          isBlank = true;          
          return;
        }
      });
      if(isBlank){
        toast.error("Please complete education added");
      }else{
        setEducations([{},...educations])
      }      
    }
  return (
    <div className="rounded-xl p-6  border hover:-translate-y-1 transition-all border-gray-700">
        <div className="flex w-full justify-between">
          <h3 className="text-xl font-bold mb-4 text-gray-800">📚Education</h3>
          { showPlus ? 
        <Plus  className="size-5 bg-amber-500 rounded hover:-translate-y-0.5  text-gray-900 mb-2 
        hover:shadow-[0_0_25px_rgba(255,255,255,0.8)] cursor-pointer" onClick={handleNewEducation}/>
        : null  
        }
          
        </div>
        <div className="list-disc list-inside text-gray-300 space-y-2">
      {
        educations.map((education)=>(
            <Education education={education} onSaveAll={handleSaveAll} key={education.id} 
            showPlus={setShowPlus} isNew={Object.keys(education).length === 0 ? true : false}
            removeBlank={removeBlank}
            />
        ))
      }
       </div>
    </div>
  )
}

export default EducationList
