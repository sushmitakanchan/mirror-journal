export async function createEntryApi(payload, getToken){
    const token = getToken();
    const res = await fetch('http://localhost/3000/entries', {
        method: POST,
        headers: {
            "content-Type" : "application/json",
            Authorization :`Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
    const txt = await res.text().catch(()=>null);
    throw new Error(txt || `HTTP ${res.status}`);
  }
  return res.json();
}