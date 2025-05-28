import React, { useEffect, useState } from 'react'
import { usePasStore } from '../../store/pasStore'
import PatientRegistration from './forms/PatientRegistration';
import InPatients from './InPatients';
import OutPatients from './OutPatients';

const PatientsList = () => {
  const {getPatients,getDoctors} = usePasStore();
  const[patients,setPatients] = useState([]);
  const [regToggler,setRegToggler] = useState(0);

  useEffect(()=>{
    console.log("---inside patient list effect----")
    const fetchPatients = async()=>{
        const patients = await getPatients();
        await getDoctors();
        setPatients(patients);
    }
    fetchPatients();
  },[regToggler]);
  
  return (
    <div className="flex  min-w-7xl w-7xl  gap-2 justify-start  m-5 bg-blue-900 p-3">
      <PatientRegistration setRegToggler={setRegToggler}/>
      <div>
      {patients && patients.length > 0 ? <OutPatients patients={patients}/>: (
        <div className="flex flex-col border-1 border-gray-50 justify-center items-center mt-30  mb-10 w-full h-1/2 overflow-y-auto">
        <h1 className="flex flex-wrap text-2xl text-gray-800  font-semibold p-3">Out Patients Section empty </h1>
        </div>
      )}
      {/* {patients && patients.length > 0 ? <InPatients patients={patients}/>: (
        <div className="flex flex-col border-1 border-gray-50 justify-center items-center mt-30  mb-10w-full h-1/2 overflow-y-auto">
        <h1 className="flex flex-wrap text-2xl text-blue-800  font-semibold p-3">In Patients Section empty </h1>
        </div>
      )} */}
      
      </div>
      
    </div>
  )
}

export default PatientsList
