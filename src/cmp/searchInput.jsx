import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {debounce} from "../util/helpers";

class SearchInput extends PureComponent {
  constructor(props) {
    super(props);
    this.handleChange = debounce(this.handleChange.bind(this), this.props.debouceTime);
    this.clear = this.clear.bind(this);
    this.input = null;
    this.state = {
      search: null
    };
  }

  handleChange() {
    this.props.onSearch({search: this.input.value});
  }

  clear() {
    this.input.value = '';
    this.handleChange();
  }

  render() {
    return (
      <div className="search">
        <input type="text" name="search" placeholder="Search" ref={input => this.input = input}
               onChange={this.handleChange}/>
        <button className="clear" onClick={this.clear}>x</button>
      </div>
    );
  }
}

SearchInput.propTypes = {
  onSearch: PropTypes.func.isRequired,
  debouceTime: PropTypes.number
};

SearchInput.defaultProps = {
  debouceTime: 300
};

export default SearchInput;
