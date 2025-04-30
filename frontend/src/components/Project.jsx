import { Edit, Plus, Save, Text, X } from 'lucide-react';
import React, { useState } from 'react'
import Input from './Input'
import { useUserStore } from '../store/userStore';
import TextArea from './TextArea';

const Project = ({project, isNew, showPlus,removeBlank}) => {
    const [isEdit,setIsEdit] = useState(isNew);
    const [editedData, setEditedData] = useState({...project});

    console.log("project",project);
     const {userProfile, saveProject} = useUserStore();
     console.log(userProfile);
    const handleChange = (e) => {
      setEditedData({...editedData, [e.target.name]: e.target.value});
    }

    const handleSave = async () => {
      setIsEdit(false);
      showPlus(true)
      console.log(userProfile?.userId,userProfile?.profileUserId,editedData);
      await saveProject(userProfile?.userId,userProfile?.profileUserId,editedData);
    }
  return (
    <div className="flex w-full justify-center items-center ">
        
      {isEdit? (
        <div className="flex flex-col w-full">
          <Input icon={Text} type="text" placeholder="Enter the project name" name="projectName" value={editedData.projectName} onChange={handleChange}/>
          <TextArea icon={Text} type="text" placeholder="Short description of the project" name="projectDesc" value={editedData.projectDesc} onChange={handleChange}/>
          <Input icon={Text} type="text" placeholder="Period of the project" name="duration" value={editedData.duration} onChange={handleChange}/>
          <Input icon={Text} type="text" placeholder="Technolgies used: ex: java, Oracle, XML ..." name="techUsed" value={editedData.techUsed} onChange={handleChange}/>
        </div>
      ) : (
        
        <div className="w-full flex flex-col justify-center items-center p-6 rounded-xl border border-white/50 hover:-translate-y-1 
        hover:border-blue-500/30 hover:shadow-[0_2px_8px_rgba(59,130,246,0.2)] transition-all">
            <h3 className="text-xl font-bold mb-2 text-gray-300">{project.projectName}</h3>
            <span className="text-xl font-light mb-2 text-gray-300">{project.duration}</span>
            <p className="text-gray-400 mb-4"> {project.projectDesc}</p>
            <div className="flex flex-wrap gap-2 mb-4 ">
                {project.techUsed?.split(",").map((tech,key)=>(
                    <span className="bg-blue-500/10 text-blue-500 py-1 px-3 rounded-full 
                    text-sm hover:bg-blue-500/20 hover:shadow-[0_2px_8px_rgba(59,130,246,0.1)] 
                    transition-all " key={key}>{tech}</span>
                ))}
            </div>
            <div className="flex justify-between items-center">
                <a href="" className="text-blue-400 hover:text-blue-300 transition-colors my-4">View Project ➡️</a>
            </div>
        </div>
       
      )}
      <div className="flex ml-5">
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
    </div>
  )
}

export default Project
