import React, { useEffect, useState } from 'react'
import { usePasStore } from '../../store/pasStore';
import ModalComponent from '../../components/ModalComponent';
import InPatientWard from './forms/InPatientWard';
import { formatDate } from '../../utils/date';
import toast from 'react-hot-toast';

const InPatients = ({patients}) => {
const[inPatients,setInPatients] = useState([]);
const[isModalCompOpen,setIsModalCompOpen] = useState(false);
const [selectedPatient, setSelectedPatient] = useState(null);
const [checkedItems, setCheckedItems] = useState([]);
//const {patients} = usePasStore(); 
useEffect(()=>{
    console.log("---inside InPatients effect----")
    const inPatients =  patients.filter((p)=> p.ip === 'Y');
    console.log(inPatients)
    setInPatients(inPatients);
    setCheckedItems(inPatients.map(() => false));
},[patients]);

const handleSelectPatient = (e,index)=>{
      const updatedCheckedItems = [...checkedItems]
      updatedCheckedItems[index] = !updatedCheckedItems[index];
      setCheckedItems(updatedCheckedItems);
      if(selectedPatient && e.target.checked){
        toast.error("You can allocate only one patient at a time.")
        updatedCheckedItems[index] = false;
        setCheckedItems(updatedCheckedItems);
      }else if(e.target.checked){
        setSelectedPatient(inPatients[index])    
      }else{
        setSelectedPatient(null)  
      }    
       
  }
  return (
    <div  id="in_pat" className="flex flex-col  justify-center items-center   w-full h-1/2 overflow-y-auto">
        <h1 className="flex flex-wrap text-2xl text-blue-800 underline font-semibold">INPATIENTS </h1>
            <div className="  flex gap-2 w-full justify-center items-center text-gray-50 bg-gray-700">
                <div className="flex border-r  w-full  whitespace-nowrap truncate">Select</div>
                <div className="flex border-r  w-full  whitespace-nowrap truncate">Code</div>
                <div className="flex border-r  w-full  whitespace-nowrap truncate">Name</div>
                <div className="flex  border-r  w-full  whitespace-nowrap truncate">Age</div>
                <div className="flex  border-r  w-full  whitespace-nowrap truncate">Ward Number</div>
                <div className="flex   border-r  w-full whitespace-nowrap">Ward Name</div>
                <div className="flex  border-r  w-full  whitespace-nowrap truncate">Bed Number</div>
            </div>
        {inPatients && inPatients.map((patient,index)=>(
            <div key={index} className="odd:bg-gray-300 even:bg-gray-400  flex gap-2 w-full justify-center items-stretch border line-clamp-1">
                <div  className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center" >
                  <input type="checkbox" className=" h-lh" onChange={(e)=>handleSelectPatient(e,index)} value={patient} checked={checkedItems[index]}/></div>
                <div  className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center" ><input className="flex   w-full  whitespace-nowrap truncate" value={patient.patient_code} title={patient.patient_code} readOnly/></div>
                <div  className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center" ><input className="flex   w-full  whitespace-nowrap truncate" value={patient.name} title={patient.name} readOnly/></div>
                <div  className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center" ><input className="flex   w-full  whitespace-nowrap truncate" value={patient.age} title={patient.age} readOnly/></div>
                <div  className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center" ><input className="flex   w-full  whitespace-nowrap truncate" value={patient.ward_id}  title={patient.ward_id}readOnly/></div>
                <div  className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center" ><input className="flex   w-full  whitespace-nowrap truncate" value={patient.ward_name}  title={patient.ward_name}readOnly/></div>
                <div  className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center" ><textarea className="flex  w-full  whitespace-nowrap truncate" value={patient.bed_number}  title={patient.bed_number}readOnly/></div>
             </div>
        ))}
        {/* <div className="flex w-full bg-gray-700 bottom-0 sticky justify-center">
          <button className={`rounded ${selectedPatient?`bg-blue-700 hover:bg-amber-400`:`bg-gray-400`} p-2 m-1 text-amber-50 cursor-pointer `} onClick={()=>setIsModalCompOpen(true)} disabled={selectedPatient?false:true}>Allocate ward</button>
        </div> */}
        {selectedPatient ? <ModalComponent
            isOpen={isModalCompOpen}
            onCancel={()=> setIsModalCompOpen(false)}
            title="Allocate ward"
           
        >
            <InPatientWard  patient={selectedPatient} setIsModalCompOpen={setIsModalCompOpen}/> 
      </ModalComponent>: null}
      </div>
  )
}

export default InPatients
