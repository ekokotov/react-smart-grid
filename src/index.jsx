import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {measure} from 'react-performance';
import ReactPaginate from 'react-paginate';

import {load} from './service/httpService';
import Header from './cmp/header';
import Row from './cmp/row';
import Loading from './cmp/loading';
import './index.scss';
import CompoundSorting from "./cmp/sorting";
import SortingService from './service/sortingService';
import {SORTING} from './util/const';

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
      currentPage: 0,
      pageCount: 0,
      sortedFields: []
    };

    this.data = props.data || [];
  }

  componentDidMount() {
    if (this.props.url) this.loadXHRData();
    if (this.props.data && this.props.data.length) this.initPage(this.props.data);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.sorting && this.state.sortedFields.length) {
      this.setState({sortedFields: []});
    }
  }

  loadXHRData() {
    this.setState({loading: true});
    return load(this.props.url)
      .then(this.initPage)
      .catch(console.error)
  }

  initPage(data, selectedPage) {
    let page = typeof selectedPage !== 'undefined' ? selectedPage : this.state.currentPage,
      startPage = this.props.limit * page;
    this.data = data;
    this.setState({
      currentPage: page,
      displayData: data.slice(startPage, startPage + this.props.limit),
      loading: false,
      pageCount: Math.round(data.length / this.props.limit)
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
    this.initPage(this.data, e.selected);
  }

  sortBy(title, asc) {
    let index = this.props.headers.indexOf(title);
    if (index > -1) {
      let field = this.props.fields[index];
      if (this.props.sorting === SORTING.SIMPLE) {
        this.setState({
          sortedFields: [{field, asc}]
        });
        this.initPage(SortingService.sortByField(this.data, {field, asc}));
      } else {
        this.setState({
          sortedFields: SortingService.addToSorting(this.state.sortedFields, {field, asc})
        });
        this.initPage(SortingService.compoundSort(this.data, this.state.sortedFields));
      }
    }
  }

  removeSortingByField(field) {
    this.setState({
      sortedFields: SortingService.removeFromSorting(this.state.sortedFields, field)
    });
    this.initPage(this.data);
  }

  render() {
    if (!this.state.displayData) return null;
    return (
      <div className="smart-grid">
        <CompoundSorting sortFields={this.state.sortedFields} onRemove={this.removeSortingByField}/>
        <table>
          <Header headers={this.props.headers} sorting={!!this.props.sorting} onSorting={this.sortBy}/>
          <tbody>
          {this._showRecords()}
          </tbody>
        </table>
        <div className="smart-grid_footer">
          <ReactPaginate previousLabel={"<"}
                         nextLabel={">"}
                         breakLabel='...'
                         breakClassName={"break-me"}
                         pageCount={this.state.pageCount}
                         pageRangeDisplayed={5}
                         onPageChange={this.handlePageClick}
                         containerClassName={"smart-grid_pagination"}
                         activeClassName={"active"}/>

          <span className="smart-grid_counts">{this.data.length}</span>
        </div>
      </div>
    )
  }
}

SmartGrid.propTypes = {
  url: PropTypes.string,
  data: PropTypes.array,
  limit: PropTypes.number,
  headers: PropTypes.arrayOf(PropTypes.string),
  fields: PropTypes.arrayOf(PropTypes.string),
  idField: PropTypes.string.isRequired,
  sorting: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
};

SmartGrid.defaultProps = {
  limit: 10,
  idField: '_id',
  sorting: true
};

export default measure({
  getId: 'SmartGrid',
  Component: SmartGrid,
  isCollapsed: false,
});