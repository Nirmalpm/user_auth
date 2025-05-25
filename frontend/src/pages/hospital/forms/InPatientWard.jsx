import React from 'react'
import { usePasStore } from '../../../store/pasStore'
import { useState } from 'react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const InPatientWard = ({patient,setIsModalCompOpen,resetSelection}) => {
   const initialState = {patient_id:patient.id,admission_date:'',bed_number:'',ward_id:'', doctor_id:''};
   const [beds,setBeds] =  useState([]);
   const {wards,doctors,getVacantBeds,admitPatient} =  usePasStore();
   const [wardPatient, setWardPatient] = useState(initialState);
 
console.log(patient)
  const handleWardChange = async (e,wardId) =>{
    console.log(wardId)
    const beds = await getVacantBeds(wardId);
    setBeds(beds);
    setWardPatient((prev)=>({...prev,[e.target.name]:e.target.value}))
  }
  const handleChange = (e) =>{
    setWardPatient((prev)=>({...prev,[e.target.name]:e.target.value}))
  }

  const handleSubmit = async (e) =>{
    e.preventDefault();
    console.log(wardPatient)
    try {
        const result = await admitPatient(wardPatient);
        toast.success("Patient admitted successfully");
        setIsModalCompOpen(false);
        resetSelection();
    } catch (error) {
        toast.error("Error: "+error.message);
    }
  }
  return (
     <form  className="flex flex-wrap flex-col " onSubmit={handleSubmit}>
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 bg-gray-400 w-full justify-center p-3">
        
         <div className="bg-gray-300 p-2 rounded  flex flex-col">
            <label htmlFor='admission_date'>Admission Date:</label>
            <input type="date" name="admission_date" className="border-1 m-1 rounded border-gray-100 bg-gray-50" onChange={handleChange}/>
        </div>
       
        <div className="bg-gray-300 p-2 rounded  flex flex-col">
            <label htmlFor='ward_id'>Ward :</label>
            <select name="ward_id" className="border-1 m-1 rounded border-gray-100 bg-gray-50"
             onChange={(e)=>handleWardChange(e,e.target.value)}>
                <option>-Select-</option>
                {wards && wards.map((ward)=>(
                    <option key={ward.id} value={ward.id} >{ward.ward_name}</option>
                ))}
            </select>
        </div>

        <div className="bg-gray-300 p-2 rounded  flex justify-center items-center flex-col">
            <label htmlFor='bed_number'>Bed No.:</label>
            <select name="bed_number" className="border-1 m-1 rounded border-gray-100 bg-gray-50"  onChange={handleChange}>
                <option>-Select-</option>
                {beds && beds.map((bed)=>(
                    <option key={bed.bed_no} value={bed.bed_no} >{bed.bed_no}</option>
                ))}
            </select>
        </div>

        <div className="bg-gray-300 p-2 rounded  flex flex-col">
            <label htmlFor='doctor_id'>Doctor:</label>
            <select name="doctor_id" className="border-1 m-1 rounded border-gray-100 bg-gray-50"  onChange={handleChange}>
                <option>-Select-</option>
                 {doctors && doctors.map((doctor)=>(
                    <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                ))}
            </select>
        </div>
        <div className=" p-2 rounded flex flex-col">               
                <input type="submit" value="Allocate" 
                className="text-gray-50 cursor-pointer hover:bg-amber-400 
                hover:-translate-y-1 m-1 rounded border-blue-800 bg-blue-800 " />
            </div>
    </div>
    </form>
  )
}

export default InPatientWard
