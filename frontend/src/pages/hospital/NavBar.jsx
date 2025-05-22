  import React, { useEffect, useState } from 'react'
  import { NavLink } from 'react-router'
import { usePasStore } from '../../store/pasStore';

  const NavBar = () => {
    const [depts, setDepts] = useState([]);
    const [wards, setWards] = useState([]);
    const {getDepartments, getWards} = usePasStore();
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
      <nav className="fixed top-0 w-3xl flex justify-between items-center 
  p-3 bg-amber-200 bg-gradient-to-r from-amber-200 to-amber-500 text-blue-700 font-semibold shrink-0 z-50">
  <div><NavLink to="/hospital"> Home</NavLink></div>
  <div><NavLink to="/hospital/admin"> Admin</NavLink></div>

    <div className="dropdown">
    <div>Departments</div>
    <div className="dropdown-menu">
      {depts && depts.map((dept)=>(
        <a key={dept.id} className=" text-gray-800 hover:bg-gray-100 border-b-2 border-b-gray-300">{dept.name}</a>
      ))}
    </div>
    </div>

  <div>Treatments</div>
  <div className="dropdown">
    <div>Wards</div>
    <div className="dropdown-menu h-100 overflow-y-auto">
       {wards && wards.map((ward)=>(
        <NavLink to={`ward/${ward.id}`} key={ward.id} className=" text-gray-800 hover:bg-gray-100 border-b-2 border-b-gray-300">{ward.ward_name}</NavLink>
      ))}
    </div>
  </div>
  <div className="dropdown"><div>Patients</div>
    <div className="dropdown-menu">
      <a className="  text-gray-800 hover:bg-gray-100 border-b-2  border-b-gray-300">Registration</a>
      <a className="  text-gray-800 hover:bg-gray-100 border-b-2  border-b-gray-300">InPatients</a>
      <a className="  text-gray-800 hover:bg-gray-100 border-b-2  border-b-gray-300">OutPatients</a>
    </div>
  </div>
  <div>Billing</div>
  <div><NavLink to="/">{`<<`} Back</NavLink></div>
</nav>

    )
  }

  export default NavBar
