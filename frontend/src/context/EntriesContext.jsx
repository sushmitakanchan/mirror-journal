import { endpoints } from "@/lib/apiEndpoints";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useCallback, useEffect, useRef } from "react";
import { createContext, useState, useContext } from "react";
import { toast } from "react-hot-toast";

const EntriesContext = createContext();

export function EntriesProvider({ children }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [syncedClerkUserId, setSyncedClerkUserId] = useState(null);
  const fetchEntriesPromiseRef = useRef(null);
  const syncUserPromiseRef = useRef(null);
  const { getToken } = useAuth();
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    if (!isSignedIn) {
      setEntries([]);
      setLoading(false);
      setSyncedClerkUserId(null);
      fetchEntriesPromiseRef.current = null;
      syncUserPromiseRef.current = null;
      return;
    }

    if (user?.id !== syncedClerkUserId) {
      setEntries([]);
      setLoading(true);
      fetchEntriesPromiseRef.current = null;
      syncUserPromiseRef.current = null;
    }
  }, [isSignedIn, syncedClerkUserId, user?.id]);

  const ensureUserSynced = useCallback(async () => {
    if (!isSignedIn || !user) return false;
    if (syncedClerkUserId === user.id) return true;
    if (syncUserPromiseRef.current) return syncUserPromiseRef.current;

    const syncRequest = (async () => {
      const token = await getToken();
      const res = await fetch(endpoints.syncUser, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: user.primaryEmailAddress?.emailAddress ?? null,
          name: user.fullName ?? user.firstName ?? "",
          imageUrl: user.imageUrl ?? "",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to sync user");
      }

      setSyncedClerkUserId(user.id);
      return true;
    })();

    syncUserPromiseRef.current = syncRequest;

    try {
      return await syncRequest;
    } finally {
      syncUserPromiseRef.current = null;
    }
  }, [getToken, isSignedIn, syncedClerkUserId, user]);

  const fetchEntries = useCallback(async (options = {}) => {
    const force = typeof options === "boolean" ? options : options.force ?? false;

    if (fetchEntriesPromiseRef.current && !force) {
      return fetchEntriesPromiseRef.current;
    }

    const request = (async () => {
      setLoading(true);
      try {
        const didSync = await ensureUserSynced();
        if (!didSync) {
          setEntries([]);
          return [];
        }

        const token = await getToken();
        const res = await fetch(endpoints.fetchEntries, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        const normalizedEntries = Array.isArray(data) ? data : [];
        setEntries(normalizedEntries);
        return normalizedEntries;
      } catch (error) {
        console.log(error);
        throw error;
      } finally {
        setLoading(false);
        fetchEntriesPromiseRef.current = null;
      }
    })();

    fetchEntriesPromiseRef.current = request;
    return request;
  }, [ensureUserSynced, getToken]);

  // useEffect(() => {
  //   fetchEntries();
  // }, [fetchEntries]);
  
  const addEntry = async (payload) => {
    try {
      await ensureUserSynced();
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
      if (!res.ok) {
        throw new Error(created.error || "Failed to create entry");
      }
      // setEntries((prev) =>
      //   Array.isArray(prev) ? [created, ...prev] : [created]
      // );
      return created;
    } catch (error) {
      console.error("addEntry", error);
      throw error;
    }
  };

  const updateEntry = async (id, payload) => {
    try {
      await ensureUserSynced();
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
      if (!res.ok) {
        throw new Error(updated.error || "Failed to update entry");
      }

      setEntries((prev) =>
        prev.map((entry) => (entry.id === id ? updated : entry))
      );
      return updated;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  const deleteEntry = async (id) => {
    try {
      await ensureUserSynced();
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
    } catch (error) {
      console.error("deleteEntry", error);
      throw error;
    }
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
