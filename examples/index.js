import './examples.less';
import React from 'react';
import ReactDOM from 'react-dom';
import {default as gridcomponent} from './treegrid';


const examples = new Array(8).join(',').split(',');
let grid;

window.addEventListener('resize', () => grid.resizeCanvas());


class GridWrapper extends React.Component {

  componentDidMount() {
    grid = gridcomponent.init('#myGrid');
  }

  componentWillUnmount() {
    
  }

  render(){
    return <div></div>;
  }
};

ReactDOM.render(<GridWrapper/>, document.querySelector('#myGrid'));

//const gridcomponent = require(`./treegrid`).default;
//grid = gridcomponent.init('#myGrid');



