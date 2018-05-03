import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

class HeaderCell extends PureComponent {
  constructor(props) {
    super(props);
    this.sortHandler = this.sortHandler.bind(this);
    this.state = {
      sortingOrder: ''
    };
  }

  sortHandler() {
    let newOrder = this.state.sortingOrder === 'asc' ? 'desc' : 'asc';
    this.setState({sortingOrder: newOrder});
    this.props.onSorting(this.props.title, newOrder);
  }

  getSortingProps() {
    return this.props.sorting ? {
      className: `sorting ${this.state.sortingOrder}`,
      onClick: this.sortHandler
    } : null;
  }

  render() {
    return (
      <th {...this.getSortingProps()}>
        {this.props.title}
      </th>
    );
  }
}

HeaderCell.propTypes = {
  title: PropTypes.string.isRequired,
  sorting: PropTypes.bool,
  onSorting: PropTypes.func
};

export default HeaderCell;
