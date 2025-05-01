import { motion } from 'framer-motion';
import { Minus, Plus, X } from 'lucide-react';
import React, { useState } from 'react';
import { useBlogStore } from '../../store/blogStore';
import { NavLink } from 'react-router';
import ConfirmModal from '../../components/ConfirmModal';

const Blog = ({id,title,authorId, handleDelete}) => {
    
const {selectedBlog,getBlogById } =  useBlogStore();
const [opened, setOpened] = useState(false);
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedId, setSelectedId] = useState(null);

console.log(selectedBlog)

const handleOpen = async() =>{
        setOpened(false)      
        await getBlogById(id);
        setOpened(true)   
}
const handleDeleteClick = () => {
  setIsModalOpen(true);
};
const handleConfirmDelete = () => {
  console.log("Deleting item with id:", id, "AuthorId:",authorId);
  setIsModalOpen(false);
  handleDelete(id,authorId);
};
const handleCancelDelete = () => {
  setIsModalOpen(false);
};
  return (
    <div className="flex  justify-start flex-col overflow-hidden  w-full">
        <div className="flex items-center cursor-pointer w-full  " > 
            <div onClick={()=>{
              if(!opened) {
                  handleOpen();
              }else{
                  setOpened(false)  
              };
            }}>
            {opened && (selectedBlog[id]?.id === id) ? 
            <Minus size={25}  className=" flex text-amber-500 hover:border-amber-300 hover:-translate-0.5 hover:text-blue-800"/> : 
            <Plus size={25} className="text-blue-800 flex  hover:border-amber-300 hover:-translate-0.5 hover:text-amber-500"/> }  
            </div>
            <div className="flex justify-between items-center gap-3 ">
            <NavLink to={`/blogs/${id}`}>
              <li className="cursor-pointer text-xl list-none p-1 ml-3 font-regular text-blue-900 hover:text-gray-900 truncate w-75 " title={title}>
                  {title}  
              </li>
            </NavLink>
            <X size={25} className="text-red-800 flex border rounded hover:border-amber-300 hover:-translate-0.5 hover:text-amber-500" onClick={handleDeleteClick}/>
            </div>
        </div>
        {
        opened && (selectedBlog[id]?.id === id) ? 
        <motion.div
        initial={{opacity:0,y:20}}
        animate={{opacity:1,y:0}}
        transition={{duration:0.5}}
        className="max-w-3xl w-full mx-auto flex justify-start items-start p-3 flex-col  bg-blue-900 rounded"
        >
          <div className="flex justify-center items-center w-full font-light text-2xl p-2 text-white">{selectedBlog[id]?.content}</div>
                 
        </motion.div> :
        null
        }
    <ConfirmModal
        isOpen={isModalOpen}
        title="Confirm Deletion"
        message="Are you sure you want to delete this item?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  )
}

export default Blog
