import {formatDataWithLength} from '../util/helpers'
class PagingService {

  constructor(props) {
    this.pageSize = props.pageSize;
    this.currentPage = props.page || 0;
    this.pageCount = 0;

    this.process = this.process.bind(this);
  }

  process({data}) {
    let dataLength = data.length;
    if (!dataLength || !this.pageSize) return formatDataWithLength(data);
    let startPage = this.pageSize * this._currentPage;
    this.pageCount = Math.round(data.length / this.pageSize);
    return formatDataWithLength(data.slice(startPage, startPage + this.pageSize), dataLength);
  }

  set currentPage(nextPage) {
    this._currentPage = nextPage;
  }

}

export default PagingService