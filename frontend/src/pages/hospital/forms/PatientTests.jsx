import React, { useEffect, useState } from 'react'
import { usePasStore } from '../../../store/pasStore'
import toast from 'react-hot-toast'
import { X } from 'lucide-react';
import { formatDate } from '../../../utils/date';

const PatientTests = ({patient}) => {
  const {addPatientTest, getPatientTests,getPatientTestHistory, getTests, setTestPaidStatus,setFullTestPaidStatus} =  usePasStore();
  const [tests, setTests] = useState([]);
  const [doneTests, setDoneTests] = useState([]);
  const [count, setCount] = useState(0);
  const [testItems,setTestItems] = useState([]);
  const [testDate,setTestDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTest, setSelectedTest] = useState({});
  const [total, setTotal] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [testTotal, setTestTotal] = useState(0);
  
  useEffect(()=>{
    console.log(patient)
    const fetchItems = async ()=>{
      const tests = await getTests();
      const pItems = await getPatientTests(patient.id,testDate);
      setDoneTests(pItems);
      setTestItems(tests);
    } 
     fetchItems();
    setTests([]);
  },[count,patient,testDate]);

  useEffect(()=>{
    const sumTotal = tests.reduce((acc, test) => acc + Number(test.amount), 0);
    setTotal(sumTotal)
  },[tests]);

  useEffect(()=>{
    const sumTotal = doneTests.filter((test)=>test.status  !== 'PAID').reduce((acc, test) => acc + Number(test.amount), 0);
    setTestTotal(sumTotal)
  },[doneTests]);

  const handleAddItem = () =>{
    console.log(selectedTest)
    if(!selectedTest){
      toast.error("Please select test");
      return;
    }
    const itemExists = tests.some(test => test.test_id === selectedTest.id);
    if (itemExists) {
      toast.error("Test already added!");
      return;
    }
    setTests((prev)=>([...prev,{test_id:selectedTest.id,test_name:selectedTest.test_name,amount:selectedTest.test_price}]));
    setSelectedTest({});
    setSelectedIndex(-1);
  }

  const handleRemoveItem = (index) =>{
    console.log(tests)
    const its = [...tests];
    its.splice(index, 1);
    setTests(its);
  }

  const handleItemSelect = (e)=>{    
    const index = e.target.value;
    const item = testItems[index];
    setSelectedTest({...item});
    setSelectedIndex(index)
  }

  const handleAddTests = async() =>{
    console.log(tests)
    try {
      const doneTests = await addPatientTest(patient.id, tests);
      setDoneTests(doneTests);
      setCount((prev)=> prev + 1);
      toast.success("Test added to patient successful!");
    } catch (error) {
      toast.error("Error while adding test: "+error.message);
    }
  }

  const handleTestHistory = async() =>{
    try {
      const tests = await getPatientTestHistory(patient.id);
      setDoneTests(tests);
    } catch (error) {
      toast.error("Error while getting tests: "+error.message);
    }
  }

  const handleTests = async() =>{
    try {
      const tests = await getPatientTests(patient.id,testDate);
      setDoneTests(tests);
    } catch (error) {
      toast.error("Error while getting tests: "+error.message);
    }
  }
  const handleTestPay = async(id) =>{
    try {
      await setTestPaidStatus(id);
      setCount((prev)=> prev + 1);
      toast.success("Test status set to PAID");
    } catch (error) {
      toast.error("Error while setting status: "+error.message);
    }
  }

  const handleFullPay = async() =>{
    try {
      await setFullTestPaidStatus(patient.id,testDate);
      setCount((prev)=> prev + 1);
      toast.success("All tests status set to PAID");
    } catch (error) {
      toast.error("Error while setting status: "+error.message);
    }
  }


  return (
    <div className="flex  w-6xl  bg-gray-400 ">
      <div className="flex flex-col ">
        <h1 className="flex m-2 font-semibold">Available Tests</h1>
        <div className="flex gap-2 m-2">
          <input type="date" value={testDate} onChange={(e)=>setTestDate(e.target.value)} className="bg-gray-500 p-2 rounded"/>
          <select onChange={handleItemSelect} className="bg-gray-500 p-2 rounded" value={selectedIndex}>
            <option value="-1">-Select-</option>                     
            {testItems && testItems.map((item,index)=>(
            <option key={item.id} value={index}>{item.test_name}</option>
            ))}          
          </select>
          <button className="flex bg-blue-800 text-gray-100 w-20 p-1 
          rounded cursor-pointer hover:bg-amber-500 justify-center" onClick={handleAddItem}>Add</button>
        </div>

        <div className="flex flex-col  m-2 border-1">
          <h1 className="flex m-2 font-semibold">Item Basket</h1>
          {tests.length > 0 ?
          <div className="flex flex-col h-[300px] overflow-y-auto">
            <div className="flex bg-gray-600 w-full" >
                <div className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center">Test Id</div>
                <div className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center">Name</div>
                <div className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center">Amount</div>
                <div className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center"></div>
              </div>
          {
            tests && tests.map((item,index)=>(
              <div className="flex  bg-gray-400 w-full" key={item.id}>
                <div className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center">{item.test_id}</div>
                <div className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-start" title={item.test_name}>{item.test_name}</div>
                <div className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center">{item.amount}</div>
                <X className="border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center" color={'yellow'} size={20} onClick={(e)=>handleRemoveItem(index)}/>
              </div>
            ))
          }
          <div className="flex bg-gray-600 w-full  bottom-0 sticky" >
            <div className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center"></div>
            <div className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center">Total</div>
            <div className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center">{total}</div>
            <div className=" border-r  w-full  whitespace-nowrap truncate p-0 flex justify-center">
              <button className="flex bg-blue-800 text-gray-100 w-20 m-1 
          rounded cursor-pointer hover:bg-amber-500 justify-center" onClick={handleAddTests}>Add Tests</button>
            </div>
          </div>
          
          </div>:null}        
        </div>        
      </div>
      <div className="flex flex-col w-xl ">
        <div className="flex cursor-pointer hover:text-blue-800" onClick={handleTests}>Tests Done</div> 
           <div className="flex cursor-pointer hover:text-blue-800" onClick={handleTestHistory}>Show Test History</div>
        <div className="flex flex-col border-1 w-full  h-[300px]  overflow-y-auto ">
          <div className="flex bg-gray-600 w-full" >
            <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center">Test Id</div>
            <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center">Name</div>
            <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center">Date</div>
            <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center">Amount</div>
            <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center">Status</div>
            <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center"></div>
          </div>
          {
            doneTests && doneTests.map((item,index)=>(
              <div className="flex  bg-gray-400 w-full" key={item.id}>
                <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center">{item.test_id}</div>
                <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-start" title={item.item_name}>{item.test_name}</div>
                <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-start" title={formatDate(item.test_date)}>{formatDate(item.test_date)}</div>
                <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center">{item.amount}</div>
                <div className={`border-r  w-full  whitespace-nowrap truncate 
                pl-1 pr-1 flex justify-center ${item.status === 'PAID' ? `text-green-700`:`text-yellow-500`}`}>{item.status}</div>
                <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center">
                  <button className={`flex m-2 w-10  rounded justify-center
                    ${(item.status === 'PAID') ? `bg-gray-300` :`bg-blue-800 hover:bg-amber-500`}`} 
                    onClick={()=>handleTestPay(item.id) } disabled={item.status === 'PAID'}>Pay</button>
                </div>
              </div>
            ))
          }
          {doneTests.length > 0 ? 
          <div className="flex bg-gray-600 w-full bottom-0 sticky" >
            <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center"></div>
            <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center"></div>
            <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center">Balance</div>
            <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center">{testTotal}</div>
            <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center"></div>
            <div className=" border-r  w-full  whitespace-nowrap truncate pl-1 pr-1 flex justify-center">
                  <button className={`flex w-30  ${(testTotal === 0) ? `bg-gray-300` :`bg-blue-800 hover:bg-amber-500`} 
                   rounded justify-center `} onClick={handleFullPay } disabled={testTotal === 0}>Pay All</button>
                </div>
          </div>: null}
        </div>
      </div>
    </div>
  )
}

export default PatientTests
