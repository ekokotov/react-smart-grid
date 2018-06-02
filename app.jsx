import React, {Component} from 'react';
import {render} from 'react-dom';
import SmartGrid from './src/index';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      users: [
        {_id: 0, name: 'yauheni', age: 29},
        {_id: 1, name: 'kokatau', age: 30},
        {_id: 3, name: 'pavel', age: 21},
      ],
      sortingEnabled: true,
      pageSize: 2,
      search: true
    };
  }

  render() {
    return (
      <div>
        <button onClick={() => this.setState({sortingEnabled: !this.state.sortingEnabled})}>sortingEnabled</button>
        <button onClick={() => this.setState({pageSize: 0})}>pageSize</button>
        <button onClick={() => this.setState({search: !this.state.search})}>search</button>
        <br/>
        <br/>
        <SmartGrid url="https://next.json-generator.com/api/json/get/4k6xmJ21r"
                   pageSize={5}
                   headers={['Name', 'Age', 'Eyes', 'Phone', 'Favorite fruit']}
                   fields={['name', 'age', 'eyeColor', 'phone', 'favoriteFruit']}
                   idField="_id"
                   sorting={'compound'}
                   search={'global'}
                   onSelect={data => console.log(data)}
        />

        <SmartGrid data={this.state.users}
                   pageSize={2}
                   headers={['Name', 'Age']}
                   fields={['name', 'age']}
                   idField="_id"
                   sorting={this.state.sortingEnabled}
                   search={['name', 'age']}
        />
      </div>
    )
  }
}

render(<App/>, document.getElementById('root'));
