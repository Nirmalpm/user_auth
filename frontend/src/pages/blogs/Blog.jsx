import { motion } from 'framer-motion';
import { Minus, Plus, X } from 'lucide-react';
import React, { useState } from 'react';
import { useBlogStore } from '../../store/blogStore';
import { NavLink } from 'react-router';

const Blog = ({id,title,authorId, handleDelete}) => {
    
const {selectedBlog,getBlogById } =  useBlogStore();
const [opened, setOpened] = useState(false);

console.log(selectedBlog)

const handleOpen = async() =>{
        setOpened(false)      
        await getBlogById(id);
        setOpened(true)   
}

  return (
    <div className="flex  justify-start flex-col overflow-hidden ">
        <div className="flex items-center cursor-pointer" > 
            <div onClick={()=>{
              if(!opened) {
                  handleOpen();
              }else{
                  setOpened(false)  
              };
            }}>
            {opened && (selectedBlog[id]?.id === id) ? <Minus size={15}/> : <Plus size={15}/> }  
            </div>
            <div className="flex justify-between gap-3">
            <NavLink to={`/blogs/${id}`}>
              <li className="cursor-pointer  p-1 ml-3 font-sans font-regular hover:text-white truncate w-75 flex" title={title}>
                  {title}  
              </li>
            </NavLink>
            <X size={15} className="text-red-800" onClick={()=> handleDelete(id,authorId)}/>
            </div>
        </div>
        {
        opened && (selectedBlog[id]?.id === id) ? 
        <motion.div
        initial={{opacity:0,y:20}}
        animate={{opacity:1,y:0}}
        transition={{duration:0.5}}
        className="max-w-3xl w-full mx-auto flex justify-start items-start p-3 flex-col  bg-emerald-900 rounded"
        >
          <div className="flex justify-center items-center w-full font-light text-2xl p-2 text-white">{selectedBlog[id]?.content}</div>
                 
        </motion.div> :
        null
        }
    
    </div>
  )
}

export default Blog
