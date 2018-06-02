import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Cell from './cell';

class Row extends PureComponent {
  constructor(props) {
    super(props);
    this.onRowClick = this.onRowClick.bind(this);
  }

  onRowClick(e) {
    this.props.onSelect(this.props.data);
  }

  render() {
    return (
      <tr onClick={this.onRowClick} className={classNames('smart-grid__row', {
        'smart-grid__row--selected': this.props.selectedRecord === this.props.recordId
      })}>
        {this.props.fields.map(field => <Cell key={field} data={this.props.data[field]}/>)}
      </tr>
    );
  }
}

Row.propTypes = {
  data: PropTypes.object.isRequired,
  onSelect: PropTypes.func,
  fields: PropTypes.arrayOf(PropTypes.string),
  recordId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  selectedRecord: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default Row;
