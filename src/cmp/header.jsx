import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import HeaderCell from './headerCell';

class Header extends PureComponent {
  constructor(props) {
    super(props);
    this.sortHandler = this.sortHandler.bind(this);
  }

  getSortingProps() {
    return this.props.sortingEnabled ? {
      sortingOptions: this.props.sortingOptions,
    } : null;
  }

  getSortingEvents() {
    return this.props.sortingEnabled ? {
      onClick: this.sortHandler
    } : null;
  }

  sortHandler(e) {
    let field = e.target.dataset.field;
    if (field) {
      e.stopPropagation();
      this.props.onSorting(field);
    }
  }

  render() {
    return (
      <thead>
      <tr {...this.getSortingEvents()}>
        {
          this.props.headers.map((header, index) => <HeaderCell
            key={header.toLowerCase()}
            headerName={header}
            fieldName={this.props.fields[index]}
            {...this.getSortingProps()}/>)
        }
      </tr>
      </thead>
    );
  }
}

Header.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.string),
  fields: PropTypes.arrayOf(PropTypes.string),
  onSorting: PropTypes.func,
  sortingOptions: PropTypes.object
};

export default Header;
