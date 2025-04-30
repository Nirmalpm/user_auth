import React, { useEffect, useState } from 'react';
import RevealOnScroll from '../../../components/RevealOnScroll';

import Input from '../../../components/Input';
import TextArea from '../../../components/TextArea';

import { motion } from 'framer-motion';
import { File, Text, User, Edit, X } from 'lucide-react';

import { useUserStore } from '../../../store/userStore';
import { uploadImage } from '../../../utils/fileupload';
import { useAuthStore } from '../../../store/authStore';
import toast from 'react-hot-toast';


const Home = () => {
  const initialState = {userId:'',fullName:'',userDesc:'',imagePath:'',id:null};
  const [file, setFile] = useState(null);
  const [userProfileHome, setUserProfileHome]= useState(initialState);
  const [isHomeSetOrUpdated, setIsHomeSetOrUpdated] = useState(false);
  const [addHome, setAddHome] = useState(false)
  
  const {addUpdateUserHome,userProfile} = useUserStore();
  const {user} = useAuthStore();

  useEffect(()=>{
    console.log(userProfile,user );
    if(userProfile?.homeInfo){
      setUserProfileHome({...userProfile.homeInfo});
      setIsHomeSetOrUpdated(true);
    }    
  },[userProfile]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit  = async (e) => {
    e.preventDefault();
    console.log(userProfile, userProfileHome,user);
    let imagePath = userProfile?.homeInfo?.imagePath;
    if (file) {
      const imageData = await uploadImage(file, user.name);
      imagePath = imageData.filePath;
      // Now you can use the uploaded image path + form data
      console.log('Uploaded file path:', imagePath);
    }
    try {
      await addUpdateUserHome({...userProfileHome,userId:user._id,
        profileUserId:userProfile.profileUserId, imagePath:imagePath, isUpdate:!isHomeSetOrUpdated});
      setIsHomeSetOrUpdated(true)
    } catch (error) {
      toast.error(error.message);
      console.log('handleSubmit:', error);
    }
  };


  return (
    <div id="home">
    <div className="flex relative top-20">
     <h1 className="text-3xl md:text-7xl font-bold m-6 bg-gradient-to-r from-red-500 
          to-cyan-400 bg-clip-text text-transparent leading-right">Portfolio Builder</h1></div>
   { (addHome) ?(
    <section  className=" w-3/4 top-30 min-h-3/4 flex items-center justify-center  flex-col gap-10  relative ">
      
      <h1 className="text-white font-light cursor-pointer flex hover:text-amber-500 underline" 
                        onClick={()=>setAddHome(false)}>Close</h1>
      <RevealOnScroll>
        { isHomeSetOrUpdated ? (
      <div className=" w-full flex ">
        <div className="w-full min-w-1/4 text-center z-10 flex ">
        <img src={`${userProfileHome?.imagePath}`} alt="Description" width="150" className="rounded-full"/>;    
        </div>
        <div className=" w-full min-w-3/4 z-10 px-4 flex items-start flex-col">
          <h1 className=" text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 
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
             
             <Edit title="Edit" className="size-5 bg-amber-300 hover:-translate-y-0.5 rounded 
                    hover:shadow-[0_0_25px_rgba(255,255,255,0.8)] cursor-pointer" onClick={()=> setIsHomeSetOrUpdated(!isHomeSetOrUpdated)}/>
          </div>
        </div>
      </div>):(
        <div className="p-5 flex   flex-col border-1 border-green-800 rounded">
          <div className="p-5 gap-6 flex  justify-center">
            <h2 className="text-gray-100 font-bold text-center mb-5">Describe about Yourself</h2>
            <X  title="Edit" className="size-5 bg-amber-300 hover:-translate-y-0.5 rounded 
                    hover:shadow-[0_0_25px_rgba(255,255,255,0.8)] cursor-pointer" onClick={()=> setIsHomeSetOrUpdated(!isHomeSetOrUpdated)}/>
          </div>
          
          <p className="text-gray-100 font-mono text-center mb-5">This will be your profile landing page</p>
          <form
          onSubmit={handleSubmit}
          className="flex  flex-col"
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
            value={userProfileHome.userDesc}  
            name="desc"    
            required={true}
            />
          
          </form>
          <form method="post" encType="multipart/form-data" onSubmit={handleSubmit} className="mt-5">
          <div className="flex flex-col items-center justify-between w-full">
              <div className="flex flex-col  ">
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
    </section>): 
    <div className="text-white font-light cursor-pointer top-35 flex items-center justify-center relative mt-20 hover:text-amber-500 underline" 
    onClick={()=>setAddHome(true)}>Introduction Section</div>
    }
    
    </div>
  )
}

export default Home
