import React, { useEffect, useState } from 'react'
import RevealOnScroll from '../../../components/RevealOnScroll';
import { Edit, X, Text, Save } from 'lucide-react';
import TextArea from '../../../components/TextArea';
import ItemList from '../../../components/SkillList';
import { useUserStore } from '../../../store/userStore';
import EducationList from '../../../components/EducationList';
import WorkExpList from '../../../components/WorkExpList';
import CertificationList from '../../../components/CertificationList';

const About = () => {
    const [aboutInfo, setAboutInfo] = useState({});
    const [frontendSkills, setFrontendSkills] = useState([]);
    const [backendSkills, setBackendSkills] = useState([]);
    const [otherSkills, setOtherSkills] = useState([]);

    const [isEdit, setIsEdit] = useState(false);
    const [userId, setUserId] = useState("");
    const [profileUserId, setProfileUserId] = useState("");    

    const {addUpdateUserAbout,saveFrontend, saveBackend, saveOther, userProfile} = useUserStore();   

    useEffect(()=>{
        console.log(userProfile,userId, profileUserId)
        if(userProfile){
            const fskills  = userProfile.frontend.map((skill)=>{
                return {id:skill.id, name:skill.skillName}
            });
            const bskills  = userProfile.backend.map((skill)=>{
                return {id:skill.id, name:skill.skillName}
            });
            const oskills  = userProfile.other.map((skill)=>{
                return {id:skill.id, name:skill.skillName}
            });
            setUserId(userProfile.userId);
            setProfileUserId(userProfile.profileUserId);
            setFrontendSkills(fskills);
            setBackendSkills(bskills);
            setOtherSkills(oskills);
            setAboutInfo({...userProfile.aboutInfo})
        }
    },[userProfile]);

    const handleSaveUserAbout = async() => {
        await addUpdateUserAbout({userId, profileUserId, userDesc:aboutInfo.userDesc, isUpdate:isEdit});
        setIsEdit(!isEdit);
    }

    const handleSaveFrontend = async (userId,profileUserId,skills )=>{
        console.log(userId,profileUserId,skills);
        const data = await saveFrontend({userId, profileUserId, skills});
        //console.log(data)
    }
    const handleSaveBackend = async (userId,profileUserId,skills)=>{
        console.log(userId,profileUserId,skills);
        const data = await saveBackend({userId, profileUserId, skills});
    }
    const handleSaveOther = async(userId,profileUserId,skills)=>{
        console.log(userId,profileUserId,skills);
        const data = await saveOther({userId, profileUserId, skills});
    }

  return (
    
    <section id="about"
    className="min-h-screen flex items-center justify-center ">
    <RevealOnScroll>
      <div className="max-w-5xl mx-auto px-4 ">
        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent text-center">About Me</h2>
        <div className="rounded-xl p-8 border-white/10 border hover:-translate-y-1 transition-all">
            {isEdit ? (
                <div className="flex flex-row items-start justify-center gap-3 w-full ">
                    <div className="flex w-full  items-center justify-center ">
                    <TextArea
                    icon={Text}
                    placeholder="Describe about yourself in few words (500 chars)"
                    onChange={(e) => setAboutInfo({...userProfile.aboutInfo,userDesc:e.target.value})}
                    rows={5}      
                    value={aboutInfo.userDesc}  
                    name="userDesc"
                    />
                    </div>
                    <div className="flex flex-col gap-3 ">
                        <X title="Edit" className="size-5 bg-amber-300 hover:-translate-y-0.5 rounded 
                    hover:shadow-[0_0_25px_rgba(255,255,255,0.8)] cursor-pointer" onClick={()=> setIsEdit(!isEdit)}/>
                        <Save title="Edit" className="size-5 bg-blue-300 hover:-translate-y-0.5 rounded 
                    hover:shadow-[0_0_25px_rgba(255,255,255,0.8)] cursor-pointer" onClick={handleSaveUserAbout}/>
                    </div>
                </div>
            ) :
            (
                <div className="flex gap-3">
                    
                    <div className="flex  items-center justify-center w-full">
                    <p className="text-lg  text-gray-300 mb-6 ">{aboutInfo.userDesc}</p>
                    </div>
                    <div>
                    <Edit title="Edit" className="size-5 bg-amber-300 hover:-translate-y-0.5 rounded 
                    hover:shadow-[0_0_25px_rgba(255,255,255,0.8)] cursor-pointer" onClick={()=> setIsEdit(!isEdit)}/>
                    </div>
                    
                </div>
            )
            }
            
            <div className="flex gap-3 flex-wrap">
                <div className='rounded-xl p-6 hover:-translate-y-1 transition-all'>
                     <div className="flex flex-wrap  gap-6 w-100">
                      <ItemList title={`Frontend Skills`} itemList={frontendSkills} userId={userId} profileUserId={profileUserId} handleSave={handleSaveFrontend}/>
                    </div>
                </div>
                <div className='rounded-xl p-6 hover:-translate-y-1 transition-all'>
                    <div className="flex flex-wrap gap-6 w-100">
                      <ItemList title={`Backend Skills`} itemList={backendSkills} userId={userId} profileUserId={profileUserId} handleSave={handleSaveBackend}/>
                    </div>
                </div>
                <div className='rounded-xl p-6 hover:-translate-y-1 transition-all'>
                    <div className="flex flex-wrap gap-6 w-100">
                        <ItemList title={`Other Skills`} itemList={otherSkills} userId={userId} profileUserId={profileUserId} handleSave={handleSaveOther}/>
                    </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        <div>
                            <EducationList/>
                            <CertificationList/>
                        </div>
                        <WorkExpList/>
        </div>
      </div>
      </RevealOnScroll>
    </section>
    
  )
}   

export default About
