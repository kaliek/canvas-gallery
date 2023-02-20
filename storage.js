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

export function saveSvgTagToLocalStorage(tag, imageName, height, width, x, y) {
  const key = `${imageName}_${tag}`;
  const value = {
    height,
    width,
    x,
    y,
    tag,
  };
  localStorage.setItem(key, JSON.stringify(value));
}

export function getSvgTagsFromLocalStorage(imageName) {
  const allItems = { ...localStorage };
  const tags = [];
  Object.keys(allItems).forEach((k) => {
    if (k.startsWith(`${imageName}_`)) {
      // .replace(imageName + '_', '')
      tags.push({ ...JSON.parse(allItems[k]), key: k });
    }
  });
  return tags;
}

export function updateSvgTagFromLocalStorage(key, x, y) {
  const tag = localStorage.getItem(key);
  const newTag = { ...JSON.parse(tag), x, y };
  localStorage.setItem(key, JSON.stringify(newTag));
}

export function deleteSvgTagFromLocalStorage(key) {
  localStorage.removeItem(key);
}

export function deleteAllSvgTagsFromLocalStorage(imageName) {
  const allItems = { ...localStorage };
  Object.keys(allItems).forEach((k) => {
    if (k.startsWith(`${imageName}_`)) {
      localStorage.removeItem(k);
    }
  });
}
