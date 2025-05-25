import React from 'react'
import { usePasStore } from '../../../store/pasStore'
import { useState } from 'react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const OutPatientConsult = ({patient,setIsModalCompOpen,resetSelection}) => {
   const initialState = {op_id:patient.id,visit_date_time:'', doctor_id:'',diagnosis:'',remarks:'',prescription:'',amount:''};
   const {doctors,addOpConsultation} =  usePasStore();
   const [outPatientCounsult, setOutPatientCounsult] = useState(initialState);
 
console.log(patient)
  
  const handleChange = (e) =>{
    setOutPatientCounsult((prev)=>({...prev,[e.target.name]:e.target.value}))
  }

  const handleDocChange = (e) =>{
     const doctorObj = JSON.parse(e.target.value);
    console.log(doctorObj)
    setOutPatientCounsult((prev)=>({...prev,amount:doctorObj.consult_fee,doctor_id:doctorObj.id}))
  }

  const handleSubmit = async (e) =>{
    e.preventDefault();
    console.log(outPatientCounsult)
    try {
        const result = await addOpConsultation(outPatientCounsult);
        toast.success("Consultation registered successfully");
        setOutPatientCounsult(initialState);
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
            <label htmlFor='visit_date_time'>Consultation Date:</label>
            <input type="date" name="visit_date_time" className="border-1 m-1 rounded border-gray-100 bg-gray-50" onChange={handleChange}/>
        </div>
       <div className="bg-gray-300 p-2 rounded  flex flex-col">
            <label htmlFor='doctor_id'>Doctor:</label>
            <select name="doctor_id" className="border-1 m-1 rounded border-gray-100 bg-gray-50"  onChange={handleDocChange}>
                <option>-Select-</option>
                 {doctors && doctors.map((doctor)=>(
                    <option key={doctor.id} value={JSON.stringify(doctor)}>{doctor.name}</option>
                ))}
            </select>
        </div>
        <div className="bg-gray-300 p-2 rounded  flex flex-col">
            <label htmlFor='diagnosis'>Diagnosis :</label>
            <textarea name="diagnosis" className="border-1 m-1 rounded border-gray-100 bg-gray-50"
             onChange={handleChange}/>
        </div>
        <div className="bg-gray-300 p-2 rounded  flex flex-col">
            <label htmlFor='remarks'>Remarks :</label>
            <textarea name="remarks" className="border-1 m-1 rounded border-gray-100 bg-gray-50"
             onChange={handleChange}/>
        </div>
        <div className="bg-gray-300 p-2 rounded  flex flex-col">
            <label htmlFor='prescription'>Prescription :</label>
            <textarea name="prescription" className="border-1 m-1 rounded border-gray-100 bg-gray-50"
             onChange={handleChange}/>
        </div>
        <div className="bg-gray-300 p-2 rounded  flex flex-col">
            <label htmlFor='amount'>Amount :</label>
            <input type="number" name="amount" value={outPatientCounsult.amount} className="border-1 m-1 rounded border-gray-100 bg-gray-50"
             onChange={handleChange} readOnly/>
        </div>
        
        
        <div className=" p-2 rounded flex flex-col">               
                <input type="submit" value="Add Consultation" 
                className="text-gray-50 cursor-pointer hover:bg-amber-400 
                hover:-translate-y-1 m-1 rounded border-blue-800 bg-blue-800 " />
            </div>
    </div>
    </form>
  )
}

export default OutPatientConsult
