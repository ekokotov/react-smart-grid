import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

class HeaderCell extends PureComponent {
  constructor(props) {
    super(props);
    this.getSortingClass = this.getSortingClass.bind(this);
  }

  getSortingClass() {
    let {sortingOptions, fieldName} = this.props;
    if (!sortingOptions || !sortingOptions.hasOwnProperty(fieldName)) return '';
    else return sortingOptions[fieldName] === 1 ? 'asc' : 'desc';
  }

  render() {
    return (
      <th data-field={this.props.fieldName} className={`sorting ${this.getSortingClass()}`}>
        {this.props.headerName}
      </th>
    );
  }
}

HeaderCell.propTypes = {
  headerName: PropTypes.string.isRequired,
  fieldName: PropTypes.string.isRequired,
  sortingOptions: PropTypes.object
};

export default HeaderCell;
