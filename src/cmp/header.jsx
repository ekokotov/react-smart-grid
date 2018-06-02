import React, {PureComponent, Fragment} from 'react';

import PropTypes from 'prop-types';
import HeaderCell from './headerCell';
import {debounce} from "../util/helpers";
import SearchInput from "./searchInput";

class Header extends PureComponent {
  constructor(props) {
    super(props);
    this.sortHandler = this.sortHandler.bind(this);
    this.onSearch = debounce(this.onSearch.bind(this), props.debounceTime);
  }

  getSortingProps() {
    return this.props.sortingEnabled ? {
      sortingOptions: this.props.sortingOptions
    } : null;
  }

  getSortingEvents() {
    return this.props.sortingEnabled ? {
      onClick: this.sortHandler
    } : null;
  }

  sortHandler(e) {
    e.stopPropagation();
    let field = e.target.dataset.field;
    if (field) {
      this.props.onSorting(field);
    }
  }

  onSearch(index, searchStr) {
    this.props.onColumnSearch({[this.props.fields[index]]: searchStr});
  }

  render() {
    return (
      <Fragment>
        <thead>
        <tr {...this.getSortingEvents()}>
          {
            this.props.headers.map((header, index) => <HeaderCell
              key={header}
              headerName={header}
              fieldName={this.props.fields[index]}
              {...this.getSortingProps()}
            />)}
        </tr>
        </thead>
        {
          this.props.onColumnSearch && <thead>
          <tr>
            {
              this.props.headers.map((header, index) =>
                <th key={header}>
                  <input type="text" placeholder="search"
                         className="header__search"
                         onInput={event => this.onSearch(index, event.target.value)}/>
                </th>
              )}
          </tr>
          </thead>
        }
      </Fragment>
    )
  }
}

Header.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.string),
  fields: PropTypes.arrayOf(PropTypes.string),
  onSorting: PropTypes.func,
  onColumnSearch: PropTypes.func,
  sortingOptions: PropTypes.object,
  sortingEnabled: PropTypes.bool,
  searchOptions: PropTypes.array,
  debounceTime: PropTypes.number
};

SearchInput.defaultProps = {
  debounceTime: 300
};

export default Header;
