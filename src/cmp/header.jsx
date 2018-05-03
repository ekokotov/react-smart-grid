import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import HeaderCell from './headerCell';

class Header extends PureComponent {
  constructor(props) {
    super(props);
    this.sortingProps = {
      sorting: false,
      onSorting: null
    };
  }

  getSortingProps() {
    return this.props.sorting ? {
      sorting: this.props.sorting,
      onSorting: this.props.onSorting
    } : null;
  }

  render() {
    return (
      <thead>
      <tr>
        {this.props.headers.map(header => <HeaderCell
          key={header.toLowerCase()}
          title={header}
          {...this.getSortingProps()}/>
        )}
      </tr>
      </thead>
    );
  }
}

Header.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.string),
  sorting: PropTypes.bool,
  onSorting: PropTypes.func
};

Header.defaultProps = {
  sorting: true
};

export default Header;
