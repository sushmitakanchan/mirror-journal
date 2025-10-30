import React ,  { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mails } from 'lucide-react';
import { useEntries } from '@/context/EntriesContext';
import { SquarePen, Trash2, Sparkles } from 'lucide-react';
import { BarLoader } from "react-spinners";
import ticket from "../../assets/ticket1.png"
import { Button } from '../ui/button';

const Archives = () => {
  const {entries, fetchEntries, loading, deleteEntry} = useEntries()
  const navigate = useNavigate();
  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);
  console.log("📦 entries in Archives:", entries);

      const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: '2-digit',
    minute: '2-digit'
  };

  const handleDelete = async (id) => {
  await deleteEntry(id); 
  await fetchEntries();  
};
  return (
    <div className='mx-50'>
      <div className="container py-4">
              <Link to="/dashboard" className="text-md text-orange-600 hover:text-orange-700 cursor-pointer dark:text-orange-300 dark:hover:text-orange-400">
                ← Back to Dashboard
              </Link>
      </div>
      <h1 className="text-5xl md:text-6xl gradient-title">Look back at your archives <Mails className='size-8  text-orange-500 inline-block'/> </h1>
      <div className='flex gap-10'>
      <ul className='flex flex-col gap-2 mt-5'>
        {loading && <BarLoader color="orange" width={"100%"} />}
        {entries.length > 0 ? entries.map((e, id)=>(
        <div className='bg-gradient-to-br from-white/100 to-white/50 backdrop-blur-md rounded-xl shadow-lg border border-pink-300 p-3 max-w-3xl w-full dark:bg-white' key={id}>
          <li className='flex justify-between items-center ml-4'>
            <div className='flex flex-col px-10'>
            <h1 className='font-extrabold text-2xl text-black'>{e.title}</h1>
            <p className='font-semibold text-xl text-orange-700'>{e.mood}</p>
            <h6 className='font-bold text-xs text-black'>{new Date(e.updatedAt).toLocaleString("en-US", options)}</h6>
            <div className='font-small text-balance text-black break-words my-5' dangerouslySetInnerHTML={{ __html: e.content }} />
            </div>
            <div className='flex justify-end gap-1 mb-4 mr-5'>
                <button onClick={()=> navigate(`/update-entry/${e.id}`)}><SquarePen color="#cf6017" className='h-8 w-8'/></button>
                <button onClick={() => handleDelete(e.id)}><Trash2 color="#cf6017" className='h-8 w-8'/></button>
                <div className='h-10 w-12flex items-center justify-center rounded-2xl'>
                <Button variant='journal' onClick={()=>navigate(`/reflect`)}><Sparkles color="#ffffff" className='h-8 w-8'/></Button>
                </div>
          </div>
          </li>
        </div>
        
      )):<h3 className='text-center text-gray-600 mt-10'>No enteries found.</h3>}
      </ul>
      <div className="hidden lg:flex flex-col items-center flex-1">
      <div className="relative h-[100vh] w-full mt-30">
      {entries.length > 0 && <img src={ticket} className="absolute inset-0 w-full h-full object-cover mt-3"/>}
    </div>
           <Button variant='journal' className='mt-4  text-white font-semibold px-10 py-6 rounded-xl shadow-md'>Grab it now!</Button>
    </div>
  </div>
</div>
  )
}

export default Archives
