import {SORTING} from "../util/const";

class SortingService {
  addToSorting(sortingOptions, field) {
    let asc = sortingOptions.hasOwnProperty(field) ? (sortingOptions[field] === 1 ? -1 : 1) : 1;
    return {
      ...sortingOptions,
      [field]: asc
    };
  }

  removeFromSorting(sortingOptions, field) {
    const {[field]: deletedKey, ...otherKeys} = sortingOptions;
    return otherKeys;
  }

  sortByField(sortingArray, options) {
    let [field, asc] = Object.entries(options)[0];
    let isAsc = asc === 1;
    return sortingArray.sort((x, y) => {
      if (x[field] === y[field]) return 0;
      return x[field] > y[field] ? (isAsc ? 1 : -1) : (isAsc ? -1 : 1);
    });
  }

  _fieldSorter(sortingPredicate) {
    let sortingOptions = Object.keys(sortingPredicate).map(key => {
      return {
        asc: sortingPredicate[key] === 1 ? 1 : -1,
        field: key
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

  compoundSort(sortingArray, sortingOptions) {
    return sortingArray.sort(this._fieldSorter(sortingOptions));
  }

  sort(type, data, sortingOptions) {
    if (type === SORTING.SIMPLE) {
      return this.sortByField(data, sortingOptions);
    } else {
      return this.compoundSort(data, sortingOptions);
    }
  }
}

export default new SortingService();