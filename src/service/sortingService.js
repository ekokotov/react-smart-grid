class SortingService {
  addToSorting(sortingArray, sortOptions) {
    let found = false;
    for (let i = 0; i < sortingArray.length; i++) {
      if (sortOptions.field === sortingArray[i].field) {
        sortingArray[i] = sortOptions;
        found = true;
        break;
      }
    }
    if (!found) sortingArray.push(sortOptions);
    return sortingArray;
  }

  removeFromSorting(sortingArray, field) {
    return sortingArray.filter(item => item.field !== field);
  }

  sortByField(sortingArray, {field, asc}) {
    let isAsc = asc === 'asc';
    return sortingArray.sort((x, y) => {
      if (x[field] === y[field]) return 0;
      return x[field] > y[field] ? (isAsc ? 1 : -1) : (isAsc ? -1 : 1);
    });
  }

  _fieldSorter(sortingPredicate) {
    let sortingOptions = sortingPredicate.map(o => {
      return {
        asc: o.asc === 'asc' || o.asc === 1 ? 1 : -1,
        field: o.field
      };
    });
    return (a, b) => {
      let ret = 0;
      sortingOptions.some(o => {
        if (a[o.field] > b[o.field]) ret = o.asc;
        else if (a[o.field] < b[o.field]) ret = -o.asc;
        else ret = 0;
        return ret !== 0;
      });
      return ret;
    };
  }

  compoundSort(sortingArray, sortingPredicate) {
    return sortingArray.sort(this._fieldSorter(sortingPredicate));
  }
}

export default new SortingService();