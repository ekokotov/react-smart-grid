import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {measure} from 'react-performance';
import ReactPaginate from 'react-paginate';

import {load} from './service/httpService';
import Header from './cmp/header';
import Row from './cmp/row';
import HelpRow from './cmp/helpRow';
import CompoundSorting from "./cmp/sorting";
import SortingService from './service/sortingService';
import SearchService from './service/searchService';
import PagingService from './service/pagingService';
import DataAggregator from './service/dataAggregator';
import SearchInput from './cmp/searchInput';
import {SORTING, SEARCH} from './util/const';

import './index.scss';

class SmartGrid extends PureComponent {
  constructor(props) {
    super(props);

    this.handlePageClick = this.handlePageClick.bind(this);
    this.sortBy = this.sortBy.bind(this);
    this.removeSortingByField = this.removeSortingByField.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onColumnSearch = this.onColumnSearch.bind(this);
    this.setSelected = this.setSelected.bind(this);

    this.state = {
      loading: false,
      currentPage: 0,
      sortingOptions: {},
      globalSearchStr: null
    };

    this.data = props.data || [];
    this._dataAggregator = new DataAggregator();
  }

  registerDataPipes() {
    if (this.props.search) {
      const isGlobalSearch = this.props.search === SEARCH.GLOBAL || this.props.search === true;
      let searchFields = isGlobalSearch ? this.props.fields : this.props.search;
      this._dataAggregator.registerPipe(
        this._search = new SearchService({fields: searchFields, global: isGlobalSearch})
      );
    }
    if (this.props.sorting) {
      this._dataAggregator.registerPipe(this._sorting = new SortingService({type: this.props.sorting}));
    }
    if (this.props.pageSize) {
      this._dataAggregator.registerPipe(this._paging = new PagingService({pageSize: this.props.pageSize}));
    }
  }

  componentWillMount() {
    this.registerDataPipes();
    if (this.props.url) this.loadXHRData();
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.sorting && Object.keys(this.state.sortingOptions).length) this.setState({sortingOptions: {}});
    if (nextProps.sorting !== this.props.sorting) this._sorting.sortingType = nextProps.sorting;
    if (nextProps.pageSize !== this.props.pageSize) {
      this._paging.pageSize = nextProps.pageSize;
      this.setState({currentPage: 0});
    }
  }

  loadXHRData() {
    this.setState({loading: true});
    return load(this.props.url)
      .then(data => {
        this.data = data;
        this.setState({loading: false});
      })
      .catch(console.error);
  }

  setSelected(selectedRecord) {
    this.setState({selectedId: selectedRecord[this.props.idField]});
    if (this.props.onSelect) this.props.onSelect(selectedRecord)
  }

  _showRecords(_data) {
    if (this.state.loading) return <HelpRow colspan={this.props.fields.length}>Loading...</HelpRow>;
    if (!this.state.loading && !_data.length) return <HelpRow colspan={this.props.fields.length}>No such data</HelpRow>;
    return _data.map(record => <Row onSelect={this.setSelected}
                                    key={record[this.props.idField]}
                                    recordId={record[this.props.idField]}
                                    selectedRecord={this.state.selectedId}
                                    data={record}
                                    fields={this.props.fields}/>)
  }

  handlePageClick(e) {
    this.setState({currentPage: this._paging.currentPage = e.selected});
  }

  sortBy(field) {
    this.setState({sortingOptions: this._sorting.addToSorting(field)});
  }

  removeSortingByField(field) {
    this.setState({sortingOptions: this._sorting.removeFromSorting(field)});
  }

  onSearch({search}) {
    this.setState({globalSearchStr: this._search.searchStr = search});
  }

  onColumnSearch(search) {
    this._search.mergeSearchOptions(search);
    this.setState({searchOptions: this._search.columnSearchOptions});
  }

  showPagination() {
    if (this.data.length === this.props.pageSize || !this.props.pageSize) return null;
    return <ReactPaginate previousLabel={"<"}
                          nextLabel={">"}
                          breakLabel='...'
                          breakClassName={"break-me"}
                          pageCount={this._paging.pageCount}
                          pageRangeDisplayed={5}
                          onPageChange={this.handlePageClick}
                          containerClassName={"smart-grid_pagination"}
                          activeClassName={"active"}/>
  }

  getSearchOptions() {
    if (Array.isArray(this.props.search)) {
      return {
        searchOptions: this.props.search,
        onColumnSearch: this.onColumnSearch
      }
    } else {
      return {
        searchOptions: []
      }
    }
  }

  render() {
    if (!this.data) return null;
    let {data, count} = this._dataAggregator.process({data: this.data});
    return (
      <div className="smart-grid">
        <div className="smart-grid_sorting-search">
          <CompoundSorting sortingOptions={this.state.sortingOptions} onRemove={this.removeSortingByField}/>
          {this.props.search && this._search.global && <SearchInput onSearch={this.onSearch}/>}
        </div>
        <table>
          <Header headers={this.props.headers}
                  fields={this.props.fields}
                  sortingEnabled={!!this.props.sorting}
                  sortingOptions={this.state.sortingOptions}
                  onSorting={this.sortBy}
                  {...this.getSearchOptions()}
          />
          <tbody>{this._showRecords(data)}</tbody>
        </table>
        <div className="smart-grid_footer">
          {this.showPagination()}
          <span className="smart-grid_counts">{count}</span>
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
  sorting: PropTypes.oneOf([false, true, SORTING.SIMPLE, SORTING.COMPOUND]),
  search: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  onSelect: PropTypes.func
};

SmartGrid.defaultProps = {
  pageSize: 10,
  idField: '_id',
  sorting: true,
  search: false
};

export default measure({
  getId: 'SmartGrid',
  Component: SmartGrid,
  isCollapsed: false,
});
