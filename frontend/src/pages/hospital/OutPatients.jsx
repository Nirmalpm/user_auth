import React, { useEffect, useState } from 'react'
import { usePasStore } from '../../store/pasStore';
import ModalComponent from '../../components/ModalComponent';
import InPatientWard from './forms/InPatientWard';
import { formatDate } from '../../utils/date';
import toast from 'react-hot-toast';
import OutPatientConsult from './forms/OutPatientConsult';

const OutPatients = ({patients}) => {
const[outPatients,setoutPatients] = useState([]);
const[isConsultModalCompOpen,setIsConsultModalCompOpen] = useState(false);
const[isAdmitModalCompOpen,setIsAdmitModalCompOpen] = useState(false);
const [selectedPatient, setSelectedPatient] = useState(null);
const [checkedItems, setCheckedItems] = useState([]);
const [inPatientIds,setInpatientIds] = useState([])
//const {patients} = usePasStore(); 
useEffect(()=>{
    console.log("---inside OutPatients effect----")
    const inPatientIds =  patients.filter((p)=> p.ip === 'Y').map((p)=> p.id);//filtering out In-Patients
    setInpatientIds(inPatientIds);
    console.log(patients);
    console.log(inPatientIds)
    setoutPatients(patients);
    setCheckedItems(patients.map(() => false));
},[patients]);

const handleSelectPatient = (e,index,patient)=>{
      const updatedCheckedItems = [...checkedItems]
      updatedCheckedItems[index] = !updatedCheckedItems[index];
      setCheckedItems(updatedCheckedItems);
      console.log(patient.id)
      if(selectedPatient && e.target.checked){
        toast.error("You can allocate only one patient at a time.")
        updatedCheckedItems[index] = false;
        setCheckedItems(updatedCheckedItems);
      }else if(e.target.checked){
        setSelectedPatient(patient)    
      }else{
        setSelectedPatient(null)  
      }           
  }

  const handleAdmit = () =>{
    if(selectedPatient && inPatientIds.includes(selectedPatient.id)){
      toast.error("Already allocated ward for the patient");
      setSelectedPatient(null);
      setCheckedItems(patients.map(() => false));
    }else{
      setIsAdmitModalCompOpen(true)
    }
  }

  const resetSelection = () =>{
    setCheckedItems(patients.map(() => false));
    setSelectedPatient(null)  
  }
  return (
    <div  id="out_pat" className="flex flex-col  justify-start items-start  mb-10 w-full gap-2 ">
      
        <h1 className="flex  text-2xl text-gray-100  font-semibold  sticky top-0 justify-start ">Registered Patients </h1>
        <div className=" overflow-y-auto h-100">
        <div className=" pl-2 flex gap-2 w-full justify-center items-center text-gray-50 bg-gray-700 sticky top-0 ">
            <div className="flex border-r  w-full  whitespace-nowrap truncate">Select</div>
            <div className="flex border-r  w-full  whitespace-nowrap truncate">Code</div>
            <div className="flex border-r  w-full  whitespace-nowrap truncate">Name</div>
            <div className="flex  border-r  w-full  whitespace-nowrap truncate">Age</div>
            <div className="flex  border-r  w-full  whitespace-nowrap truncate">Gender</div>
            <div className="flex   border-r  w-full whitespace-nowrap">Reg. Date</div>
            <div className="flex  border-r  w-full  whitespace-nowrap truncate">Blood Group</div>
            <div className="flex  border-r  w-full whitespace-nowrap truncate">Address</div>
            <div className="flex  border-r  w-full  whitespace-nowrap truncate">Contact</div>
            <div className="flex  border-r  w-full  whitespace-nowrap truncate">Med. History</div>
          </div>
        {outPatients && outPatients.map((patient,index)=>(
            <div key={index} className=" pl-2 odd:bg-gray-300 even:bg-gray-400  flex gap-2 w-full justify-center items-stretch border line-clamp-1 ">
                <div  className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center" >
                  <input type="checkbox" className=" h-lh" onChange={(e)=>handleSelectPatient(e,index,patient)} value={patient} checked={checkedItems[index]}/></div>
                <div  className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center" ><input className="flex   w-full  whitespace-nowrap truncate" value={patient.patient_code} title={patient.patient_code} readOnly/></div>
                <div  className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center" ><input className="flex   w-full  whitespace-nowrap truncate" value={patient.name} title={patient.name} readOnly/></div>
                <div  className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center" ><input className="flex   w-full  whitespace-nowrap truncate" value={patient.age} title={patient.age} readOnly/></div>
                <div  className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center" ><input className="flex   w-full  whitespace-nowrap truncate" value={patient.gender}  title={patient.gender}readOnly/></div>
                <div  className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center" ><input className="flex   w-full whitespace-nowrap" value={formatDate(patient.reg_date)}  title={formatDate(patient.reg_date)} readOnly/></div>
                <div  className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center" ><input className="flex   w-full  whitespace-nowrap truncate" value={patient.blood_group}  title={patient.blood_group}readOnly/></div>
                <div  className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center" ><input className="flex   w-full whitespace-nowrap truncate" value={patient.address}  title={patient.address}readOnly/></div>
                <div  className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center" ><input className="flex   w-full  whitespace-nowrap truncate" value={patient.contact_number}  title={patient.contact_number}readOnly/></div>
                <div  className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center" ><textarea className="flex  w-full  whitespace-nowrap truncate" value={patient.medical_history}  title={patient.medical_history}readOnly/></div>
            </div>
        ))}
        <div className="flex w-full bg-gray-700 bottom-0 sticky justify-center">
          <button className={`rounded ${selectedPatient?`bg-blue-700 hover:bg-amber-400`:`bg-gray-400`} p-2 m-1 text-amber-50 cursor-pointer `} onClick={()=>setIsConsultModalCompOpen(true)} disabled={selectedPatient?false:true}>Consultation</button>
          <button className={`rounded ${selectedPatient?`bg-blue-700 hover:bg-amber-400`:`bg-gray-400`} p-2 m-1 text-amber-50 cursor-pointer `} onClick={handleAdmit} disabled={selectedPatient?false:true}>Admit</button>
        </div>
        {selectedPatient ? <ModalComponent
            isOpen={isConsultModalCompOpen}
            onCancel={()=> setIsConsultModalCompOpen(false)}
            title="Consultation"
           
        >
            <OutPatientConsult   patient={selectedPatient} setIsModalCompOpen={setIsConsultModalCompOpen} resetSelection={resetSelection}/> 
      </ModalComponent>: null}
      {selectedPatient ? <ModalComponent
            isOpen={isAdmitModalCompOpen}
            onCancel={()=> setIsAdmitModalCompOpen(false)}
            title="Allocate ward"
           
        >
            <InPatientWard  patient={selectedPatient} setIsModalCompOpen={setIsAdmitModalCompOpen} resetSelection={resetSelection}/> 
      </ModalComponent>: null}
      </div>
    </div>
  )
}

export default OutPatients
