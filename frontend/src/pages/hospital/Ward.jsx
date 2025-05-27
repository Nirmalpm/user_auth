import React from 'react'
import { usePasStore } from '../../store/pasStore'
import { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import {formatDate} from '../../utils/date.js'
import toast from "react-hot-toast";
import ConfirmModal from '../../components/ConfirmModal.jsx';
import {Bed, BedDouble} from 'lucide-react'

const Ward = () => {
  const [patients,setPatients] = useState([]);
  const [selectedPatient,setSelectedPatient] = useState({});
  const {getPatientsByWard,vacatePatientWard,getVacantBeds} = usePasStore();
  const {wardId} = useParams();
  const [wardName,setWardName] = useState("");
  const [totalBeds,setTotalBeds] = useState(0);
  const [remainingBeds,setRemainingBeds] = useState(0);
  const [vacateCount,setVacateCount] = useState(0);
  const [isModalOpen,setIsModalOpen] = useState(false);
  const [bedPatients,setBedPatients] = useState([]);
  const [bedNumbers,setBedNumbers] = useState([]);

  useEffect(()=>{
    const fetchPatients = async ()=>{
        const data = await getPatientsByWard(wardId);
        console.log(data)
        setWardName(data[0].ward_name)
        setPatients(data);
        setTotalBeds(data[0].total_beds);
        setRemainingBeds(data[0].beds_left);
        const bedPatients = data.map((d)=>({bed_no:d.bed_number,[d.bed_number]:d}));
        setBedPatients(bedPatients);
        const bedNumbers = bedPatients.map((b)=>(b.bed_no));
        console.log(bedNumbers,bedPatients)
        setBedNumbers(bedNumbers);
    }
    fetchPatients();
  },[wardId,vacateCount]);

  const getPatient = (index) =>{
    const found = bedPatients.find(item => item.hasOwnProperty(index));
    return found ? found[index] : null;
  }

  const showBeds = ()=>{
   return  Array.from({ length: totalBeds }, (_, i) => {
        if( bedNumbers.includes((i+1)+'') && getPatient(i+1)?.status !== 'VACATED'){
            return <span className="flex flex-col text-center"><Bed  key={i} size={50} color={'red'} onClick={()=> setSelectedPatient(getPatient(i+1))} title={getPatient(i+1)?.patient_name}/>{i+1}</span>
        }else{
            return <Bed  key={i} size={50}  color={'green'} onClick={()=> setSelectedPatient({})}/>
        }
    });
  }

  const showPatientDetails = () =>
    {
        if (selectedPatient.patient_name){
            return <div>
                <p>Patient Name: {selectedPatient.patient_name}</p>
                <p>Adm. Date: {formatDate(selectedPatient.admission_date)}</p>
                <p>Address: {selectedPatient.patient_address}</p>
                <p>Blood Group: {selectedPatient.patient_blood_group}</p>
                <p>Med. History: {selectedPatient.patient_medical_history}</p>
                <p>Conslt. Doctor: {selectedPatient.doctor_name}</p>
                <button className="pl-2 pr-2 bg-blue-800 rounded text-gray-100" onClick={()=> setIsModalOpen(true)}>Vacate</button>
            </div>
        }else {return <div className="flex text-2xl text-gray-100">Click on each occupied Bed to get the patient details</div>};
    }
  
    const handleVacate = async() =>{
      try {
        console.log(selectedPatient)
        await vacatePatientWard(selectedPatient.patient_ward_id, selectedPatient.patient_id);
        setSelectedPatient({});
        setVacateCount((prev)=> prev+1);
        setIsModalOpen(false);
        toast.success("Patient successfully vacated the bed")
      } catch (error) {
        toast.error("Error happened while vacating: "+error.message)
      }
    }

    

  return (
    
    <div className="flex gap-3 flex-col justify-start w-full items-center  flex-auto mt-5 mb-10 ">
     
      <h1 className="flex flex-wrap text-3xl text-blue-700 font-semibold">{wardName}</h1>
      <h1 className="flex flex-wrap text-2xl text-blue-700">Total Beds: {totalBeds}</h1>
      <h1 className="flex flex-wrap text-xl text-blue-700">Remaining Beds: {remainingBeds}</h1>
      <div className="flex flex-wrap overflow-y-auto h-3/4 ">
        <div className="flex gap-3 flex-wrap justify-start w-md items-start">
        {showBeds()}
        </div>
        <div className="flex gap-3 flex-wrap justify-center w-md items-start ">
        {showPatientDetails()}
        </div>
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        title="Confirm Vacate"
        message="Are you sure you want to vacate this patient?"
        onConfirm={handleVacate}
        onCancel={()=> setIsModalOpen(false)}
      />
    </div>
  )
}

export default Ward
