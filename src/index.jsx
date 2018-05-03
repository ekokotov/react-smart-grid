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
      sortingOptions: {}
    };

    this.data = props.data || [];
  }

  componentDidMount() {
    if (this.props.url) this.loadXHRData();
    if (this.props.data && this.props.data.length) this.initPage(this.props.data);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.sorting && Object.keys(this.state.sortingOptions).length) {
      this.setState({sortingOptions: {}});
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

  sortBy(field) {
    let sortingOptions = SortingService.addToSorting(this.state.sortingOptions, field);
    this.setState({sortingOptions});
    this.initPage(SortingService.sort(this.props.sorting, this.data, sortingOptions));
  }

  removeSortingByField(field) {
    this.setState({
      sortingOptions: SortingService.removeFromSorting(this.state.sortingOptions, field)
    });
    this.initPage(this.data);
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
                  sortingOption={this.state.sortingOptions}
                  onSorting={this.sortBy}/>
          <tbody>{this._showRecords()}</tbody>
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
  sorting: PropTypes.oneOf([false, true, SORTING.SIMPLE, SORTING.COMPOUND])
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