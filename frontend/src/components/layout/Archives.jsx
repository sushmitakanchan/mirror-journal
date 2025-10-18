import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mails } from 'lucide-react';
import { useEntries } from '@/context/EntriesContext';
import { SquarePen, Trash2 } from 'lucide-react';
import { BarLoader } from "react-spinners";

const Archives = () => {
  const {entries, loading} = useEntries()
  const navigate = useNavigate();
  return (
    <div className='mx-50'>
      <div className="container py-4">
              <Link to="/dashboard" className="text-md text-orange-600 hover:text-orange-700 cursor-pointer">
                ← Back to Dashboard
              </Link>
      </div>
      <h1 className="text-5xl md:text-6xl gradient-title">Look back at your archives <Mails className='size-8  text-orange-500 inline-block'/> </h1>

      <ul className='flex flex-col gap-2 mt-5'>
        {loading && <BarLoader color="orange" width={"100%"} />}
      {entries.length > 0 ? entries.map((e, index)=>(
        <div className='bg-gradient-to-br from-white/100 to-white/50 backdrop-blur-md rounded-xl shadow-lg border border-pink-300 p-3 max-w-3/4 h-35' key={index}>
          <li className='flex justify-between items-center ml-5'>
            <div className='flex flex-col'>
            <h1 className='font-extrabold text-2xl'>{e.title}</h1>
            <p>{e.mood}</p>
            <p>{e.content}</p>
            </div>
            <div className='flex justify-end gap-1 mb-4 mr-5'>
                <button onClick={()=> navigate(`/updateEntry/${e.id}`)}><SquarePen color="#cf6017" className='h-8 w-8'/></button>
                <button onClick={()=>navigate(`/deleteEntry/${e.id}`)}><Trash2 color="#cf6017" className='h-8 w-8'/></button>
          </div>
          </li>
        </div>
        
      )):<h3 className='text-center text-gray-600 mt-10'>No enteries found.</h3>}
      </ul>
    </div>
  )
}

export default Archives
