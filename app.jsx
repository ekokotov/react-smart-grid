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
      pageSize: 2
    };
  }

  render() {
    return (
      <div>
        <button onClick={() => this.setState({sortingEnabled: false})}>sortingEnabled</button>
        <button onClick={() => this.setState({pageSize: 3})}>pageSize</button>
        <br/>
        <br/>
        <SmartGrid url="https://next.json-generator.com/api/json/get/VyffA6MhV"
                   pageSize={6}
                   headers={['Name', 'Age', 'Eyes', 'Phone', 'Favorite fruit']}
                   fields={['name', 'age', 'eyeColor', 'phone', 'favoriteFruit']}
                   idField="_id"
                   sorting={'compound'}/>

        <SmartGrid data={this.state.users}
                   pageSize={2}
                   headers={['Name', 'Age']}
                   fields={['name', 'age']}
                   idField="_id"
                   sorting={this.state.sortingEnabled}/>
      </div>
    )
  }
}

render(<App/>, document.getElementById('root'));