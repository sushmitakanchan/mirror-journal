import { endpoints } from "@/lib/apiEndpoints";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useCallback } from "react";
import { createContext, useState, useContext } from "react";
import { toast } from "react-hot-toast";

const EntriesContext = createContext();

export function EntriesProvider({ children }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const { getToken } = useAuth();

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken({ skipCache: true });
      const res = await fetch(endpoints.fetchEntries, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setEntries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  // useEffect(() => {
  //   fetchEntries();
  // }, [fetchEntries]);
  
  const addEntry = async (payload) => {
    try {
      const token = await getToken({ skipCache: true });
      const res = await fetch(endpoints.createEntry, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const created = await res.json();
      // setEntries((prev) =>
      //   Array.isArray(prev) ? [created, ...prev] : [created]
      // );
      return created;
    } catch (error) {
      console.error("addEntry", error);
    }
  };

  const updateEntry = async (id, payload) => {
    try {
      const token = await getToken();
      const res = await fetch(endpoints.updateEntry(id),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const updated = await res.json();

      setEntries((prev) =>
        prev.map((entry) => (entry.id === id ? updated : entry))
      );
      return updated;
    } catch (error) {
      console.log(error);
    }
  };
  const deleteEntry = async (id) => {
    try {
      const token = await getToken();
      const res = await fetch(endpoints.deleteEntry(id),
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete entry");
      }
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
      toast.success("Entry deleted successfully!");
    } catch (error) {}
  };
  return (
    <EntriesContext.Provider
      value={{ entries, setEntries, loading, fetchEntries, addEntry, updateEntry, setIsDisabled, isDisabled, deleteEntry }}
    >
      {children}
    </EntriesContext.Provider>
  );
}

export const useEntries = () => useContext(EntriesContext);
