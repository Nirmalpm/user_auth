import React, { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router';
import { motion } from 'framer-motion';
import { useBlogStore } from '../../store/blogStore';
import Input from '../../components/Input';
import { Save, Text } from 'lucide-react';
import TextArea from '../../components/TextArea';
import { useAuthStore } from '../../store/authStore';
import toast from "react-hot-toast";

const BlogDiscussion = () => {
  const { id } = useParams();
  const{getBlogById, saveBlogComments, getComments} = useBlogStore();
  const [blog, setBlog] = useState({});
  const [comments,setComments] = useState([]);
  const {user} = useAuthStore();

  useEffect(()=>{
    const setValues = async () =>{
        const blog = await getBlogById(id);
        const comments = await getComments(id);
        console.log(blog,comments);
        setBlog(blog);
        setComments(comments)
    }
    setValues();
  },[getBlogById,getComments]);

  const  buildTree =(comments) => {
    const map = {};
    const roots = [];
  
    comments.forEach(comment => {
      map[comment.id] = { ...comment, children: [] };
    });
  
    comments.forEach(comment => {
      if (comment.parentId) {
        map[comment.parentId]?.children.push(map[comment.id]);
      } else {
        roots.push(map[comment.id]);
      }
    });
  
    return roots;
  }
  
  const CommentNode = ({ comment,setComments }) => {
    console.log(comment)
    const [clicked, setClicked] = useState(false);
    const {saveBlogComment, deleteComment} = useBlogStore();
    const [comm, setComm] = useState("");
    return (
    <div className="ml-4 border-l border-gray-400 pl-1 my-2 rounded">
      <p><strong>{comment.name}</strong>: {comment.comment}</p>
      <div className="flex gap-2">
        <div onClick={()=> setClicked(!clicked)} className="cursor-pointer  text-blue-500 ">Reply</div>
        <div onClick={
            async ()=> {
                try {
                  const comments = await deleteComment(comment.id,comment.blogId,user, comment.userId);
                  setComments([...comments])
                  toast.success("Comment removed")
                } catch (error) {
                  if(error.status === 403 || error.status === 500){
                    toast.error("Forbidden access or internal error happened")
                  }
                }
            }
        } 
            className="cursor-pointer  text-blue-500 ">Delete</div>
      </div>
      {clicked 
        ? 
        <div className="pr-2 flex w-full p-2 rounded gap-2">
            <TextArea icon={Text} value={comm} onChange={(e)=> setComm(e.target.value)}/> 
            <Save size={25} className="cursor-pointer  text-blue-500 hover:text-amber-600" 
            onClick={
                async ()=> {
                    setClicked(!clicked);
                    const comments = await saveBlogComment({comment:comm,parentId:comment.id, blogId:comment.blogId, userId:user._id});
                    setComments([...comments])
                }
            }/></div> 
            : 
            null
      }
      {comment.children && comment.children.length > 0 && (
        <div className="pl-1 rounded">
          {comment.children.map(child => (
            <CommentNode key={child.id} comment={child} setComments={setComments}/>
          ))}
        </div>
      )}
    </div>
  )};
  

  const display = ()=> {
    const tree = buildTree(comments);
    const [clicked, setClicked] = useState(false);
    const {saveBlogComment} = useBlogStore();
    const [comm, setComm] = useState("");
    return (
        <div className=" w-full rounded">
        <div onClick={()=> setClicked(!clicked)} className="cursor-pointer  text-white p-3 hover:text-amber-600 rounded">Add Comment</div>
        {
        clicked  ? 
            <div className="pr-2 flex w-full p-2 gap-2">
                <TextArea icon={Text} value={comm} onChange={(e)=> setComm(e.target.value)}/> 
                <Save size={25}  className="cursor-pointer  text-blue-500 hover:text-amber-600" 
                onClick={
                    async ()=> {
                        setClicked(!clicked);
                        const comments = await saveBlogComment({comment:comm, blogId:id, userId:user._id});
                        setComments([...comments])
                    }
                }/>
            </div> 
            : 
            null
        }
        <hr className=" w-full my-4 border-t-2 border-gray-600" />
        <div className="w-full bg-gray-300 rounded">            
          {tree.map(comment => (
            <CommentNode key={comment.id} comment={comment}  setComments={setComments}/>
          ))}
        </div>
        </div>
        
      );
  }

  return (
    <div className=" w-full mx-auto backdrop-filter backdrop-blur-xl 
    bg-gradient-to-r from-gray-100 to-emerald-900   gap-3 min-h-screen justify-center  items-start mr-2">
      <motion.div
      initial={{opacity:0,y:20}}
      animate={{opacity:1,y:0}}
      exit={{opacity:0,scale:0.9}} 
      transition={{duration:0.5}} 
      className="max-w-3xl bg-emerald-800 w-full mx-auto  justify-start  items-start  flex-col rounded flex m-5 p-2"
      > 
        <div className="flex w-full justify-end p-2 hover:text-amber-700"><NavLink to="/blogs" className="text-white hover:text-amber-700">Go back</NavLink></div>
        <div className="flex w-full justify-center p-2 font-semibold text-white"><h2>{blog.title}</h2></div>
        <div className="flex mt-10 p-5 text-white">{blog.content}</div>
        {
            display()
        }
        
      </motion.div>
      
    </div>
  )
}

export default BlogDiscussion
