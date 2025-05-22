import React from 'react'
import { usePasStore } from '../../store/pasStore'
import { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router';

const Ward = () => {
  const [patients,setPatients] = useState([]);
  const [selectedPatient,setSelectedPatient] = useState({});
  const {getPatientsByWard} = usePasStore();
  const {wardId} = useParams();
  const [totalBeds,setTotalBeds] = useState(0);
  const [remainingBeds,setRemainingBeds] = useState(0);
  useEffect(()=>{
    const fetchPatients = async ()=>{
        const data = await getPatientsByWard(wardId);
        console.log(data)
        setPatients(data);
        setTotalBeds(data[0].total_beds);
        setRemainingBeds(data[0].beds_left);
    }
    fetchPatients();
  },[wardId]);

  const showBeds = ()=>{
   return  Array.from({ length: totalBeds }, (_, i) => {
        if(patients[i] && patients[i].patient_name){
            return <div key={i} className={`h-10 w-50 bg-amber-500 rounded text-center text-gray-300 cursor-pointer 
            font-bold ${selectedPatient.patient_name === patients[i].patient_name ? 'border-1 border-green-900':''}` } 
            onClick={()=> setSelectedPatient(patients[i])}>{i+1}-{patients[i].patient_name}</div>
        }else{
            return <div  key={i} className="h-10 w-50 bg-emerald-500 rounded text-center text-gray-300  cursor-pointer" 
            onClick={()=> setSelectedPatient({})}>{i+1}-Available</div>
        }
    });
  }

  const showPatientDetails = () =>
    {
        if (selectedPatient.patient_name){
            return <div>
                <p>Patient Name: {selectedPatient.patient_name}</p>
                <p>Address: {selectedPatient.patient_address}</p>
                <p>Blood Group: {selectedPatient.patient_blood_group}</p>
                <p>Med. History: {selectedPatient.patient_medical_history}</p>
                <p>Conslt. Doctor: {selectedPatient.doctor_name}</p>
            </div>
        }else {return null};
    }
  

  return (
    <div className="flex gap-3 flex-col justify-start w-full items-center h-150 overflow-y-auto">
      <h1>Total Beds: {totalBeds}</h1>
      <h1>Remaining Beds: {remainingBeds}</h1>
      <div className="flex">
        <div className="flex gap-3 flex-wrap justify-center w-md items-center">
        {showBeds()}
        </div>
        <div className="flex gap-3 flex-wrap justify-center w-md items-start">
        {showPatientDetails()}
        </div>
      </div>
    </div>
  )
}

export default Ward
