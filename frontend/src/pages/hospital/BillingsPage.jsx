import React, { useEffect, useState } from 'react';
import {Search} from 'lucide-react';
import { usePasStore } from '../../store/pasStore';
import { formatDate } from '../../utils/date';

const BillingsPage = () => {
  const [patients, setPatients] = useState([]);
  const [billItems, setBillItems] = useState([]);
  const [searchPatients, setSearchPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const {getPatients,getItemsByBill} = usePasStore(); 
  const [bill,setBill] = useState(null);
  const [showItems,setShowItems] = useState(false);
  const [showAll,setShowAll] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(()=>{
      const fetchPatients = async()=>{
          const patients = await getPatients();
          setPatients(patients);
          setSearchPatients(patients);
      }
      fetchPatients();
    },[]);

     useEffect(()=>{
      const fetchBills = async()=>{
        if(selectedPatient){
          const billItems = await getItemsByBill(selectedPatient.id);
          console.log(billItems)
          setBillItems(billItems);
        }          
      }
      fetchBills();
    },[selectedPatient,showItems]);

  const handleSelectedPatient = (e,index, patient) =>{    
    setSelectedPatient(patient)   ;
    setShowItems(false);
    setShowAll(false);
  }

  const handleSearch = (e) =>{
    const patients = patients && patients.filter((p)=>(p.name.toLowerCase().includes(e.target.value.toLowerCase())
     || p.patient_code.toLowerCase().includes(e.target.value.toLowerCase())) );
    setSearchPatients(patients);
  }

  const handleItemsShow = (b)=>{
    setShowItems(true);
    setShowAll(false)
    setBill(b);
  }

  const displayBill =()=>{
    let items = [];
    if(bill){
      if(bill.item_type === "REG"){
        items.push({item_name:"Registration",amount:bill.total_amount,date:bill.created_at,status:"PAID",item_id:bill.patient_id});
      }else if(bill.item_type === "CNS"){
        items = bill.consumables.map((item) => ({item_id:item.item_id,item_name:item.item_name,status:item.status,amount:item.price,quantity:item.quantity,date:item.buy_date}));
      }else if(bill.item_type === "MISC"){
        items = bill.misc.map((item) => ({item_id:item.id,item_name:item.name,status:item.status,amount:item.amount,quantity:"-",date:item.item_date}));
      }else if(bill.item_type === "TST"){
        items = bill.tests.map((test) => ({item_id:test.test_id,item_name:test.test_name,status:test.status,amount:test.amount,quantity:"-",date:test.test_date}));
      }else if(bill.item_type === "OP"){
        items = bill.op.map((op) => ({item_id:op.id,item_name:"Consultation",status:"PAID",amount:op.amount,quantity:"-",date:op.visit_date_time}));
      }else if(bill.item_type === "FD"){
        items = [...bill.food_order];
      }
      return (
        <div className="flex flex-col w-3xl border-1 ">
          <div className="flex w-full border-1 justify-center p-1 bg-gray-700">
            <div className=" flex w-full justify-start">Date</div>
            {/* <div className=" flex w-full justify-start">Id</div> */}
            <div className=" flex w-full justify-start">Name</div>
            <div className=" flex w-full justify-start">Amount</div>
            <div className=" flex w-full justify-start">Paid Status</div>
          </div>
          {items && items.map((item)=>(
          <div className={`flex w-full border-1 justify-center p-1 bg-gray-500 `}>
            <div className=" flex w-full justify-start flex-no">{formatDate(item.date)}</div>
            {/* <div className=" flex w-full justify-start">{item.item_id}</div> */}
            <div className=" flex w-full justify-start">{item.item_name}</div>
            <div className=" flex w-full justify-start">{item.amount}</div>
            <div className={` flex w-full justify-center ${item.status === 'PAID' ?`bg-green-800`:`bg-red-800`}`}>{item.status}</div>
          </div>
          ))
          }
        </div>
      )
    }
  }

  const displayFullBill =()=>{
    let items = [];
    let total=0;
     if(billItems){
      billItems.forEach((bill)=>{
        if(bill.item_type === "REG"){
        items.push({bill_no:bill.id,item_name:"Registration",amount:bill.total_amount,date:bill.created_at,status:"PAID",item_id:bill.patient_id});
        }else if(bill.item_type === "CNS"){
          const its = bill.consumables.map((item) => ({bill_no:bill.id,item_id:item.item_id,item_name:item.item_name,
            status:item.status,amount:item.price,quantity:item.quantity,date:item.buy_date}));
          items.push(...its)
        }else if(bill.item_type === "MISC"){
           const its = bill.misc.map((item) => ({bill_no:bill.id,item_id:item.id,item_name:item.name,status:item.status,
            amount:item.amount,quantity:"-",date:item.item_date}));
          items.push(...its)
        }else if(bill.item_type === "TST"){
           const its = bill.tests.map((test) => ({bill_no:bill.id,item_id:test.test_id,item_name:test.test_name,status:test.status,
            amount:test.amount,quantity:"-",date:test.test_date}));
          items.push(...its)
        }else if(bill.item_type === "OP"){
           const its = bill.op.map((op) => ({bill_no:bill.id,item_id:op.id,item_name:"Consultation",status:"PAID",amount:op.amount,
            quantity:"-",date:op.visit_date_time}));
          items.push(...its)
        }else if(bill.item_type === "FD"){
           const its = [...bill.food_order];
          items.push(...its)
        }
      })
      const sumTotal = items.filter((item)=> item.status !== 'PAID').reduce((acc, test) => acc + Number(test.amount), 0);
      
      return (
        <div className="flex flex-col w-3xl border-1 ">
          <div className="flex justify-end bg-gray-500 text-yellow-100 pr-2 ">Total Outstanding: {sumTotal}</div>
          <div className="h-[400px] overflow-y-auto">
          <div className="flex w-full border-1 justify-center p-1 bg-gray-700 sticky top-0">
            <div className="w-50 ">Bill#</div>
            <div className=" flex w-full justify-start">Date</div>
            {/* <div className=" flex w-full justify-start">Id</div> */}
            <div className=" flex w-full justify-start">Name</div>
            <div className=" flex w-full justify-start">Amount</div>
            <div className=" flex w-full justify-start">Paid Status</div>
          </div>
          {items && items.map((item)=>(
          <div className={`flex w-full border-1 justify-center p-1 bg-gray-500 `}>
            <div className="w-50 ">{item.bill_no}</div>
            <div className=" flex w-full justify-start flex-no">{formatDate(item.date)}</div>
            {/* <div className=" flex w-full justify-start">{item.item_id}</div> */}
            <div className=" flex w-full justify-start">{item.item_name}</div>
            <div className=" flex w-full justify-start">{item.amount}</div>
            <div className={` flex w-full justify-center ${item.status === 'PAID' ?`bg-green-800`:`bg-red-800`}`}>{item.status}</div>
          </div>
          ))
          }
          </div>
        </div>
      )
    }
  }

  const handleReset = () =>{
    setSelectedPatient(null);
    setShowAll(false);
    setShowItems(false)
  }

  return (
<div className="flex flex-col text-gray-100  min-w-7xl lg:w-5xl min-h-screen justify_center p-3 m-10 gap-2 bg-blue-900">
    <h1 className="text-2xl text-center fond-bold underline">Billings</h1>
    <div className="flex flex-col gap-3">
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
                      onClick={handleReset}>Reset</button></div>      
              </div>                   
          </div>    
          <div className="flex flex-col ">            
              {selectedPatient ? (                <>
              <h1 className="text-center underline">Patient Details</h1>
              <div  className="flex flex-col w-md pl-1  ">
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
      {billItems && billItems.length > 0 ? 
        <div className="flex w-full justify-center gap-2">
        <button className="w-50 bg-amber-500 hover:bg-amber-400 cursor-pointer" onClick={()=>{setShowAll(true);setShowItems(false)}}>Show Itemized Bills</button>
        <button className="w-50 bg-amber-500 hover:bg-amber-400 cursor-pointer" onClick={()=>{setShowAll(true);setShowItems(false)}}>Pay Outstanding</button>
      </div> : null}
      {billItems && billItems.length > 0? 
      <div className="flex gap-2 w-full flex-wrap justify-start">  
          <div className="flex flex-col w-md border-1   ">
            <div className="flex w-md border-1 justify-center p-1 bg-gray-700">
              <div className=" flex w-full justify-start">Bill#</div>
              <div className=" flex w-full justify-start">Item Type</div>
              <div className=" flex w-full justify-start">Total Amount</div>
            </div>  
            {
              billItems && billItems.map((b)=>(
                <div className="flex w-md border-1  justify-between  p-1  bg-gray-500 cursor-pointer" onClick={()=>handleItemsShow(b)}>
                  <div className=" flex w-full justify-start">{b.id}</div>
                  <div className=" flex w-full justify-start">{b.item_type =="MISC" ? 
                  "Miscellaneous" : b.item_type =="CNS" ? 
                  "Consumables" : b.item_type =="REG" ? 
                  "Registration" :b.item_type =="TST" ?
                  "Tests":b.item_type}
                  </div>
                  <div className=" flex w-full justify-start">{b.total_amount}</div>
                </div> 
              ))
            }
          </div>   
          
          {showItems ? displayBill(): null }  
          {showAll ? displayFullBill(): null }             
      </div>     :null}   
    </div>
</div>
  )
}

export default BillingsPage
