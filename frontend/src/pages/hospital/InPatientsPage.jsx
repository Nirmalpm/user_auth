import React, { useEffect, useState } from 'react';
import {Search} from 'lucide-react';
import { usePasStore } from '../../store/pasStore';
import { formatDate } from '../../utils/date';
import PatientPharmacyItems from './forms/PatientPharmacyItems';
import AccordionContainer from '../../components/AccordionContainer';
import PatientTests from './forms/PatientTests';
import PatientMisc from './forms/PatientMisc';

const InPatientsPage = () => {
  const [inPatients, setInPatients] = useState([]);
  const [searchPatients, setSearchPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [checkIndex, setCheckIndex]= useState([]);
  const {patients,getPatients} = usePasStore(); 

  useEffect(()=>{
      const fetchPatients = async()=>{
          const patients = await getPatients();
          const inPatients = patients.filter((p)=>p.ip === 'Y');
          setInPatients(inPatients);
          setSearchPatients(inPatients);
          setCheckIndex(inPatients.map((p)=>(false)))
      }
      fetchPatients();
    },[]);

  const handleSelectedPatient = (e,index, patient) =>{    
    setSelectedPatient(patient)   ;
  }

  const handleSearch = (e) =>{
    const patients = inPatients && inPatients.filter((p)=>(p.name.toLowerCase().includes(e.target.value.toLowerCase())
     || p.patient_code.toLowerCase().includes(e.target.value.toLowerCase())) );
    setSearchPatients(patients);
  }

  return (
<div className="flex flex-col text-gray-100  min-w-7xl lg:w-5xl min-h-screen justify_center p-3 m-10 gap-2 bg-blue-900">
    <h1 className="text-2xl text-center fond-bold underline">Inpatients</h1>
    <div className="flex gap-2 w-full flex-wrap justify-start">
        <div className="flex flex-col">
            <div className="flex  justify-start items-center border-1 rounded">        
                <input placeholder="Search Patients" className="w-md p-2 bg-gray-300 text-gray-800"  onChange={handleSearch}/>
                <Search size={24} className="p-1"/>
            </div>
            <div className="flex flex-col justify-start items-start border-1 rounded h-[200px] overflow-y-auto">  
                <div className="flex w-full pl-2 justify-start bg-gray-700" >
                    <div className="flex w-full">Name</div>
                    <div className="flex w-full">Code</div>
                </div>      
                {searchPatients && searchPatients.map((p,index)=>(
                <div key={p.id} className="flex w-full pl-2 justify-start cursor-pointer 
                 odd:bg-gray-400 even:bg-gray-500" onClick={(e)=> handleSelectedPatient(e,index,p)}>
                    <div className="flex w-full  cursor-pointer"><input className="flex w-full  cursor-pointer" type="text" value={p.name} readOnly/></div>
                    <div className="flex w-full  cursor-pointer"><input className="flex w-full  cursor-pointer" type="text" value={p.patient_code} readOnly/></div>
                </div>
                ))}       
                <div className="flex bg-gray-700 w-full h-10 bottom-0 sticky justify-center p-2">
                    <button className="flex w-1/4 bg-blue-800 rounded justify-center cursor-pointer hover:bg-amber-500"
                     onClick={()=>setSelectedPatient(null)}>Reset</button></div>      
            </div>   
                
        </div>
        <div className="flex flex-col ">            
            {selectedPatient ? (                <>
            <h1 className="text-center underline">Patient Details</h1>
            <div  className="flex flex-col w-md pl-2  ">
                <div className="flex w-full justify-between"><span className="flex">Name:</span><input type="text" value={selectedPatient.name} readOnly  className="flex"/></div>
                <div className="flex w-full justify-between"><span className="flex">Patient Code:</span><input type="text" value={selectedPatient.patient_code} readOnly  className="flex"/></div>
                <div className="flex w-full justify-between"><span className="flex">Doctor:</span><input type="text" value={selectedPatient.doctor_name} readOnly/></div>
                <div className="flex w-full justify-between"><span className="flex">Ward:</span><input type="text" value={selectedPatient.ward_name} readOnly/></div>
                <div className="flex w-full justify-between"><span className="flex">Bed No.:</span><input type="text" value={selectedPatient.bed_number} readOnly/></div>
                <div className="flex w-full justify-between"><span className="flex">Admission Date:</span><input type="text" value={formatDate(selectedPatient.admission_date)} readOnly/></div>
                <div className="flex w-full justify-between"><span className="flex">Contact Number:</span><input type="text" value={selectedPatient.contact_number} readOnly/></div>
                <div className="flex w-full justify-between"><span className="flex">Medical History:</span><input type="text" value={selectedPatient.medical_history} readOnly/></div>
            </div>
            </>
            ):null
            }
            </div>      
    </div>
    {selectedPatient ?<AccordionContainer title="Medicines and other purchases"> <PatientPharmacyItems patient={selectedPatient}/> </AccordionContainer>: null}
    {selectedPatient ?<AccordionContainer title="Tests Done">  <PatientTests patient={selectedPatient}/> </AccordionContainer>: null}
    {selectedPatient ?<AccordionContainer title="Miscellaneous Items">  <PatientMisc patient={selectedPatient}/> </AccordionContainer>: null}
    
</div>
  )
}

export default InPatientsPage
