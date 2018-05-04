import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {measure} from 'react-performance';
import ReactPaginate from 'react-paginate';

import {load} from './service/httpService';
import Header from './cmp/header';
import Row from './cmp/row';
import Loading from './cmp/loading';
import CompoundSorting from "./cmp/sorting";
import SortingService from './service/sortingService';
import PagingService from './service/pagingService';
import DataAggregator from './service/dataAggregator';
import {SORTING} from './util/const';

import './index.scss';

class SmartGrid extends PureComponent {
  constructor(props) {
    super(props);

    this.handlePageClick = this.handlePageClick.bind(this);
    this.initPage = this.initPage.bind(this);
    this.sortBy = this.sortBy.bind(this);
    this.removeSortingByField = this.removeSortingByField.bind(this);

    this.state = {
      displayData: [],
      loading: false,
      pageCount: 0,
      sortingOptions: {}
    };

    this.data = props.data || [];
    this._dataAggregator = new DataAggregator();
  }

  registerDataPipes() {
    if (this.props.sorting) {
      this._sorting = new SortingService({type: this.props.sorting});
      this._dataAggregator.registerPipe(this._sorting.sort);
    }
    if (this.props.pageSize) {
      this._paging = new PagingService({pageSize: this.props.pageSize});
      this._dataAggregator.registerPipe(this._paging.showPage);
    }
  }

  componentWillMount() {
    this.registerDataPipes();
    if (this.props.url) this.loadXHRData();
    else if (this.props.data && this.props.data.length) this.initPage();
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.sorting && Object.keys(this.state.sortingOptions).length) this.setState({sortingOptions: {}});
    if (nextProps.sorting !== this.props.sorting) this._sorting.sortingType = nextProps.sorting;
    if (nextProps.pageSize !== this.props.pageSize) {
      this._paging.pageSize = nextProps.pageSize;
      this.setState({pageCount: 0});
      this.initPage();
    }
  }

  loadXHRData() {
    this.setState({loading: true});
    return load(this.props.url)
      .then(data => {
        this.data = data;
        this.initPage();
      })
      .catch(console.error);
  }

  initPage() {
    this.setState({
      displayData: this._dataAggregator.process(this.data),
      loading: false,
      pageCount: this._paging.pageCount
    })
  }

  _showRecords() {
    if (this.state.loading) {
      return <Loading colspan={this.props.fields.length}/>;
    } else return this.state.displayData.map(record =>
      <Row key={record[this.props.idField]}
           data={record}
           fields={this.props.fields}/>)
  }

  handlePageClick(e) {
    this._paging.currentPage = e.selected;
    this.initPage();
  }

  sortBy(field) {
    this.setState({sortingOptions: this._sorting.addToSorting(field)});
    this.initPage();
  }

  removeSortingByField(field) {
    this.setState({sortingOptions: this._sorting.removeFromSorting(field)});
    this.initPage();
  }

  showPagination() {
    if (this.data.length === this.props.pageSize) return null;
    return <ReactPaginate previousLabel={"<"}
                          nextLabel={">"}
                          breakLabel='...'
                          breakClassName={"break-me"}
                          pageCount={this.state.pageCount}
                          pageRangeDisplayed={5}
                          onPageChange={this.handlePageClick}
                          containerClassName={"smart-grid_pagination"}
                          activeClassName={"active"}/>
  }

  render() {
    if (!this.state.displayData) return null;
    return (
      <div className="smart-grid">
        <CompoundSorting sortingOptions={this.state.sortingOptions} onRemove={this.removeSortingByField}/>
        <table>
          <Header headers={this.props.headers}
                  fields={this.props.fields}
                  sortingEnabled={!!this.props.sorting}
                  sortingOptions={this.state.sortingOptions}
                  onSorting={this.sortBy}/>
          <tbody>{this._showRecords()}</tbody>
        </table>
        <div className="smart-grid_footer">
          {this.showPagination()}
          <span className="smart-grid_counts">{this.data.length}</span>
        </div>
      </div>
    )
  }
}

SmartGrid.propTypes = {
  url: PropTypes.string,
  data: PropTypes.array,
  pageSize: PropTypes.number,
  headers: PropTypes.arrayOf(PropTypes.string),
  fields: PropTypes.arrayOf(PropTypes.string),
  idField: PropTypes.string.isRequired,
  sorting: PropTypes.oneOf([false, true, SORTING.SIMPLE, SORTING.COMPOUND])
};

SmartGrid.defaultProps = {
  pageSize: 10,
  idField: '_id',
  sorting: true
};

export default measure({
  getId: 'SmartGrid',
  Component: SmartGrid,
  isCollapsed: false,
});