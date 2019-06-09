import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import App from './components/App';
import reducers from './reducers/';

const store = createStore(reducers, applyMiddleware(thunk));

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('container'),
);
// store.subscribe(() => {
//   const state = store.getState();
//   ReactDOM.render(
//     <App dispath={store.dispatn} />,
//     document.getElementById('container'),
//   );
// });

// ReactDOM.render(
//   <App dispath={store.dispatn} />,
//   document.getElementById('container'),
// );
