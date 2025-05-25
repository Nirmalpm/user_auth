import React, { useState } from 'react'
import InPatientWard from './InPatientWard'
import { usePasStore } from '../../../store/pasStore';
import toast from "react-hot-toast";

const PatientRegistration = ({setRegToggler}) => {
  const initialState = {name:'',age:'',date_of_birth:'',gender:'',
    blood_group:'',address:'',contact_number:'',email:'',medical_history:'',reg_date:'',reg_amount:''};
  const [patient,setPatient] = useState(initialState);
  const [registered, setRegistered] = useState(false);
  const {registerPatient} = usePasStore();

  const handleOnChange = (e) =>{
    setPatient((prev)=>({...prev,[e.target.name]:e.target.value}));
  }

  const handleSubmit = async(e) =>{
    e.preventDefault();
    if (!patient.name || !patient.age || !patient.gender ||  !patient.contact_number || !patient.reg_date) {
        toast.error("Please fill all required fields: Name, Age, Gender and Contact Number.");
        return;
    }
    try {
        console.log(patient);
        const data = await registerPatient(patient);
        if(data.error){
            toast.error("Error: "+data.error)
        }else{
            console.log(data);
            setPatient(initialState);
            toast.success("Patient Registration successful");
            console.log("---inside handleSubmit before setRegToggler----")
            setRegToggler((prev)=>(prev + 1))
        }         
    } catch (error) {
        toast.error("Error: "+error.message)
    }
  }

  return (
    <div id="pat_reg" className=" flex flex-col flex-wrap w-2/5 min-w-sm border-1 border-gray-50 justify-center items-center   mb-10 ">
      <h1 className="flex flex-wrap text-2xl text-blue-800 underline font-semibold">PATIENT REGISTRATION </h1>
      <div className="overflow-y-auto h-full">
      <form className="flex flex-wrap flex-col " onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-2  bg-gray-400 w-full justify-center p-3">
            <div className="bg-gray-300 p-2 rounded  flex flex-col flex-wrap">
                <label htmlFor='name'>Name:</label>
                <input type="text" name="name" value={patient.name} onChange={handleOnChange} className="border-1 m-1 rounded border-gray-100 bg-gray-50"/>
            </div>
            <div className="bg-gray-300 p-2 rounded  flex flex-col flex-wrap">
                <label htmlFor='age'>Age:</label>
                <input type="number" name="age" maxLength={3} value={patient.age} onChange={handleOnChange} className="border-1 m-1 rounded border-gray-100 bg-gray-50 w-20"/>
            </div>
            <div className="bg-gray-300 p-2 rounded  flex flex-col flex-wrap">
                Gender:
            <div>
            <label>
                <input type="radio" name="gender" value="M"  onChange={handleOnChange}/>
                Male
            </label>
            {` `}
            <label>
                <input type="radio" name="gender" value="F" onChange={handleOnChange}/>
                Female
            </label>
            {` `}
            <label>
                <input type="radio" name="gender" value="O" onChange={handleOnChange}/>
                Other
            </label>
            </div>
            </div>
            <div className="bg-gray-300 p-2 rounded  flex flex-col flex-wrap">
                <label htmlFor='date_of_birth'>Date of birth:</label>
                <input type="date" name="date_of_birth" value={patient.date_of_birth} onChange={handleOnChange} className="border-1 m-1 rounded border-gray-100 bg-gray-50"/>
            </div>
            <div className="bg-gray-300 p-2 rounded  flex justify-start items-start flex-col">
                <label htmlFor='address'>Address:</label>
                <textarea type="text" name="address" value={patient.address} onChange={handleOnChange} className="border-1 m-1 rounded border-gray-100 bg-gray-50 w-50"/>
            </div>
            <div className="bg-gray-300 p-2 rounded  flex flex-col">
                <label htmlFor='contact_number'>Contact #:</label>
                <input type="number" name="contact_number" value={patient.contact_number} onChange={handleOnChange}  className="border-1 m-1 rounded border-gray-100 bg-gray-50"/>
            </div>
            <div className="bg-gray-300 p-2 rounded  flex flex-col">
                <label htmlFor='email'>Email:</label>
                <input type="email" name="email" value={patient.email} onChange={handleOnChange} className="border-1 m-1 rounded border-gray-100 bg-gray-50"/>
            </div>
            <div className="bg-gray-300 p-2 rounded  flex flex-col">
                <label htmlFor='blood_group'>Blood Group:</label>
                <input type="text" name="blood_group" value={patient.blood_group} onChange={handleOnChange} className="border-1 m-1 rounded border-gray-100 bg-gray-50"/>
            </div>
            <div className="bg-gray-300 p-2 rounded flex justify-start items-start  flex-col">
                <label htmlFor='medical_history'>Medical History:</label>
                <textarea type="text" name="medical_history" value={patient.medical_history} onChange={handleOnChange} className="border-1 m-1 rounded border-gray-100 bg-gray-50 w-50"/>
            </div>
            {/* <div className="bg-gray-300 p-2 rounded  flex flex-col">
                <label htmlFor='patient_type'>Patient Type:</label>
                <div>
                    <label>
                    <input type="radio" name="patient_type" className="border-1 m-1 rounded border-gray-100 bg-gray-50" 
                    value="1" onChange={handleOnChange}/>
                    In-Patient
                    </label>
                    <label> {` `}
                    <input type="radio" name="patient_type" className="border-1 m-1 rounded border-gray-100 bg-gray-50"
                    value="0"   onChange={handleOnChange}/>
                    Out-Patient
                    </label>
                </div>
            </div> */}
            <div className="bg-gray-300 p-2 rounded  flex flex-col">
                <label htmlFor='reg_date'>Registration Date:</label>
                <input type="date" name="reg_date" value={patient.reg_date} onChange={handleOnChange} className="border-1 m-1 rounded border-gray-100 bg-gray-50"/>
            </div>
            <div className="bg-gray-300 p-2 rounded flex flex-col">
                <label htmlFor='reg_amount'>Registration Amount:</label>
                <input type="number" name="reg_amount"  maxLength={5}  value={patient.reg_amount} onChange={handleOnChange} className="border-1 m-1 rounded border-gray-100 bg-gray-50 w-30" readOnly/>
            </div>
            <div className=" p-2 rounded flex flex-col justify-center items-center">               
                <input type="submit" value="Register" 
                className="text-gray-50 cursor-pointer hover:bg-amber-400 
                hover:-translate-y-1 m-1 rounded border-blue-800 bg-blue-800 w-50" />
            </div>
         </div>
         </form>
      </div>
    </div>
  )
}

export default PatientRegistration
