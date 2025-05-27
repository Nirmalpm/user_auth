  import React, { useEffect, useState } from 'react'
  import { NavLink, useLocation } from 'react-router'
import { usePasStore } from '../../store/pasStore';
import {UserCog ,Home,Layers,TestTube,Bed, UserCheck, Receipt, ArrowLeft,ChefHat, PlusCircle  ,LogOut } from 'lucide-react'

  const NavBar = () => {
    const [depts, setDepts] = useState([]);
    const [wards, setWards] = useState([]);
    const {getDepartments, getWards,logout} = usePasStore();
    const location = useLocation();

    const isPatientsActive = location.pathname.includes('patient');
    const isWardActive = location.pathname.includes('ward');
    const isDeptActive = location.pathname.includes('dept');

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
    const handleClassname = ({isActive})=>{
      if(isActive){
        return 'active text-amber-500 font-bold flex  w-full justify-center md:w-auto  p-2 border-b-1 sm:border-b-1 md:border-0 '
      }else{
        return 'active text-gray-100 flex  w-full justify-center md:w-auto  p-2 border-b-1 sm:border-b-1 md:border-0' 
      } 
    }

    const handleLogout = async ()=>{
      await logout();
    }
    return (
      <nav className="w-full flex justify-between items-start p-3 bg-blue-900 text-gray-100 font-normal z-50 flex-col sm:flex-col md:flex-row ">
    <div className="text-2xl font-extrabold w-1/2 text-amber-500 bg-blue-900 text-center flex p-3 rounded">Pro-Health Life Care Hospitals</div>
    
  <NavLink className={handleClassname} end to="/hospital"><span><Home size={25}/>Home</span></NavLink>
  <NavLink className={handleClassname}  to="/hospital/admin"><span><UserCog size={25}/>Admin</span></NavLink>

    <div className="dropdown w-full justify-center md:w-auto flex p-2 border-b-1 sm:border-b-1 md:border-0">
    <div className={`flex flex-col items-center gap-2 ${isDeptActive ? 'text-amber-500 font-bold' : 'text-gray-100'}`}><Layers size={25}/> Departments</div>
    <div className="dropdown-menu h-100 overflow-y-auto flex p-2">
      {depts && depts.map((dept)=>(
        <NavLink to="dept" key={dept.id} className=" text-gray-800 hover:bg-gray-100 border-b-2 border-b-gray-300">{dept.name}</NavLink>
      ))}
    </div>
    </div>

  <NavLink to="test" className={handleClassname}><span><TestTube size={25} />Tests</span></NavLink>
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
      <NavLink to="patientreg" className={handleClassname}>Registration</NavLink>
      <NavLink to="inpatient" className={handleClassname}>InPatients</NavLink>
      <NavLink to="outpatient" className={handleClassname}>OutPatients</NavLink>
    </div>
  </div>
  <NavLink to="pharmacy"  className={handleClassname}><span><PlusCircle   size={25} />Pharmacy</span></NavLink>
  <NavLink to="canteen"  className={handleClassname}><span><ChefHat size={25} />Canteen</span></NavLink>
  <NavLink to="billing"  className={handleClassname}><span><Receipt size={25} />Billing</span></NavLink>
  <div className="flex w-full justify-center md:w-auto  p-2 border-b-1 sm:border-b-1 
  md:border-0 cursor-pointer" onClick={handleLogout}><span><LogOut size={25} /> Logout</span></div>
  <NavLink to="/"  className="flex w-full justify-center md:w-auto  p-2 border-b-1 sm:border-b-1 md:border-0"><span><ArrowLeft size={25} /> Back</span></NavLink>
</nav>

    )
  }

  export default NavBar
