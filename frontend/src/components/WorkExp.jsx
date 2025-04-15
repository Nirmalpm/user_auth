import { Edit, Plus, Save, Text, X } from 'lucide-react';
import React, { useState } from 'react'
import Input from './Input'
import { useUserStore } from '../store/userStore';

const WorkExp = ({workexp, isNew, showPlus,removeBlank}) => {
    const [isEdit,setIsEdit] = useState(isNew);
    const [editedData, setEditedData] = useState({...workexp});

    console.log("workexp",workexp);
     const {userProfile, saveWork} = useUserStore();
     console.log(userProfile);
    const handleChange = (e) => {
      setEditedData({...editedData, [e.target.name]: e.target.value});
    }

    const handleSave = async () => {
      setIsEdit(false);
      showPlus(true)
      console.log(userProfile?.userId,userProfile?.profileUserId,editedData);
      await saveWork(userProfile?.userId,userProfile?.profileUserId,editedData);
    }
  return (
    <div>
      <div className="flex justify-end">
        {isEdit ? (
          <>
          <Save size={5} className="size-5 bg-blue-300 hover:-translate-y-0.5  text-gray-900 mb-2 rounded
          hover:shadow-[0_0_25px_rgba(255,255,255,0.8)] cursor-pointer" onClick={handleSave}/>
          <X title="Edit" className="size-5 bg-amber-300 hover:-translate-y-0.5 text-gray-900 mb-2 rounded ml-2
                    hover:shadow-[0_0_25px_rgba(255,255,255,0.8)] cursor-pointer" onClick={()=> {
                      setIsEdit(!isEdit);
                      showPlus(true);
                      removeBlank();
                      }}/>
          </>
        ) :(
           <Edit className="size-5 bg-amber-300 hover:-translate-y-0.5 text-gray-900 rounded 
                      hover:shadow-[0_0_25px_rgba(255,255,255,0.8)] cursor-pointer" onClick={()=> {
                        setIsEdit(!isEdit);
                        showPlus(false);
                      }}/>
        )}
      </div>
      {isEdit? (
        <div className="flex flex-col">
          <Input icon={Text} type="text" placeholder="Enter the work experience" name="expName" value={editedData.expName} onChange={handleChange}/>
          <Input icon={Text} type="text" placeholder="Describe your work" name="expDesc" value={editedData.expDesc} onChange={handleChange}/>
          <Input icon={Text} type="text" placeholder="Duration" name="duration" value={editedData.duration} onChange={handleChange}/>
          <Input icon={Text} type="text" placeholder="Last Designation here" name="lastDesignation" value={editedData.lastDesignation} onChange={handleChange}/>
        </div>
      ) : (
        
        <div>
        <h4 className="font-semibold">{workexp.expName} ({workexp.duration})</h4>
        <p>{workexp.expDesc}</p>
        <p>Last designation:{workexp.lastDesignation}</p>
        </div>
       
      )}
    </div>
  )
}

export default WorkExp
