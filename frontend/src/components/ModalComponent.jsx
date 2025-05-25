import React from "react";
import { Edit, X, Text, Save } from 'lucide-react';

const ModalComponent = ({ isOpen,onCancel, children,title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center  z-50 flex-col ">
      
      
      <div className="bg-white p-1 rounded-xl shadow-lg ">
        <div className="justify-center flex bg-gray-500 p-2  rounded-t"> 
            <div  className="justify-end flex w-full text-amber-50 font-semibold">{title}</div>
            <div className="justify-end flex   w-full">
            <X title="Edit" className="size-5 bg-amber-300 hover:-translate-y-0.5 rounded 
                        hover:shadow-[0_0_25px_rgba(255,255,255,0.8)] cursor-pointer" onClick={onCancel}/>
            </div>
            
        </div>
        {children}        
      </div>
    </div>
  );
};

export default ModalComponent;
