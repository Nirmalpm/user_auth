import { Edit, Plus, Save, Text, X } from 'lucide-react';
import React, { useState } from 'react'
import Input from './Input'
import { useUserStore } from '../store/userStore';

const Certification = ({certification, isNew, showPlus,removeBlank}) => {
    const [isEdit,setIsEdit] = useState(isNew);
    const [editedData, setEditedData] = useState({...certification});

    console.log("certification",certification);
     const {userProfile, saveCertification} = useUserStore();
     console.log(userProfile);
    const handleChange = (e) => {
      setEditedData({...editedData, [e.target.name]: e.target.value});
    }

    const handleSave = async () => {
      setIsEdit(false);
      showPlus(true)
      console.log(userProfile?.userId,userProfile?.profileUserId,editedData);
      await saveCertification(userProfile?.userId,userProfile?.profileUserId,editedData);
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
          <Input icon={Text} type="text" placeholder="Enter the certification Name" name="certName" value={editedData.certName} onChange={handleChange} style={{backgroundColor:'#bbb',color:'#000'}}/>
          <Input icon={Text} type="text" placeholder="Certification year" name="certYear" value={editedData.certYear} onChange={handleChange} style={{backgroundColor:'#bbb',color:'#000'}}/>
        </div>
      ) : (
        
        
            <><span  className="text-gray-800">{certification.certName}  </span> <>({certification.certYear})</></>
        
       
      )}
      </div>
  )
}

export default Certification
