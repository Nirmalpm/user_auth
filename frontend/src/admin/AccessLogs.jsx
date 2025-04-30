import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { formatDate } from '../utils/date';

const AccessLogs = () => {
    const {getAccesLogs} = useAuthStore();
    const [data, setData] = useState([]);
    useEffect(()=>{
        const callAccessLogs = async () =>{
           const response = await getAccesLogs();
           setData([...response.data]);
        }
        callAccessLogs();
        const timeIntervalId = setInterval(callAccessLogs,5000);
        return ()=> clearInterval(timeIntervalId)
    },[getAccesLogs]);
  return (
    <div className="flex bg-gray-600 w-full flex-col m-3 p-3 text-white items-center justify-start overflow-auto">
        <div className="flex text-white items-center justify-center "><h1 className="text-3xl">Access Logs</h1></div>
        <div className="flex w-full items-center justify-center truncate">
            <div className="flex border-1 border-r-gray-300  p-2 w-full items-center justify-center font-semibold truncate" title="User Name">User Name</div>
            <div className="flex border-1 border-r-gray-300  p-2 w-full items-center justify-center font-semibold truncate" title="Visited At">Visited At</div>
            <div className="flex border-1 border-r-gray-300  p-2 w-full items-center justify-center font-semibold truncate" title="City">City</div>
            <div className="flex border-1 border-r-gray-300  p-2 w-full items-center justify-center font-semibold truncate" title="Region">Region</div>
            <div className="flex border-1 border-r-gray-300  p-2 w-full items-center justify-center font-semibold truncate" title="Country">Country</div>
            <div className="flex border-1 border-r-gray-300  p-2 w-full items-center justify-center font-semibold truncate" title="Longitude">Longitude</div>
            <div className="flex border-1 border-r-gray-300  p-2 w-full items-center justify-center font-semibold truncate" title="latitude">latitude</div>
        </div>
        {
            data && data.map((acc,ind)=>(
            <div className="flex w-full items-center justify-center bg-gray-400">
                <div className="flex border-1 border-r-gray-300  p-2 w-full items-center justify-start truncate" title={acc.username}>{acc.username}</div>
                <div className="flex border-1 border-r-gray-300  p-2 w-full items-center justify-start truncate" title={formatDate(acc.logged_at)}>{formatDate(acc.logged_at)}</div>
                <div className="flex border-1 border-r-gray-300  p-2 w-full items-center justify-start truncate" title={acc.city}>{acc.city}</div>
                <div className="flex border-1 border-r-gray-300  p-2 w-full items-center justify-start truncate" title={acc.region}>{acc.region}</div>
                <div className="flex border-1 border-r-gray-300  p-2 w-full items-center justify-start truncate" title={acc.country}>{acc.country}</div>
                <div className="flex border-1 border-r-gray-300  p-2 w-full items-center justify-start truncate" title={acc.lon}>{acc.lon}</div>
                <div className="flex border-1 border-r-gray-300  p-2 w-full items-center justify-start truncate" title={acc.lat}>{acc.lat}</div>
            </div>
            ))
        }
      
    </div>
  )
}

export default AccessLogs
