
function saveItem(key: string, value: any){
  return localStorage.setItem(key, JSON.stringify(value));
}

function getItem(key: string){
  try {
    return localStorage.getItem(key) !== null 
      ? JSON.parse(localStorage.getItem(key) as string) 
      : null;

  } catch (error) {
    return null;
  }
}

function removeItem(key: string){
  localStorage.removeItem(key);
}

export const storage = { saveItem, getItem, removeItem }