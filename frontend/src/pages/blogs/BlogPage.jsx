import { motion } from 'framer-motion';
import { Text, Search, Delete } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from "react-hot-toast";
import { NavLink } from 'react-router';
import Input from '../../components/Input';
import TextArea from '../../components/TextArea';
import { useAuthStore } from '../../store/authStore';
import { useBlogStore } from '../../store/blogStore';
import Blog from './Blog';

const BlogPage = () => {
    const initialState = {
        title:"",
        content:"",
        userId:""
    }
  const {saveBlog, getBlogs,selectedBlog,getBlogById, blogs, deleteBlog } =  useBlogStore();
  const {user} = useAuthStore();
  const[blog, setBlog] = useState(initialState);
  const[bloggings, setBloggings] = useState([]);
  const [searchText, setSearchText] = useState("");

    //console.log(blogs, selectedBlog)

  useEffect(()=>{
    const getAllBlogs = async ()=>{
      const allBlogs = await getBlogs();
      setBloggings([...allBlogs]);
    }
    getAllBlogs();
  },[getBlogs,blog])

  const handleSubmit = async (e)=>{
    e.preventDefault();
    //console.log(user);
    const blogWithUser = { ...blog, userId: user._id };
   
    await saveBlog(blogWithUser);
    setBlog(initialState);
  }

  const handleOnChange = (e) =>{
    setBlog({...blog, [e.target.name]:e.target.value})
  }

  const handleDelete= async (id,authorId)=>{
    try {
      const allBlogs = await deleteBlog(id, user,authorId);
      setBloggings([...allBlogs]);
      toast.success("Blog removed successfully")
    } catch (error) {
      if(error.status === 403){
        toast.error("You don't have permission to remove the blogs")
      }
    }
  }

  const handleSearch = (e) =>{
    const blgs = blogs.filter((blog)=>blog.title.toLowerCase().includes(e.target.value.toLowerCase()));
    //console.log(blgs)
    setSearchText(e.target.value)
    setBloggings([...blgs])
  }

  return (
    <div className=" w-full mx-auto backdrop-filter backdrop-blur-xl 
    bg-gradient-to-r from-gray-100 to-blue-900   gap-3 mt-20">
      <motion.div
      initial={{opacity:0,y:20}}
      animate={{opacity:1,y:0}}
      transition={{duration:0.5}}
      className=" w-full mx-auto flex justify-center  items-center p-3 flex-col "
      >
           <div className="flex  w-full m-2  flex-col justify-center">
            <div className="flex w-full justify-center font-robotoflex items-end font-bold text-cyan-900 text-4xl mb-10">Blogs</div>
            <div className="flex w-full justify-center items-start ">
              <Input icon={Search} style={{width:"300px"}} value={searchText} placeholder="Search Blogs" onChange={handleSearch} />
              <Delete size={30} className="text-gray-200" onClick={async()=> {
                setSearchText("");
                const allBlogs = await getBlogs();
                setBloggings([...allBlogs]);
                }}/>
            </div>
           
          </div>
        <div className=" max-w-3xl w-full p-5 gap-2 flex flex-col rounded-2xl">  
          <div className="italic text-white">(Expand (+) to view blog here or click to navigate to discussion page)</div>
        <ul className=" flex flex-col  w-full">
        {
          bloggings && bloggings.map((blog)=>(
            <div className="flex list-disc list-inside w-full" key={blog.id}>             
              <Blog  id={blog.id} title={blog.title} authorId={blog.authorId} handleDelete={handleDelete}/>
            </div>
          ))
        }
        </ul>
        </div>
      </motion.div>
       
      <motion.div
      initial={{opacity:0,y:20}}
      animate={{opacity:1,y:0}}
      transition={{duration:0.5}}
      className="max-w-3xl w-full mx-auto p-2"
      >
      <form onSubmit={handleSubmit} className="border-1 w-full p-5 gap-2 flex flex-col rounded-2xl">
        <h1 className="font-sans font-bold text-blue-900 ">Add your blog</h1>
        <Input icon={Text} type="text" name="title" placeholder="Blog title" value={blog.title} onChange={(e)=>handleOnChange(e)} 
        style={{ backgroundColor: '#fff', paddingRight: '40px', color: 'black' }}/>
        <TextArea icon={Text} rows={10} name="content" placeholder="Blog content" value={blog.content} onChange={(e)=>handleOnChange(e)} 
        style={{ backgroundColor: '#fff', paddingRight: '40px', color: 'black' }}/>
        <div className="flex justify-center flex-row">
          <motion.button type='submit' className="bg-blue-900 p-3 m-2 gap-2 flex flex-col rounded w-1/3 text-center text-white">Save</motion.button>
          <motion.button type='button' className="bg-blue-900 p-3 m-2 gap-2 flex flex-col rounded w-1/3 text-center text-white" onClick={() => setBlog(initialState)}>Reset</motion.button>
        </div>
      </form>
      </motion.div>
      
    </div>
  )
}

export default BlogPage
