import React, { useEffect, useState } from 'react'
import { usePasStore } from '../../../store/pasStore';
import toast from 'react-hot-toast'

const TestMaster = () => {
    const initialState = {test_name:'',test_type:'',test_price:''}
    const [test, setTest] = useState(initialState);
    const [tests, setTests] = useState([]);
    const[count,setCount]  = useState(0);
    const {addTest, getTests} = usePasStore();

    const handleChange = (e)=>{
      setTest((prev)=>( {...prev,[e.target.name]:e.target.value}))
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();
       try {
         const tests = await addTest(test);
         setTests(tests);
         setTest(initialState);
         setCount((prev)=> prev + 1);
         toast.success("Test added successfully")
       } catch (error) {
        toast.error("error:"+error.mesage)
       }
    }

    useEffect(()=>{
        const fetchTests = async ()=>{
            const tests = await getTests();
            setTests(tests);
        }
        fetchTests();
    },[count]);
  return (
    <div className="flex flex-col  justify-center items-center">
      <h1 className="text-2xl mb-3">Add Ward</h1>
      <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-1 p-2">
        <div>
            <label htmlFor="test_name">Test Name:</label>
            <input type="text" className="bg-gray-300 p-2 rounded m-2" name="test_name" maxLength={100} value={test.test_name}  onChange={handleChange}/>
        </div>
        <div>
            <label htmlFor="test_type">Test Type:</label>
            <select name="test_type" className="bg-gray-300 p-2 rounded m-2" onChange={handleChange} value={test.test_type}>
              <option value="">-Select-</option>
              <option value="Blood">Blood Test</option>
              <option value="Urine">Urine Test</option>
              <option value="Stool">Stool Test</option>
              <option value="X-Ray">X-Ray</option>
              <option value="ECO">ECO Test</option>
              <option value="ECG">ECG</option>
              <option value="MRI Scan">MRI Scan</option>
            </select>
        </div>
        <div>
            <label htmlFor="test_price">Test Price</label>
            <input type="number" className="bg-gray-300 p-2 rounded m-2" name="test_price" maxLength={100} value={test.test_price} onChange={handleChange}/>
        </div>
       
        
            <input type="submit" value={"Save"} className="bg-blue-800 pl-2 pr-2 rounded mt-2 text-amber-50 
            cursor-pointer hover:-translate-y-1 transition hover:bg-amber-500"/>
       
      </form>
      <div className="mt-3 flex flex-col w-full h-50 overflow-y-auto  pl-3 pr-3">
              <div className="flex  sticky top-0 ">
                <div className="p-1 w-3/4 bg-blue-400 text-amber-50 text-center">Test Name</div>
                <div className="p-1 w-1/4 bg-blue-400 text-amber-50 text-center">Test Type</div>
                <div className="p-1 w-1/4 bg-blue-400 text-amber-50 text-center">Test Price</div>
              </div>
        {
            tests && tests.map((test)=>(
              <div className="flex odd:bg-gray-600 even:bg-gray-400"  key={test.id}>
                <div className="p-1 w-3/4  text-amber-50  text-center">{test.test_name}</div>
                <div className="p-1 w-1/4 text-amber-50  text-center">{test.test_type}</div>
                <div className="p-1 w-1/4  text-amber-50  text-center">{test.test_price}</div>
              </div>
            ))
        }
      </div>
    </div>
  )
}

export default TestMaster
