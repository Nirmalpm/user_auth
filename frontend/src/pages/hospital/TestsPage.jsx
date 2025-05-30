import React, { useEffect, useState } from 'react'
import { usePasStore } from '../../store/pasStore'
import { formatDate } from '../../utils/date';

const TestsPage = () => {
  const {getTests,getTestPatients} = usePasStore();
  const [tests, setTests] = useState([]);
   const [testPatients, setTestPatients] = useState([]);
  const [test, setTest] = useState(null);
  useEffect(()=>{
    const fetchTests = async ()=>{
        const tests = await getTests();
        setTests(tests);
    }
    fetchTests();
  },[]);
  useEffect(()=>{
    const fetchPatients = async ()=>{
        const patients = await getTestPatients(test.id);
        setTestPatients(patients);
        console.log(testPatients)
    }
    test && fetchPatients();
  },[test]);
  const handleSelectTest = (test) =>{
    setTest(test);
  }
  return (
    <div className="flex flex-col w-7xl bg-blue-900  h-[630px] m-1  text-gray-100 justify-center">
        <h1 className="flex justify-center text-2xl font-semibold underline">Patients undergone Tests</h1>
        <div className="flex justify-center w-7xl">
            <div className="flex flex-col w-md  m-2 ">
                <div className="flex flex-col w-md  justify-center items-center bg-gray-600 h-1/2">
                    <h1 className="font-semibold">Available Tests</h1>
                    <div className="flex flex-col w-full mt-2 border-1 h-[400px] overflow-y-auto ">
                        {tests && tests.map((test)=>(
                            <div className="flex odd:bg-gray-500 even:bg-gray-600 pl-2 cursor-pointer" onClick={()=>handleSelectTest(test)}>
                            {test.test_name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex flex-col w-full  m-2 ">           
                <div className="flex flex-col w-full  justify-center items-center bg-gray-600 h-1/2">
                    <h1 className="font-semibold">Patient List</h1>
                    <div className="flex w-full pl-2 justify-start">
                        <h1 className="text-amber-500">Test: {test?.test_name}</h1>
                    </div>
                    <div className="flex flex-col w-full mt-2 border-1 h-[400px] overflow-y-auto ">
                        <div className="flex bg-gray-700  w-full ">
                            <div className="flex pl-2 pr-2 border-1  w-full">Patient Name</div>
                            <div className="flex pl-2 pr-2  border-1  w-full">code</div>
                            <div className="flex pl-2 pr-2  border-1  w-full">Pay Status</div>
                            <div className="flex pl-2 pr-2  border-1  w-full">Test Date</div>
                        </div>
                        {testPatients && testPatients.map((test)=>(
                        <div className="flex odd:bg-gray-400 even:bg-gray-500 cursor-pointer w-full " key={test.id}>
                            <div className="flex pl-2 pr-2  border-1  w-full">{test.patient_name}</div>
                            <div className="flex pl-2 pr-2  border-1  w-full">{test.patient_code}</div>
                            <div className="flex pl-2 pr-2  border-1  w-full">{test.status}</div>
                            <div className="flex pl-2 pr-2  border-1  w-full">{formatDate(test.test_date)}</div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default TestsPage
