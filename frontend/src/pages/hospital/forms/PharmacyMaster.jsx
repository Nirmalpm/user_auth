import React, { useEffect, useState } from 'react'
import { usePasStore } from '../../../store/pasStore';
import toast from 'react-hot-toast'
import { formatDate } from '../../../utils/date';

const PharmacyMaster = () => {
    const initialState = {name:'',stock_quantity:'',price_per_unit:'',expiry_date:''}
    const [pharmacyItem, setPharmacyItem] = useState(initialState);
    const [pharmacyItems, setPharmacyItems] = useState([]);
    const[count,setCount]  = useState(0);
    const {addPharmacyItem, getPharmacyItems} = usePasStore();

    const handleChange = (e)=>{
      setPharmacyItem((prev)=>( {...prev,[e.target.name]:e.target.value}))
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();
       try {
         const pharmacyItems = await addPharmacyItem(pharmacyItem);
         setPharmacyItems(pharmacyItems);
         setPharmacyItem(initialState);
         setCount((prev)=> prev + 1);
         toast.success("Item added successfully")
       } catch (error) {
        toast.error("error:"+error.mesage)
       }
    }

    useEffect(()=>{
        const fetchItems = async ()=>{
            const items = await getPharmacyItems();
            setPharmacyItems(items);
        }
        fetchItems();
    },[count]);
  return (
    <div className="flex flex-col  justify-center items-center">
      <h1 className="text-2xl mb-3">Add Item</h1>
      <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-1 p-2">
        <div>
            <label htmlFor="name">Name:</label>
            <input type="text" className="bg-gray-300 p-2 rounded m-2" name="name" maxLength={100} value={pharmacyItem.name}  onChange={handleChange}/>
        </div>
        <div>
            <label htmlFor="stock_quantity">Stock Qty:</label>
            <input type="number" className="bg-gray-300 p-2 rounded m-2" name="stock_quantity" maxLength={100} value={pharmacyItem.stock_quantity}  onChange={handleChange}/>
        </div>
        <div>
            <label htmlFor="price_per_unit">Price/Unit:</label>
            <input type="number" className="bg-gray-300 p-2 rounded m-2" name="price_per_unit" maxLength={100} value={pharmacyItem.price_per_unit}  onChange={handleChange}/>
        </div>
        <div>
            <label htmlFor="expiry_date">Expiry Date</label>
            <input type="date" className="bg-gray-300 p-2 rounded m-2" name="expiry_date" maxLength={100} value={pharmacyItem.expiry_date} onChange={handleChange}/>
        </div>
        
            <input type="submit" value={"Save"} className="bg-blue-800 pl-2 pr-2 rounded mt-2 text-amber-50 
            cursor-pointer hover:-translate-y-1 transition hover:bg-amber-500"/>
       
      </form>
      <div className="mt-3 flex flex-col w-full h-50 overflow-y-auto  pl-3 pr-3">
              <div className="flex  sticky top-0 ">
                <div className="p-1 w-3/4 bg-blue-400 text-amber-50 text-center">Name</div>
                <div className="p-1 w-1/4 bg-blue-400 text-amber-50 text-center">Stock Qty</div>
                <div className="p-1 w-1/4 bg-blue-400 text-amber-50 text-center">Price/Unit</div>
                <div className="p-1 w-1/4 bg-blue-400 text-amber-50 text-center">Exp. Date</div>
              </div>
        {
            pharmacyItems && pharmacyItems.map((item)=>(
              <div className="flex odd:bg-gray-600 even:bg-gray-400"  key={item.id}>
                <div className="p-1 w-3/4  text-amber-50  text-center">{item.name}</div>
                <div className="p-1 w-1/4 text-amber-50  text-center">{item.stock_quantity}</div>
                <div className="p-1 w-1/4  text-amber-50  text-center">{item.price_per_unit}</div>
                <div className="p-1 w-1/4  text-amber-50  text-center">{item.expiry_date ? formatDate(item.expiry_date): null}</div>
              </div>
            ))
        }
      </div>
    </div>
  )
}

export default PharmacyMaster
