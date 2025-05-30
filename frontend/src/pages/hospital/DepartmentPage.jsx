import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { usePasStore } from '../../store/pasStore';

const IMAGE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "";

const DepartmentPage = () => {
  const {id} = useParams();
  const {getDeptDoctors} = usePasStore();
  const [doctors, setDoctors] = useState([]);
  useEffect(()=>{
    const fetchDoctors = async ()=>{
        const doctors = await getDeptDoctors(id);
        console.log(doctors)
        setDoctors(doctors)
    }
    fetchDoctors();
  },[id])
  return (
    <div className="flex w-7xl bg-blue-900  h-[630px] m-1 justify-center items-center text-gray-100">
        <div className="flex flex-col w-6xl bg-gray-600 h-[600px] overflow-y-auto">
            <h1 className="flex justify-center text-2xl font-semibold">Department: {doctors[0]?.dept_name}</h1>
            {doctors.length > 0 ?
                <div className="flex flex-col  m-2 border-1">
                {
                doctors && doctors.map((doc)=>(
                <div className="flex p-2 ml-2 gap-2">
                     <img src={`${IMAGE_URL}${doc.photo_path}`} className="w-70 h-50 rounded"/>
                     <div className="flex flex-col w-full">
                        <div>{doc.name}</div>
                        <div>{doc.degree}</div>
                        <div>{doc.contact_number}</div>
                        <div>Email: {doc.email}</div>
                        <div>Specialization: {doc.specialization}</div>
                        <div>Experience: {doc.experience} years</div>
                     </div>
                </div>
                ))
                }
            </div> : <h1 className="flex justify-center m-10 text-2xl">No Doctors yet!</h1>
            }
        </div>
    </div>
  )
}

export default DepartmentPage
