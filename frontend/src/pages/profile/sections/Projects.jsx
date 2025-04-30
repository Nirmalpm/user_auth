import React, { useEffect, useState } from 'react'
import RevealOnScroll from '../../../components/RevealOnScroll';
import { useUserStore } from '../../../store/userStore';
import Project from '../../../components/Project';
import { Plus } from 'lucide-react';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [showPlus, setShowPlus] = useState(true);
     const [addProjects, setAddProjects] = useState(false);
    
    const {userProfile} = useUserStore();
    useEffect (()=>{
      if(userProfile && userProfile.projects){
        setProjects([...userProfile.projects]);
      }
    },[userProfile]);

    console.log(projects)

    const handleSaveAll = (updateProject) => {
        setProjects((prev) => prev.id === updateProject.id ? updateProject : prev);
        //updateEducation(userProfile?.userId,userProfile?.profileUserId,updatedEducation)
    }

    const removeBlank= ()=>{
      const eduCopy = [...projects];
      const filteredList = eduCopy.filter(obj => Object.keys(obj).length !== 0);
      setProjects([...filteredList])
    }

    const handleNew = () =>{
      setShowPlus(false );
      let isBlank = false;
      projects.forEach((project)=>{
        if(Object.keys(project).length === 0 ){
          isBlank = true;          
          return;
        }
      });
      if(isBlank){
        toast.error("Please complete the project added");
      }else{
        setProjects([{},...projects])
      }      
    }
  return (
   <div id="projects">
   { (addProjects) ?
    (<section  
    className=" flex items-center justify-center mt-10  top-35 relative"
    >
    <RevealOnScroll>
      <div  className="max-w-5xl mx-auto px-4">
        <div className="flex w-full gap-5 items-center justify-center">
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text 
            text-transparent ">Featured Projects</h2>
            <div className=" text-gray-300 flex flex-row items-center justify-center gap-3">
                { showPlus ? 
                <Plus  className="size-5 bg-amber-500 rounded hover:-translate-y-0.5  text-gray-900 mb-2 
                hover:shadow-[0_0_25px_rgba(255,255,255,0.8)] cursor-pointer" onClick={handleNew}/>
                : null  
                }
                <h1 className="text-white font-light cursor-pointer flex hover:text-amber-500 underline" 
                        onClick={()=>setAddProjects(false)}>Close</h1>
            </div>  
        </div>


        <div className=" grid-cols-1 md:grid-cols-2 gap-6 items-center justify-center  ">
            {/* PROJECT 1 */}
            {
                projects.map((project)=>(
                    <Project project={project} onSaveAll={handleSaveAll} key={project.id} 
                    showPlus={setShowPlus} isNew={Object.keys(project).length === 0 ? true : false}
                    removeBlank={removeBlank}
                    />
                ))
            }
            

        </div>
      </div>
      </RevealOnScroll>
    </section>): 
    <div className="text-white font-light cursor-pointer top-35 flex items-center justify-center relative mt-20 hover:text-amber-500 underline" 
    onClick={()=>setAddProjects(true)}>Projects Section</div>
    }
    
    </div>
  )
}

export default Projects
