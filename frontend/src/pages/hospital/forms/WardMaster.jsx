import React, { useEffect, useState } from 'react'
import { usePasStore } from '../../../store/pasStore';
import toast from 'react-hot-toast'

const WardMaster = () => {
    const initialState = {ward_name:'',total_beds:'',ward_type:'',per_day_rent:''}
    const [ward, setWard] = useState(initialState);
    const [wards, setWards] = useState([]);
    const[count,setCount]  = useState(0);
    const {addWard, getWards} = usePasStore();

    const handleChange = (e)=>{
      setWard((prev)=>( {...prev,[e.target.name]:e.target.value}))
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();
       try {
         const wards = await addWard(ward);
         setWards(wards);
         setWard(initialState);
         setCount((prev)=> prev + 1);
         toast.success("Ward added successfully")
       } catch (error) {
        toast.error("error:"+error.mesage)
       }
    }

    useEffect(()=>{
        const fetchWards = async ()=>{
            const wards = await getWards();
            setWards(wards);
        }
        fetchWards();
    },[count]);
  return (
    <div className="flex flex-col  justify-center items-center  bg-gray-500">
      <h1 className="text-2xl mb-3">Add Ward</h1>
      <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-1 p-2">
        <div>
            <label htmlFor="ward_name">Name:</label>
            <input type="text" className="bg-gray-300 p-2 rounded m-2" name="ward_name" maxLength={100} value={ward.ward_name}  onChange={handleChange}/>
        </div>
        <div>
            <label htmlFor="ward_type">Type:</label>
            <select name="ward_type" className="bg-gray-300 p-2 rounded m-2" onChange={handleChange} value={ward.ward_type}>
              <option value="">-Select-</option>
              <option value="General">General</option>
              <option value="Private">Private</option>
              <option value="Semi-Private">Semi-Private</option>
              <option value="Critical Care">Critical Care</option>
              <option value="Emergency">Emergency</option>
              <option value="Specialized">Specialized</option>
              <option value="Recovery">Recovery</option>
            </select>
        </div>
        <div>
            <label htmlFor="total_beds">Total Beds</label>
            <input type="number" className="bg-gray-300 p-2 rounded m-2" name="total_beds" maxLength={100} value={ward.total_beds} onChange={handleChange}/>
        </div>
        <div>
            <label htmlFor="per_day_rent">Rent/Day</label>
            <input type="number" className="bg-gray-300 p-2 rounded m-2" name="per_day_rent" maxLength={100} value={ward.per_day_rent} onChange={handleChange}/>
        </div>
        
            <input type="submit" value={"Save"} className="bg-blue-800 pl-2 pr-2 rounded mt-2 text-amber-50 
            cursor-pointer hover:-translate-y-1 transition hover:bg-amber-500"/>
       
      </form>
      <div className="mt-3 flex flex-col w-full h-50 overflow-y-auto  pl-3 pr-3">
              <div className="flex  sticky top-0 ">
                <div className="p-1 w-3/4 bg-blue-400 text-amber-50 text-center">Name</div>
                <div className="p-1 w-1/4 bg-blue-400 text-amber-50 text-center">Type</div>
                <div className="p-1 w-1/4 bg-blue-400 text-amber-50 text-center">Total Beds</div>
                <div className="p-1 w-1/4 bg-blue-400 text-amber-50 text-center">Rent/Day</div>
              </div>
        {
            wards && wards.map((ward)=>(
              <div className="flex odd:bg-gray-600 even:bg-gray-400"  key={ward.id}>
                <div className="p-1 w-3/4  text-amber-50  text-center">{ward.ward_name}</div>
                <div className="p-1 w-1/4 text-amber-50  text-center">{ward.ward_type}</div>
                <div className="p-1 w-1/4  text-amber-50  text-center">{ward.total_beds}</div>
                <div className="p-1 w-1/4  text-amber-50  text-center">{ward.per_day_rent}</div>
              </div>
            ))
        }
      </div>
    </div>
  )
}

export default WardMaster
