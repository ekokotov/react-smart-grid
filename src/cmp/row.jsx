import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Cell from './cell';

class Row extends PureComponent {
  render() {
    return (
      <tr>
        {this.props.fields.map(field => <Cell key={field} data={this.props.data[field]}/>)}
      </tr>
    );
  }
}

Row.propTypes = {
  data: PropTypes.object.isRequired,
  fields: PropTypes.arrayOf(PropTypes.string)
};

export default Row;
