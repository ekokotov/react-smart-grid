import {formatDataWithLength} from "../util/helpers";

class SearchService {

  constructor(props) {
    this._searchStr = '';
    this._fields = props.fields || []; // search by fields
    this.process = this.process.bind(this);
    this._find = this._find.bind(this);
  }

  set searchStr(str) {
    this._searchStr = str.toLowerCase();
  }

  set fields(_newFields) {
    this._fields = _newFields;
  }

  _findInProperty(prop) {
    return prop.toString().toLowerCase().indexOf(this._searchStr) > -1;
  }

  _find(item) {
    let searchFields = this._fields.length ? this._fields : Object.keys(item);
    for (let i = 0, arrLength = searchFields.length;i < arrLength; i++) {
      if (this._findInProperty(item[searchFields[i]])) return true;
    }
    return false;
  }

  process({data}) {
    return formatDataWithLength( this._searchStr.length ? data.filter(this._find) : data );
  }
}

export default SearchService;