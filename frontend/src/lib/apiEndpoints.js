const base_url = import.meta.env.VITE_API_BASE_URL;

export const endpoints = {
    fetchEntries:`${base_url}/entries`,
    createEntry: `${base_url}/entries/create-entry`,
    updateEntry: (id) => `${base_url}/entries/update-entry/${id}`,
    deleteEntry:(id) => `${base_url}/entries/delete-entry/${id}`
}