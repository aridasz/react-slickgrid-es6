import './examples.less';
import React from 'react';
import ReactDOM from 'react-dom';
import {renderGrid} from './treegrid-es5';


let grid;

window.addEventListener('resize', () => grid.resizeCanvas());


class GridWrapper extends React.Component {

  componentDidMount() {
    renderGrid();
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



