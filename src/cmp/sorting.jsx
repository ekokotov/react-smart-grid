import React, {Component} from 'react';
import PropTypes from 'prop-types';

const SORTING_BADGE_CLASS = 'sorting_remove';

class CompoundSorting extends Component {
  constructor(props) {
    super(props);
    this.removeSortingByField = this.removeSortingByField.bind(this);
  }

  removeSortingByField(e) {
    if (e.target.className !== SORTING_BADGE_CLASS || !e.target.dataset.field) return;
    this.props.onRemove(e.target.dataset.field);
  }

  render() {
    if (!this.props.sortFields.length) return null;
    return (
      <ul onClick={this.removeSortingByField} className="smart-grid_sorting">
        {this.props.sortFields.map(sort => <li key={sort.field} className={sort.asc}>
          {sort.field}
          <button data-field={sort.field} className={SORTING_BADGE_CLASS}>x</button>
        </li>)}
      </ul>
    );
  }
}

CompoundSorting.propTypes = {
  sortFields: PropTypes.arrayOf(PropTypes.shape({
    field: PropTypes.string.isRequired,
    asc: PropTypes.string.isRequired
  })).isRequired,
  onRemove: PropTypes.func.isRequired
};

export default CompoundSorting;
