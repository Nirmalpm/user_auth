  import React, { useEffect, useState } from 'react'
  import { NavLink, useLocation } from 'react-router'
import { usePasStore } from '../../store/pasStore';
import {UserCog ,Home,Layers,TestTube,Bed, UserCheck, Receipt, ArrowLeft} from 'lucide-react'

  const NavBar = () => {
    const [depts, setDepts] = useState([]);
    const [wards, setWards] = useState([]);
    const {getDepartments, getWards} = usePasStore();
    const location = useLocation();

    const isPatientsActive = location.pathname.includes('patientreg');
    const isWardActive = location.pathname.includes('ward');
   

    useEffect(()=>{
            const fetchDepts = async ()=>{
                const depts = await getDepartments();
                await getWards();
                setDepts(depts);
            }
            fetchDepts();
        },[]);
    useEffect(()=>{
          const fetchWards = async ()=>{
              const wards = await getWards();
              setWards(wards);
          }
          fetchWards();
      },[]);

    return (
      <nav className="w-full flex justify-between items-start p-3 bg-blue-900 text-gray-100 font-semibold z-50 flex-col sm:flex-col md:flex-row ">
    <div className="text-2xl font-extrabold w-1/2 text-amber-500 bg-blue-900 text-center flex p-3 rounded">Pro-Health Life Care Hospitals</div>
    
  <div className="flex w-full justify-center md:w-auto  p-2 border-b-1 sm:border-b-1 md:border-0"><NavLink to="/hospital"> <Home size={25} />Home</NavLink></div>
  <div className="flex w-full justify-center md:w-auto  p-2 border-b-1 sm:border-b-1 md:border-0"><NavLink to="/hospital/admin"> <UserCog size={25} />Admin</NavLink></div>

    <div className="dropdown w-full justify-center md:w-auto flex p-2 border-b-1 sm:border-b-1 md:border-0">
    <div className="flex flex-col p-2"><Layers size={25}/> Departments</div>
    <div className="dropdown-menu">
      {depts && depts.map((dept)=>(
        <a key={dept.id} className=" text-gray-800 hover:bg-gray-100 border-b-2 border-b-gray-300">{dept.name}</a>
      ))}
    </div>
    </div>

  <div className="flex  w-full justify-center md:w-auto  p-2 border-b-1 sm:border-b-1 md:border-0"><div><TestTube size={25} />Tests</div></div>
  <div className="dropdown flex w-full justify-center md:w-auto  p-2 border-b-1 sm:border-b-1 md:border-0">
    <div className={`flex flex-col items-center gap-2 ${isWardActive ? 'text-amber-500 font-bold' : 'text-gray-100'}`}><Bed size={25} />Wards</div>
    <div className="dropdown-menu h-100 overflow-y-auto flex p-2">
       {wards && wards.map((ward)=>(
        <NavLink to={`ward/${ward.id}`} key={ward.id} className=" text-gray-800 hover:bg-gray-100 border-b-2 border-b-gray-300">{ward.ward_name}</NavLink>
      ))}
    </div>
  </div>
  <div className="dropdown flex w-full justify-center md:w-auto  p-2 border-b-1 sm:border-b-1 md:border-0">
    <div className={`flex flex-col items-center gap-2 ${isPatientsActive ? 'text-amber-500 font-bold' : 'text-gray-100'}`}>
        <UserCheck size={25} />
        <span>Patients</span>
      </div>

      <div className="dropdown-menu">
      <NavLink to="patientreg" className="text-gray-800 hover:bg-gray-100 border-b-2  border-b-gray-300">Registration</NavLink>
      <NavLink to="patientreg" className="  text-gray-800 hover:bg-gray-100 border-b-2  border-b-gray-300">InPatients</NavLink>
      <NavLink to="patientreg" className="  text-gray-800 hover:bg-gray-100 border-b-2  border-b-gray-300">OutPatients</NavLink>
    </div>
  </div>
  <div  className="flex  w-full justify-center md:w-auto  p-2 border-b-1 sm:border-b-1 md:border-0"><div><Receipt size={25} />Billing</div></div>
  <div  className="flex w-full justify-center md:w-auto  p-2 border-b-1 sm:border-b-1 md:border-0"><NavLink to="/"><ArrowLeft size={25} /> Back</NavLink></div>
</nav>

    )
  }

  export default NavBar
