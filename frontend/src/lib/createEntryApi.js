import { endpoints } from './apiEndpoints.js';

export async function createEntryApi(payload, token){
    const res = await fetch(endpoints.createEntry, {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
            "Authorization" :`Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
    const txt = await res.text().catch(()=>null);
    throw new Error(txt || `HTTP ${res.status}`);
  }
  return res.json();
}