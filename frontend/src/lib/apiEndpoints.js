const base_url = import.meta.env.VITE_API_BASE_URL;

export const endpoints = {
    fetchEntries:`${base_url}/entries`,
    createEntry: `${base_url}/entries/createEntry`,
    updateEntry: (id) => `${base_url}/entries/updateEntry/${id}`,
    deleteEntry:(id) => `${base_url}/entries/deleteEntry/${id}`
}