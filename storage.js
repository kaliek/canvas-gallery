export function getListFromLocalStorage(key) {
  const storedList = localStorage.getItem(key);
  const list = JSON.parse(storedList);
  return Array.isArray(list) ? list : [];
}

export function saveItemToListLocalStorage(itemKey, itemValue, listKey, list) {
  list.unshift(itemKey);
  localStorage.setItem(listKey, JSON.stringify(list));
  localStorage.setItem(itemKey, itemValue);
  return list;
}

export function deleteItemToListLocalStorage(
  itemKey,
  listKey,
  list,
) {
  const newList = list.filter((i) => i !== itemKey);
  localStorage.setItem(listKey, JSON.stringify(newList));
  localStorage.removeItem(itemKey);
  return newList;
}
export function getItemFromListLocalStorage(itemIndex, list) {
  if (itemIndex >= list.length) {
    return undefined;
  }
  const key = list[itemIndex];
  const value = localStorage.getItem(key);
  if (value) {
    return { key, value };
  }
  return undefined;
}
