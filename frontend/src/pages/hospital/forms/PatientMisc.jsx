import React, { useEffect, useState } from 'react'
import { usePasStore } from '../../../store/pasStore'
import toast from 'react-hot-toast'
import { X } from 'lucide-react';
import { formatDate } from '../../../utils/date';

const PatientMisc = ({patient}) => {
  const {getMiscBillItemTypes, addMiscItems,getMiscItems, getMiscItemsHistory} =  usePasStore();
  const [miscs, setMiscs] = useState([]);
  const [addedMiscs, setAddedMiscs] = useState([]);
  const [count, setCount] = useState(0);
  const [miscTypes,setMiscTypes] = useState([]);
  const [itemDate,setItemDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMisc, setSelectedMisc] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [total, setTotal] = useState(0);
  
  useEffect(()=>{
    console.log(patient)
    const fetchItems = async ()=>{
      const miscs = await getMiscBillItemTypes();
      const pItems = await getMiscItems(patient.id,itemDate);
      setAddedMiscs(pItems);
      setMiscTypes(miscs);
    } 
     fetchItems();
    setMiscs([]);
  },[count,patient,itemDate]);

//   useEffect(()=>{
//     const sumTotal = tests.reduce((acc, test) => acc + Number(test.amount), 0);
//     setTotal(sumTotal)
//   },[tests]);

  useEffect(()=>{
    const sumTotal = addedMiscs.filter((misc)=>misc.status  !== 'PAID').reduce((acc, misc) => acc + Number(misc.amount), 0);
    setTotal(sumTotal)
  },[addedMiscs]);

  const handleAddItem = () =>{
    console.log(selectedMisc)
    if(!selectedMisc){
      toast.error("Please select an item");
      return;
    }
    const itemExists = miscs.some(misc => misc.bill_type_code === selectedMisc.code);
    if (itemExists) {
      toast.error("Item already added!");
      return;
    }
    setMiscs((prev)=>([...prev,{bill_type_code:selectedMisc.code,name:selectedMisc.name}]));
    setSelectedMisc({});
    setSelectedIndex(-1);
  }

  const handleRemoveItem = (index) =>{
    console.log(miscs)
    const its = [...miscs];
    its.splice(index, 1);
    setMiscs(its);
  }

  const handleItemSelect = (e)=>{       
    const index = e.target.value;
    const item = miscTypes[index];
    console.log(item)
    setSelectedMisc({...item});
    setSelectedIndex(index)
  }

  const handleAddMiscs = async() =>{
    console.log(miscs)
    try {
      const addedMiscs = await addMiscItems(patient.id,patient.patient_code,patient.ward_id,patient.doctor_id, miscs);
      setAddedMiscs(addedMiscs);
      setCount((prev)=> prev + 1);
      toast.success("Item addition successful!");
    } catch (error) {
      toast.error("Error while adding item: "+error.message);
    }
  }

  const handleMiscHistory = async() =>{
    try {
      const miscs = await getMiscItemsHistory(patient.id);
      setAddedMiscs(miscs);
    } catch (error) {
      toast.error("Error while getting miscs: "+error.message);
    }
  }

  const handleMiscs = async() =>{
    try {
      const miscs = await  getMiscItems(patient.id,itemDate);
      setAddedMiscs(miscs);
    } catch (error) {
      toast.error("Error while getting miscs: "+error.message);
    }
  }
  

  return (
    <div className="flex  w-6xl  bg-gray-400 ">
      <div className="flex flex-col ">
        <h1 className="flex m-2 font-semibold">Miscellaneous Entries</h1>
        <div className="flex gap-2 m-2">
          <input type="date" value={itemDate} onChange={(e)=>setItemDate(e.target.value)} className="bg-gray-500 p-2 rounded"/>
          <select onChange={handleItemSelect} className="bg-gray-500 p-2 rounded" value={selectedIndex}>
            <option value="-1">-Select-</option>                     
            {miscTypes && miscTypes.map((item,index)=>(
            <option key={item.code} value={index}>{item.name}</option>
            ))}          
          </select>
          <button className="flex bg-blue-800 text-gray-100 w-20 p-1 
          rounded cursor-pointer hover:bg-amber-500 justify-center" onClick={handleAddItem}>Add</button>
        </div>

        <div className="flex flex-col  m-2 border-1">
          <h1 className="flex m-2 font-semibold">Item Basket</h1>
          {miscs.length > 0 ?
          <div className="flex flex-col h-[300px] overflow-y-auto">
            <div className="flex bg-gray-600 w-full" >
                <div className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center">Code</div>
                <div className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center">Name</div>
                <div className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center"></div>
              </div>
          {
            miscs && miscs.map((item,index)=>(
              <div className="flex  bg-gray-400 w-full" key={item.bill_type_code}>
                <div className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center">{item.bill_type_code}</div>
                <div className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-start" title={item.name}>{item.name}</div>
                <X className="border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center" color={'yellow'} size={20} onClick={(e)=>handleRemoveItem(index)}/>
              </div>
            ))
          }
          <div className="flex bg-gray-600 w-full  bottom-0 sticky" >
            <div className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center"></div>
            <div className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center"></div>
            <div className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center">
              <button className="flex bg-blue-800 text-gray-100 w-20 m-1 
          rounded cursor-pointer hover:bg-amber-500 justify-center" onClick={handleAddMiscs}>Add Entries</button>
            </div>
          </div>
          
          </div>:null}        
        </div>        
      </div>
      <div className="flex flex-col w-xl ">        
        <div className="flex w-xl justify-between">
            <div className="flex cursor-pointer hover:text-blue-800" onClick={handleMiscs}>Added Items</div> 
            <div className="flex cursor-pointer hover:text-blue-800" onClick={handleMiscHistory}>Show History</div>
        </div>
        <div className="flex flex-col border-1 w-full  h-[300px]  overflow-y-auto ">
          <div className="flex bg-gray-600 w-full" >
            <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center">Name</div>
            <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center">Date</div>
            <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center">Amount</div>
            <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center">Status</div>
          </div>
          {
            addedMiscs && addedMiscs.map((item,index)=>(
              <div className="flex  bg-gray-400 w-full" key={item.id}>
                <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-start" title={item.item_name}>{item.item_name}</div>
                <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-start" title={formatDate(item.item_date)}>{formatDate(item.item_date)}</div>
                <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center">{item.amount}</div>
                <div className={`border-r  w-full  whitespace-nowrap truncate 
                pl-1 pr-1 flex justify-center ${item.status === 'PAID' ? `text-green-700`:`text-yellow-500`}`}>{item.status}</div>
               
              </div>
            ))
          }
          <div className="flex bg-gray-600 w-full" >
            <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center"></div>
            <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center">Total</div>
            <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center">{total}</div>
            <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center"></div>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default PatientMisc
