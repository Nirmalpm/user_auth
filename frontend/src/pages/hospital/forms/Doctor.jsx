import React, { useEffect, useState } from 'react'
import { File } from 'lucide-react'
import { usePasStore } from '../../../store/pasStore';
import { uploadDocImage } from '../../../utils/fileupload';
import toast from 'react-hot-toast';

const IMAGE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "";

const Doctor = () => {
    const initialState = {name:'',degree:'',dept:-1,specialization:'',contact:'',email:'',photo_path:'',consult_fee:''};
    const  [doctor,setDoctor] = useState(initialState);
    const [doctors, setDoctors] = useState([]);
    const {depts, addDoctor, getDoctors} = usePasStore();
     const [file, setFile] = useState(null);
    const[count,setCount]  = useState(0);
   

    useEffect(()=>{
        const fetchDocs = async ()=>{
            const docs = await getDoctors();
            setDoctors(docs);
        }
        fetchDocs();
    },[count]);

    const handleSubmit = async (e)=>{
        e.preventDefault();
        let newDoc= {...doctor};
        let imagePath = "";
        try {
            if (file && doctor.name) {
                console.log("file present")
                const imageData = await uploadDocImage(file, doctor.name);
                console.log(imageData)
                imagePath = imageData.filePath;
                newDoc = {...newDoc,photo_path:imagePath}
            }
            const doctors = await addDoctor(newDoc);
            setDoctors(doctors);
            setDoctor(initialState);
            setCount((prev)=> prev + 1)
            toast.success("Doctor added successfully!")
        } catch (error) {
             toast.error(`Error: ${error.message}`);
        }
    }
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };
    
   const handleChange = (e) => {
    setDoctor((prev) => ({
        ...prev,
        [e.target.name]: e.target.value
    }));
}
  return (
    <div className="flex flex-wrap flex-col mt-3 justify-start items-start  bg-gray-500 h-120 overflow-y-auto">
        <div className="flex flex-wrap">
            <div className="border-r-2 border-amber-300">
                <h1 className="text-xl mb-3 text-amber-50 p-3">Add Doctor</h1>
                <form onSubmit={handleSubmit} className="flex flex-col p-3 gap-2 justify-center items-center">
                    <div className="flex justify-between items-center w-sm">
                        <label htmlFor='name' className="text-gray-300">Name</label>
                        <input type="text" value={doctor.name} name="name" onChange={handleChange} className="p-1 ml-2 rounded bg-gray-300"/>
                    </div>
                    <div className="flex justify-between items-center w-sm">
                        <label htmlFor='degree' className="text-gray-300">Degree</label>
                        <input type="text" name="degree" value={doctor.degree} onChange={handleChange} className="p-1 ml-2 rounded bg-gray-300"/>
                    </div>
                    <div className="flex justify-between items-center w-sm">
                        <label htmlFor='specialization' className="text-gray-300">Specialization</label>
                        <input type="text" name="specialization" value={doctor.specialization} onChange={handleChange} className="p-1 ml-2 rounded bg-gray-300"/>
                    </div>
                    <div className="flex justify-between items-center w-sm">
                        <label htmlFor='dept' className="text-gray-300">Deptartment</label>
                        {/* <input type="text" name="dept" onChange={handleChange} className="p-1 ml-2 rounded bg-gray-300"/> */}
                        <select className="p-1 ml-2 rounded bg-gray-300" onChange={handleChange} name="dept" value={doctor.dept}>
                            <option className="p-1 ml-2 rounded bg-gray-300" value="-1">-Select-</option>
                            {depts && depts.map((dept)=>(
                                <option key={dept.id} className="p-1 ml-2 rounded bg-gray-300" value={dept.id}>{dept.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-between items-center w-sm">
                        <label htmlFor='contact_number' className="text-gray-300">Contact</label>
                        <input type="number" name="contact" value={doctor.contact} onChange={handleChange} className="p-1 ml-2 rounded bg-gray-300"/>
                    </div>
                    <div className="flex justify-between items-center w-sm">
                        <label htmlFor='email' className="text-gray-300">Email</label>
                        <input type="email" name="email" value={doctor.email} onChange={handleChange} className="p-1 ml-2 rounded bg-gray-300"/>
                    </div>
                    <div className="flex justify-between items-center w-sm">
                        <label htmlFor='consult_fee' className="text-gray-300">Consultation Fee</label>
                        <input type="text" name="consult_fee" value={doctor.consult_fee} onChange={handleChange} className="p-1 ml-2 rounded bg-gray-300"/>
                    </div>
                    <div >
                        <input type="submit" value={"Save"} className="bg-blue-800 pl-2 pr-2 rounded mt-2 text-amber-50 
                        cursor-pointer hover:-translate-y-1 transition hover:bg-amber-500"/> </div>
                </form>
                <form method="post" encType="multipart/form-data"  
                className="flex flex-col bg-gray-700  p-3 gap-2 justify-center items-center mt-5">
                        <div className="flex flex-col  ">
                            <label htmlFor="photo" className="text-gray-300 font-semibold">Upload profile picture</label>
                            <input
                            type="file"
                            name={"photo"}
                            onChange={handleFileChange} 
                            className="rounded bg-blue-800 w-50 p-1 text-amber-50"
                            />
                        </div>
                        {/* <div >
                        <input type="submit" value={"Save"} className="bg-blue-800 pl-2 pr-2 rounded mt-2 text-amber-50 
                        cursor-pointer hover:-translate-y-1 transition hover:bg-amber-500"/> </div> */}

                </form>
            </div>
            <div className="text-amber-50 flex flex-col">
                <h1 className="text-xl mb-3 text-amber-50 p-3">Doctors</h1>
                {doctors && doctors.map((doc)=>(
                    <div key={`doc_${doc.id}`} className="rounded border-1 border-blue-200 m-2 flex  gap-2 ">
                        <img src={`${IMAGE_URL}${doc.photo_path}`} className="w-50 h-50 rounded"/>
                        <div className="flex flex-col flex-wrap truncate">
                            <p>{doc.name}</p>
                            <p>{doc.degree}</p>
                            <p>Sp: {doc.specialization}</p>
                            <p>email: {doc.email}</p>
                            <p>Ph: {doc.contact_number}</p>
                            <p>Dept: {doc.dept}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default Doctor
