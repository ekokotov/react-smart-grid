import {formatDataWithLength} from "../util/helpers";

class SearchService {

  constructor(props) {
    this._searchStr = '';
    this._fields = props.fields || []; // search by fields
    this._global = props.global;
    this.process = this.process.bind(this);
    this._find = this._find.bind(this);
    this._findByProperty = this._findByProperty.bind(this);
    this._columnSearchOptions = {};
  }

  set searchStr(str) {
    this._searchStr = str.toLowerCase().trim();
  }

  set fields(_newFields) {
    this._fields = _newFields;
  }

  set global(isGlobalSearch) {
    this._global = isGlobalSearch;
  }

  get global() {
    return this._global;
  }

  set columnSearchOptions(_opts) {
    this._columnSearchOptions = _opts;
  }

  get columnSearchOptions() {
    return this._columnSearchOptions;
  }

  _findInProperty(prop, searchPredicate) {
    return prop.toString().toLowerCase().indexOf(searchPredicate) > -1;
  }

  _find(item) {
    let searchFields = this._fields.length ? this._fields : Object.keys(item);
    for (let i = 0, arrLength = searchFields.length; i < arrLength; i++) {
      if (this._findInProperty(item[searchFields[i]], this._searchStr)) return true;
    }
    return false;
  }

  _findByProperty(item) {
    let searchProperties = Object.keys(this._columnSearchOptions);
    for (let i = 0, arrLength = this._fields.length; i < arrLength; i++) {
      let searchStr = this._columnSearchOptions[this._fields[i]];
      if (searchStr && !this._findInProperty(item[this._fields[i]], searchStr)) return false;
    }
    return true;
  }

  mergeSearchOptions(search) {
    let property = Object.keys(search)[0];
    if (property && !search[property].length) {
      delete this._columnSearchOptions[property];
      this._columnSearchOptions = Object.assign({}, this._columnSearchOptions);
    } else {
      this._columnSearchOptions = Object.assign({}, this._columnSearchOptions, search);
    }
  }

  process({data}) {
    if (this._global) {
      return formatDataWithLength(this._searchStr.length ? data.filter(this._find) : data);
    } else {
      return formatDataWithLength(Object.keys(this._columnSearchOptions).length ? data.filter(this._findByProperty) : data);
    }
  }
}

export default SearchService;
