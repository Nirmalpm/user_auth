import { Edit, Minus, Plus, RefreshCw, SaveAll, Text, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import Input from './Input';
import { useUserStore } from '../store/userStore';
import toast from 'react-hot-toast';

const ItemList = (props) => {
  //const initialItemsRef = useRef([...props.itemList]); // true original
  const inputRefs = useRef([]);
  const [items, setItems] = useState([...props.itemList]);
  const [isEditMode, setIsEditMode]    = useState(false);
  const {userId, profileUserId, handleSave} = props;
   ////console.log(items),//console.log(inputRefs.current)
   const {deleteSkill} = useUserStore();

  useEffect(() => {
    setItems([...props.itemList]);
  }, [props.itemList]);

  const handleAddItem = () => {
    setIsEditMode(true);
    setItems((prev) => {
        const updated = [...prev, { name: "" }];
        // Wait for DOM update, then focus
        //Below will run at the end of call satck, ie. after rendering and stuffs
        setTimeout(() => {
          inputRefs.current[updated.length - 1]?.focus();
        }, 0);
        return updated;
      });
  }
  const handleItemChange = (e,index) =>{   
    const newItems = [...items];
    newItems[index] = {
        ...newItems[index],
        [e.target.name]: e.target.value,
    };
    setItems(newItems);
  }

  const save = async() =>{
    setIsEditMode(!isEditMode);
    await handleSave(userId, profileUserId, items);
  }

  const deleteSkills = async(id, tableName) =>{
    setIsEditMode(!isEditMode);
    try {
      await deleteSkill(userId, profileUserId, id,tableName);
      toast.success("Skill deleted successfully!");
    } catch (error) {
      toast.error("Skill deletion failed!");
    }
  }

      
  return (   
  <div className='rounded-xl p-2 hover:-translate-y-1 transition-all border-1 border-gray-700'>
    <div className="flex flex-row gap-2 items-start">
        <h3 className="text-xl font- mb-4 font-semibold text-gray-800">{props.title}</h3>
        {isEditMode || props.itemList?.length === 0 ?<Plus className="size-5 bg-amber-300 hover:-translate-y-0.5 rounded hover:shadow-[0_0_25px_rgba(255,255,255,0.8)] " onClick={handleAddItem}/> : null}
        <RefreshCw className="size-5 bg-amber-300 hover:-translate-y-0.5 rounded hover:shadow-[0_0_25px_rgba(255,255,255,0.8)] " onClick={()=> {
        setItems([...props.itemList]);
        setIsEditMode(false);
        }}/>    
        {isEditMode ? (       
            <>   
              <SaveAll className="size-5 bg-blue-300 hover:-translate-y-0.5 rounded hover:shadow-[0_0_25px_rgba(255,255,255,0.8)] " onClick={save} />
              <X title="Edit" className="size-5 bg-amber-300 hover:-translate-y-0.5 text-gray-900  rounded hover:shadow-[0_0_25px_rgba(255,255,255,0.8)] cursor-pointer" onClick={()=> setIsEditMode(!isEditMode)}/>
            </>  
        ) :(
            props.itemList?.length !== 0 && <Edit className="size-5 bg-red-300 hover:-translate-y-0.5 rounded hover:shadow-[0_0_25px_rgba(255,255,255,0.8)] " onClick={()=> setIsEditMode(!isEditMode)}/>
        )}
    </div>
    <div className="flex flex-wrap gap-2">
      {isEditMode && 
      items.map(
        (item, index)=>  
        <div className="flex flex-row items-center justify-center m-2 gap-2" key={item.id}>
            <Input icon={Text} className="m-1 pl-2 bg-green-100 rounded w-75" type="text" 
            name="name" key={item.id} value={item.name} onChange={(e)=>handleItemChange(e, index)} 
            ref={(el) => (inputRefs.current[index] = el)} style={{backgroundColor:'#bbb',color:'#000'}}/>
            <Minus className="size-5 bg-amber-300 hover:-translate-y-0.5 rounded 
            hover:shadow-[0_0_25px_rgba(255,255,255,0.8)] " onClick={
                (e)=>{
                setItems((prev) => prev.filter((_, i) => i !== index));
                inputRefs.current[index] = null;
                deleteSkills(item.id,props.tableName);
                }
            }/>
        </div>  
      )
      }
      {!isEditMode && items.map((item, index)=>(
          <span className="bg-blue-500/10 text-blue-500 py-1 px-3 rounded-full text-sm hover:bg-blue-500/20 hover:shadow-[0_2px_8px_rgba(59,130,246,0.2)] transition " key={item.id}>{item.name}</span>
      ))}
  </div>
</div>
    
  )
}



export default ItemList
