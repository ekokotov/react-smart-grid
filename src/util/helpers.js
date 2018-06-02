export const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
};

export const formatDataWithLength = (_data, allCounts) => ({
  data: _data,
  count: allCounts || (_data ? _data.length : 0)
});
