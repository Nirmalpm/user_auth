import { Edit, Plus, Save, Text, X } from 'lucide-react';
import React, { useState } from 'react'
import Input from './Input'
import { useUserStore } from '../store/userStore';

const Education = ({education, isNew, showPlus,removeBlank}) => {
    const [isEdit,setIsEdit] = useState(isNew);
    const [editedData, setEditedData] = useState({...education});

    console.log("education",education);
     const {userProfile, saveEducation} = useUserStore();
     console.log(userProfile);
    const handleChange = (e) => {
      setEditedData({...editedData, [e.target.name]: e.target.value});
    }

    const handleSave = async () => {
      setIsEdit(false);
      showPlus(true)
      console.log(userProfile?.userId,userProfile?.profileUserId,editedData);
      await saveEducation(userProfile?.userId,userProfile?.profileUserId,editedData);
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
          <Input icon={Text} type="text" placeholder="Enter the course name" name="name" value={editedData.name} onChange={handleChange}/>
          <Input icon={Text} type="text" placeholder="Enter the university name" name="university" value={editedData.university} onChange={handleChange}/>
          <Input icon={Text} type="text" placeholder="Enter the Year of passing" name="yearOfPassing" value={editedData.yearOfPassing} onChange={handleChange}/>
        </div>
      ) : (
        
          <span>{education?.name} {education?.university} ({education?.yearOfPassing})</span> 
       
      )}
    </div>
  )
}

export default Education
