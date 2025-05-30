import React, { useEffect, useState } from 'react'
import { usePasStore } from '../../../store/pasStore';

const Department = () => {
    const [name, setName] = useState("");
    const [depts, setDepts] = useState([]);
    const[count,setCount]  = useState(0);
    const {addDepartment, getDepartments} = usePasStore();
    const handleSubmit = async (e)=>{
        e.preventDefault();
        const depts = await addDepartment(name);
        setDepts(depts);
        setName("");
        setCount((prev)=> prev + 1)
    }

    useEffect(()=>{
        const fetchDepts = async ()=>{
            const depts = await getDepartments();
            setDepts(depts);
        }
        fetchDepts();
    },[count]);
  return (
    <div className="flex flex-col  justify-center items-center bg-gray-500">
      <h1 className="text-2xl mb-3">Add Department</h1>
      <form onSubmit={handleSubmit} className="flex justify-center items-center gap-2">
        <div>
            <label htmlFor="name">Name:</label>
            <input type="text" className="bg-gray-300 p-2 rounded m-2" id="name" maxLength={100} value={name} onChange={(e)=> setName(e.target.value)}/>
        </div>
        
            <input type="submit" value={"Save"} className="bg-blue-800 pl-2 pr-2 rounded mt-2 text-amber-50 
            cursor-pointer hover:-translate-y-1 transition hover:bg-amber-500"/>
       
      </form>
      <div className="mt-3 flex flex-col w-sm h-50 overflow-y-auto">
              <div className="flex  sticky top-0 ">
                <div className="p-1 w-3/4 bg-blue-400 text-amber-50 text-center">Department</div>
                <div className="p-1 w-1/4 bg-blue-400 text-amber-50 text-center">Doctors</div>
              </div>
        {
            depts && depts.map((dept)=>(
              <div className="flex"  key={dept.id}>
                <div className="p-1 w-3/4 odd:bg-gray-600 even:bg-gray-400 text-amber-50  text-center">{dept.name}</div>
                <div className="p-1 w-1/4 odd:bg-gray-600 even:bg-gray-400 text-amber-50  text-center">{dept.doctor_count}</div>
              </div>
            ))
        }
      </div>
    </div>
  )
}

export default Department
