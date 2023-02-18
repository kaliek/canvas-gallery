export function getListFromLocalStorage(key) {
  const storedList = localStorage.getItem(key);
  const list = JSON.parse(storedList);
  return Array.isArray(list) ? list : [];
}
