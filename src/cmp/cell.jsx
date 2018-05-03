import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

class Cell extends PureComponent {
  render() {
    return (
      <td>{this.props.data}</td>
    );
  }
}

Cell.propTypes = {
  data: PropTypes.any.isRequired
};

export default Cell;
