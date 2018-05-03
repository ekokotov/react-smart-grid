export const load = url => fetch(url)
  .then(response => response.json());
