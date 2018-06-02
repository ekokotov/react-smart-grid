import React, {PureComponent, createRef} from 'react';
import PropTypes from 'prop-types';
import {debounce} from "../util/helpers";

class SearchInput extends PureComponent {
  constructor(props) {
    super(props);
    this.handleChange = debounce(this.handleChange.bind(this), this.props.debounceTime);
    this.clear = this.clear.bind(this);
    this.input = createRef();
  }

  handleChange() {
    this.props.onSearch({search: this.input.current.value});
  }

  clear() {
    this.input.current.value = '';
    this.handleChange();
  }

  render() {
    return (
      <div className="search">
        <input type="text" name="search" placeholder="Search" ref={this.input}
               onChange={this.handleChange}/>
        <button className="clear" onClick={this.clear}>x</button>
      </div>
    );
  }
}

SearchInput.propTypes = {
  onSearch: PropTypes.func.isRequired,
  debounceTime: PropTypes.number
};

SearchInput.defaultProps = {
  debounceTime: 300
};

export default SearchInput;
