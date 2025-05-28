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
  const {getPatientsByWard,vacatePatientWard,employee} = usePasStore();
  const {wardId} = useParams();
  const [wardName,setWardName] = useState("");
  const [totalBeds,setTotalBeds] = useState(0);
  const [remainingBeds,setRemainingBeds] = useState(0);
  const [vacateCount,setVacateCount] = useState(0);
  const [isModalOpen,setIsModalOpen] = useState(false);
  const [bedPatients,setBedPatients] = useState([]);
  const [bedNumbers,setBedNumbers] = useState([]);
  const [count,setCount] = useState(0);

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
        setSelectedPatient({})
    }
    fetchPatients();
    console.log(employee.doctor)
  },[wardId,vacateCount,count]);

  const getPatient = (index) =>{
    const found = bedPatients.find(item => item.hasOwnProperty(index));
    return found ? found[index] : null;
  }

  const handleSelectedPatient = (index)=>{
    setSelectedPatient(getPatient(index));
  }

  const showBeds = ()=>{
   return  Array.from({ length: totalBeds }, (_, i) => {
        if( bedNumbers.includes((i+1)+'') && getPatient(i+1)?.status !== 'VACATED' && employee.doctor && employee.doctor.id === getPatient(i+1)?.doctor_id){
            return <Bed  key={i} size={30} color={'yellow'} 
            onClick={()=>handleSelectedPatient(i+1)} title={getPatient(i+1)?.patient_name}/>
            
        }else if( bedNumbers.includes((i+1)+'') && getPatient(i+1)?.status !== 'VACATED'){
            return<Bed  key={i} size={30} color={'red'}/>
        }else{
            return <Bed  key={i} size={30}  color={'green'} onClick={()=> setSelectedPatient({})}/>
        }
    });
    // <span className="text-xs">{i+1}</span>
  }

  const showPatientDetails = () =>
    {
        if (selectedPatient.patient_name){
            return <div className="bg-gray-500 m-2 flex flex-col p-2 w-md justify-center">
                <p>Patient Name: {selectedPatient.patient_name}</p>
                <p>Bed No.: {selectedPatient.bed_number}</p>
                <p>Adm. Date: {formatDate(selectedPatient.admission_date)}</p>
                <p>Address: {selectedPatient.patient_address}</p>
                <p>Blood Group: {selectedPatient.patient_blood_group}</p>
                <p>Med. History: {selectedPatient.patient_medical_history}</p>
                <p>Conslt. Doctor: {selectedPatient.doctor_name}</p>
                <button className="w-50 pl-2 pr-2 bg-blue-800 rounded text-gray-100" onClick={()=> setIsModalOpen(true)}>Vacate</button>
            </div>
        }
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
    
    <div className="flex gap-1 flex-col justify-center w-full items-center  flex-auto mt-5 mb-10 bg-blue-900 text-gray-100">
      <h1 className="flex text-2xl font-bold mt-2">{wardName}</h1>
      <h1 className="flex ">Total Beds: {totalBeds}</h1>
      <h1 className="flex ">Remaining Beds: {remainingBeds}</h1>
      <div className="flex overflow-y-auto h-3/4 justify-center ">
        <div className="flex gap-2 justify-center w-full items-start">
          <div className="flex flex-col m-2 ">
            <div className="flex underline">Click on each your patient bed to get the details</div>
            <div className="flex  flex-col">
              <div className="flex gap-1 "><Bed   size={30}  color={'green'} /> Free bed</div>
              <div className="flex gap-1"><Bed   size={30}  color={'red'} /> Occupied by other patient </div>
              <div className="flex gap-1"><Bed   size={30}  color={'yellow'} /> Your patient</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 w-md justify-center m-2">
          {showBeds()}
          </div>
        </div>        
      </div>
      <div className="flex gap-3 flex-wrap justify-center w-md items-start ">
        {showPatientDetails()}
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
