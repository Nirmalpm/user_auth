import React, { useEffect, useState } from 'react'
import { usePasStore } from '../../../store/pasStore';
import toast from 'react-hot-toast'
import { formatDate } from '../../../utils/date';

const CanteenMaster = () => {
    const initialState = {item_name:'',quantity:'',item_price:'',expiry_date:''}
    const [item, setItem] = useState(initialState);
    const [items, setItems] = useState([]);
    const[count,setCount]  = useState(0);
    const {addCanteenItem, getCanteenItems} = usePasStore();

    const handleChange = (e)=>{
      setItem((prev)=>( {...prev,[e.target.name]:e.target.value}))
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();
       try {
         const items = await addCanteenItem(item);
         setItems(items);
         setItem(initialState);
         setCount((prev)=> prev + 1);
         toast.success("Item added successfully")
       } catch (error) {
        toast.error("error:"+error.mesage)
       }
    }

    useEffect(()=>{
        const fetchItems = async ()=>{
            const items = await getCanteenItems();
            setItems(items);
        }
        fetchItems();
    },[count]);
  return (
    <div className="flex flex-col  justify-center items-center  bg-gray-500">
      <h1 className="text-2xl mb-3">Add Item</h1>
      <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-1 p-2">
        <div>
            <label htmlFor="name">Item Name:</label>
            <input type="text" className="bg-gray-300 p-2 rounded m-2" name="item_name" maxLength={100} value={item.item_name}  onChange={handleChange}/>
        </div>
        <div>
            <label htmlFor="item_price">Item Price:</label>
            <input type="number" className="bg-gray-300 p-2 rounded m-2" name="item_price" maxLength={100} value={item.item_price}  onChange={handleChange}/>
        </div>
        <div>
            <label htmlFor="quantity">Quantity:</label>
            <input type="number" className="bg-gray-300 p-2 rounded m-2" name="quantity" maxLength={100} value={item.quantity}  onChange={handleChange}/>
        </div>
        <div>
            <label htmlFor="expiry_date">Expiry Date</label>
            <input type="date" className="bg-gray-300 p-2 rounded m-2" name="expiry_date" maxLength={100} value={item.expiry_date} onChange={handleChange}/>
        </div>
        
            <input type="submit" value={"Save"} className="bg-blue-800 pl-2 pr-2 rounded mt-2 text-amber-50 
            cursor-pointer hover:-translate-y-1 transition hover:bg-amber-500"/>
       
      </form>
      <div className="mt-3 flex flex-col w-full h-50 overflow-y-auto  pl-3 pr-3">
              <div className="flex  sticky top-0 ">
                <div className="p-1 w-3/4 bg-blue-400 text-amber-50 text-center">Name</div>
                <div className="p-1 w-1/4 bg-blue-400 text-amber-50 text-center">Price</div>
                <div className="p-1 w-1/4 bg-blue-400 text-amber-50 text-center">Quantity</div>
                <div className="p-1 w-1/4 bg-blue-400 text-amber-50 text-center">Exp. Date</div>
              </div>
        {
            items && items.map((item)=>(
              <div className="flex odd:bg-gray-600 even:bg-gray-400"  key={item.id}>
                <div className="p-1 w-3/4  text-amber-50  text-center">{item.item_name}</div>
                <div className="p-1 w-1/4 text-amber-50  text-center">{item.item_price}</div>
                <div className="p-1 w-1/4  text-amber-50  text-center">{item.quantity}</div>
                <div className="p-1 w-1/4  text-amber-50  text-center">{item.expiry_date? formatDate(item.expiry_date): null}</div>
              </div>
            ))
        }
      </div>
    </div>
  )
}

export default CanteenMaster
