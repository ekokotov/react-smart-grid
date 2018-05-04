class PagingService {

  constructor(props) {
    this.pageSize = props.pageSize;
    this.currentPage = props.page || 0;
    this.pageCount = 0;

    this.showPage = this.showPage.bind(this);
  }

  showPage(_data) {
    if (!_data.length || !this.pageSize) return _data;
    let startPage = this.pageSize * this._currentPage;
    this.pageCount = Math.round(_data.length / this.pageSize);
    return _data.slice(startPage, startPage + this.pageSize);
  }

  set currentPage(nextPage) {
    this._currentPage = nextPage;
  }

}

export default PagingService