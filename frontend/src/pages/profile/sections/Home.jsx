import React, { useEffect, useState } from 'react';
import RevealOnScroll from '../../../components/RevealOnScroll';

import Input from '../../../components/Input';
import TextArea from '../../../components/TextArea';

import { motion } from 'framer-motion';
import { File, Text, User } from 'lucide-react';

import { useUserStore } from '../../../store/userStore';
import { uploadImage } from '../../../utils/fileupload';


const Home = () => {

  const [file, setFile] = useState(null);
  const [userProfileHome, setUserProfileHome]= useState({userId:'',fullName:'',userDesc:'',imagePath:'',id:null});
  const [isHomeSetOrUpdated, setIsHomeSetOrUpdated] = useState(false);
  
  const {addUserHome,userProfile,isUserProfileHomePresent} = useUserStore();

  useEffect(()=>{
    console.log(userProfile)
    const fetchData = async ()=>{
      const userHome = await isUserProfileHomePresent(userProfile);
      if(userHome.id){
        setUserProfileHome({...userHome});
        setIsHomeSetOrUpdated(true);          
      }
      }
    fetchData();  
  },[isHomeSetOrUpdated]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit  = async (e) => {
    e.preventDefault();
    console.log(userProfile.userId, userProfileHome);
    let imagePath = "";
    if (file) {
      const imageData = await uploadImage(file);
      imagePath = imageData.filePath;
      // Now you can use the uploaded image path + form data
      console.log('Uploaded file path:', imagePath);
    }
    const userProfileWithHome = await addUserHome({...userProfileHome,userId:userProfile.userId, imagePath:imagePath});
    userProfileWithHome?.user && setUserProfileHome({...userProfileWithHome.user});
    setIsHomeSetOrUpdated(true)
  };

 

  return (
    
    <section id="home" className="min-h-screen flex items-center justify-center relative">
      <RevealOnScroll>
        { isHomeSetOrUpdated ? (
      <div className="flex">
        <div className="text-center z-10 px-4">
        <img src={`${userProfileHome?.imagePath}`} alt="Description" width="300" className="rounded-full"/>;
        </div>
        <div className="text-center z-10 px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-500 
          to-cyan-400 bg-clip-text text-transparent leading-right">{`Hi, I'm ${userProfileHome.fullName}`}</h1>
          <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
          {userProfileHome.userDesc}
          </p>
          <div className="flex justify-center space-x-4">
              <a href="#projects"
              className="bg-blue-500 text-white py-3 px-6 rounded font-medium transition relative 
              overflow-hidden hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]"
              >View Projects</a>
              <a href="#contact"
              className="border border-blue-500/50 text-blue-500 py-3 px-6 rounded font-medium 
              transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] 
              hover:bg-blue-500/10"
              >Contact Me</a>
          </div>
        </div>
      </div>):(
        <div className="p-5 flex w-md  flex-col border-1 border-green-800 rounded">
          <h2 className="text-gray-100 font-bold text-center mb-5">Describe about Yourself</h2>
          <p className="text-gray-100 font-mono text-center mb-5">This will be your profile landing page</p>
          <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col"
          >
            <Input
            icon={User}
            type="text"
            placeholder="Your full name"
            onChange={(e) => setUserProfileHome({...userProfileHome,fullName:e.target.value})}
            value={userProfileHome.fullName}
            name="fullName"
            required={true}
            />

            <TextArea
            icon={Text}
            type="email"
            placeholder="Describe about yourself in few words (500 chars)"
            onChange={(e) => setUserProfileHome({...userProfileHome,userDesc:e.target.value})}
            rows={5}      
            value={userProfileHome.desc}  
            name="desc"    
            required={true}
            />
          
          </form>
          <form method="post" encType="multipart/form-data" onSubmit={handleSubmit} className="mt-5">
          <div className="flex flex-col items-center justify-between w-full">
              <div className="flex flex-col  w-full">
                <label htmlFor="upload" className="text-gray-100 font-semibold">Upload your profile picture</label>
                <Input
                  icon={File}
                  type="file"
                  name={"image"}
                  onChange={handleFileChange} 
                  style={{width:"100%",backgroundColor:"green"}}
                 
                  />
              </div>
                            
                 
              </div>
              {file ? <p className="text-gray-100 font-semibold mb-5">{`Selected image name:`}<span className="text-green-500"> {`${file?.name}`}</span></p>: null}
              <div className="flex items-end justify-end  ">
              <motion.button
                className="w-25 py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold 
                rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 
                focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
                whileHover={{scale:1.02}}
                whileTap={{scale:0.98}}
                type="submit"
                >
                  {"Save"}
              </motion.button>                
              </div>             
             
          </form>
        </div>
      )}
      </RevealOnScroll>
    </section>
  )
}

export default Home
