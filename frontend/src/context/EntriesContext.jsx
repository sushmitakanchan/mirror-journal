import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useCallback } from 'react';
import { createContext, useState, useContext } from 'react';

const EntriesContext = createContext();

export function EntriesProvider({children}){
    const [entries, setEntries] = useState([])
    const [loading, setLoading] = useState(true);
    const {getToken} = useAuth();

    const fetchEntries = useCallback(async()=>{
        setLoading(true)
        try {
            const token = await getToken({ skipCache: true })
            const res = await fetch('http://localhost:3000/entries', {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            });
            const data = await res.json();
            setEntries(Array.isArray(data) ? data : [])
        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false)
        }
    }, [getToken])

    useEffect(()=>{
        fetchEntries();
    }, [fetchEntries])
    const addEntry = async(payload)=>{
        try {
            const token = await getToken({ skipCache: true })
            const res = await fetch('http://localhost:3000/entries/createEntry', {
                method:"POST",
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body:JSON.stringify(payload)
            });
            const created = await res.json()
            setEntries(prev=>Array.isArray(prev) ? [created, ...prev] : [created]);
            return created
        } catch (error) {
            console.error("addEntry", error);
        }
    }

    return (
        <EntriesContext.Provider value={{entries, loading, fetchEntries, addEntry}}>
            {children}
        </EntriesContext.Provider>
    )
}

export const useEntries = () => useContext(EntriesContext);
