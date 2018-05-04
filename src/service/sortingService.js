import {SORTING} from "../util/const";

class SortingService {

  constructor(props) {
    this.sortingType = props.type;
    this.options = props.options || {};

    this.sort = this.sort.bind(this);
  }

  set sortingType(type) {
    if (type === true) type = SORTING.SIMPLE;
    this._sortingType = type;
  }

  addToSorting(field) {
    let asc = this.options.hasOwnProperty(field) ? (this.options[field] === 1 ? -1 : 1) : 1;
    if (this._sortingType === SORTING.SIMPLE) {
      return this.options = {
        [field]: asc
      }
    } else return this.options = {
      ...this.options,
      [field]: asc
    };
  }

  removeFromSorting(field) {
    const {[field]: deletedKey, ...otherKeys} = this.options;
    return this.options = otherKeys;
  }

  sortByField(sortingArray) {
    if (!Object.keys(this.options).length) return sortingArray;
    let [field, asc] = Object.entries(this.options)[0];
    let isAsc = asc === 1;
    return sortingArray.concat().sort((x, y) => {
      if (x[field] === y[field]) return 0;
      return x[field] > y[field] ? (isAsc ? 1 : -1) : (isAsc ? -1 : 1);
    });
  }

  _fieldSorter() {
    let sortingOptions = Object.keys(this.options).map(key => {
      return {
        asc: this.options[key] === 1 ? 1 : -1,
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

  compoundSort(sortingArray) {
    if (!Object.keys(this.options).length) return sortingArray;
    return sortingArray.concat().sort(this._fieldSorter());
  }

  sort(data) {
    if (this._sortingType === SORTING.SIMPLE) {
      return this.sortByField(data);
    } else {
      return this.compoundSort(data);
    }
  }
}

export default SortingService;