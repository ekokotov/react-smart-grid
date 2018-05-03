import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

class Loading extends PureComponent {
  render() {
    return (
      <tr>
        <td className="loading" colSpan={this.props.colspan}>LOADING....</td>
      </tr>
    );
  }
}

Loading.propTypes = {
  colspan: PropTypes.number.isRequired
};

export default Loading;
