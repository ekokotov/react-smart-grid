import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

class HelpRow extends PureComponent {
  render() {
    return (
      <tr>
        <td className="loading" colSpan={this.props.colspan}>{this.props.children}</td>
      </tr>
    );
  }
}

HelpRow.propTypes = {
  colspan: PropTypes.number.isRequired
};

export default HelpRow;
