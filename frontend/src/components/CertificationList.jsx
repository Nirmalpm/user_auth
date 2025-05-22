import { Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from "react-hot-toast";
import { useUserStore } from '../store/userStore';
import Certification from './Certification';

const CertificationList = () => {
    const [certs, setCerts] = useState([]);
    const [showPlus, setShowPlus] = useState(true);
    
    const {userProfile} = useUserStore();
    useEffect (()=>{
      if(userProfile && userProfile.certification){
        setCerts([...userProfile.certification]);
      }
    },[userProfile]);

    //console.log(certs)

    const handleSaveAll = (updatedCert) => {
        setCerts((prev) => prev.id === updatedCert.id ? updatedCert : prev);
        //updateEducation(userProfile?.userId,userProfile?.profileUserId,updatedEducation)
    }

    const removeBlank= ()=>{
      const eduCopy = [...certs];
      const filteredList = eduCopy.filter(obj => Object.keys(obj).length !== 0);
      setCerts([...filteredList])
    }

    const handleNew = () =>{
      setShowPlus(false );
      let isBlank = false;
      certs.forEach((cert)=>{
        if(Object.keys(cert).length === 0 ){
          isBlank = true;          
          return;
        }
      });
      if(isBlank){
        toast.error("Please complete certfication added");
      }else{
        setCerts([{},...certs])
      }      
    }
  return (
    <div className="rounded-xl p-6 border-gray-700 border hover:-translate-y-1 transition-all">
        <div className="flex w-full justify-between">
            <h3 className="text-xl font-bold mb-4 text-gray-800">📜Certifications</h3>
            <div className="space-y-4 text-gray-300">
            { showPlus ? 
            <Plus  className="size-5 bg-amber-500 rounded hover:-translate-y-0.5  text-gray-900 mb-2 
            hover:shadow-[0_0_25px_rgba(255,255,255,0.8)] cursor-pointer" onClick={handleNew}/>
            : null  
            }
            </div>  
        </div>
        <div className="list-disc list-inside text-gray-300 space-y-2">
      {
        certs.map((cert)=>(
            <Certification certification={cert} onSaveAll={handleSaveAll} key={cert.id} 
            showPlus={setShowPlus} isNew={Object.keys(cert).length === 0 ? true : false}
            removeBlank={removeBlank}
            />
        ))
      }
       </div>
    </div>
  )
}

export default CertificationList
