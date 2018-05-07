export const debounce = (fn, delay) => {
  let timer = null;
  return () => {
    let context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(context, args), delay);
  };
};

export const formatDataWithLength = (_data, allCounts) => ({data:_data, count: allCounts || (_data ? _data.length : 0)});