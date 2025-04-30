import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserStore } from '../../store/userStore';
import quote from '../../assets/images/believe-quote.jpg';
import {  Loader } from "lucide-react";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/user"
    : "/api/user";

const DailyQuotes = () => {
  const [imageUrl, setImageUrl] = useState();
  const [changeImage, setChangeImage] = useState(false);
  
  useEffect(() => {
    const getImage = async () => {
        try {
            const response = await axios.get(`${API_URL}/getQuoteImageUrl`, { responseType: 'blob' });            
            // Create a local URL for the image
            const imageObjectURL = URL.createObjectURL(response.data);
            setImageUrl(imageObjectURL);  // Set the image URL
    
          } catch (error) {
            console.error('Error fetching quote image:', error);
          }
        };

    // Call immediately first time
   getImage();

  const intervalId = setInterval(getImage , 1000 * 60 * 5); // 5000 ms = 5 seconds

    // Cleanup function to clear the interval when the component unmounts
   return () => clearInterval(intervalId);
  }, [changeImage]);

  return (
    <div className="flex items-center justify-center m-2">
    {imageUrl ?
   ( <div className="flex justify-center items-center flex-col">
         
        {/* <img src={`${API_URL}/getQuoteImageUrl`} alt="Quote" className="rounded-2xl m-2 w-full h-full max-h-3/4" />  */}
        <img src={imageUrl} alt="Daily Quote" className="rounded-2xl m-2 w-full h-full max-h-3/4"/>  
        <div className="text-yellow-800 font-semibold cursor-pointer" onClick={()=> {
            // setImageUrl("");
            setChangeImage(!changeImage);
            }}>Change</div>    
    </div>):
    ( 
    <div className="flex w-full mt-10 text-white">
        <Loader className='size-20 animate-spin mx-auto' />Loading image...
    </div>
    )
    }
    </div>
  );
};

export default DailyQuotes;



