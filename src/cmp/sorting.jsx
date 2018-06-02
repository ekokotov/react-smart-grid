import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

const SORTING_BADGE_CLASS = 'sorting_remove';

class CompoundSorting extends PureComponent {
  constructor(props) {
    super(props);
    this.removeSortingByField = this.removeSortingByField.bind(this);
  }

  removeSortingByField(e) {
    if (e.target.className !== SORTING_BADGE_CLASS || !e.target.dataset.field) return;
    this.props.onRemove(e.target.dataset.field);
  }

  render() {
    let sortingFields = Object.keys(this.props.sortingOptions);
    if (!sortingFields.length) return null;
    return (
      <ul onClick={this.removeSortingByField} className="smart-grid_sorting">
        {sortingFields.map(property => <li key={property}
                                           className={this.props.sortingOptions[property] === 1 ? 'asc': 'desc'}>
          {property}
          <button data-field={property} className={SORTING_BADGE_CLASS}>x</button>
        </li>)}
      </ul>
    );
  }
}

CompoundSorting.propTypes = {
  sortingOptions: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired
};

export default CompoundSorting;
