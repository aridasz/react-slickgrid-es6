import './examples.less';
import React from 'react';
import ReactDOM from 'react-dom';

import createHistory from 'history/createBrowserHistory';

const history = createHistory();
const router = {};

const examples = new Array(8).join(',').split(',');
let grid;

window.addEventListener('resize', () => grid.resizeCanvas());

const nav = ({pathname}) => {
  const route = router[pathname] || router[Object.keys(router)[0]];
  if (route){
    grid = route.init('#myGrid');
    document.title = route.title;
  }
};

history.listen(nav);

const menuEl = document.querySelector('.menu-container .menu');

class Menu extends React.Component {

  render(){
    return <ul className="menu-list">
      {this.props.examples.map((item, index) => {
        const count = index + 1;
        const example = require(`./example${count}`).default;
        router[example.route] = example;

        return <li key={count}>
          <a className="demo-link" href={example.route}>{example.title}</a>
        </li>;
      })}
    </ul>;
  }
};
console.log(examples);
ReactDOM.render(<Menu examples={examples} />, menuEl);

//const menuGrid = document.querySelector('.menu-container .menugrid');
//ReactDOM.render(<Menu examples={examples} />, menuGrid);

nav(history.location);

