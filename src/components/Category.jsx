/* eslint-disable react/prefer-stateless-function */

import React from 'react';
import '../css/Category.css';
import { connect } from 'react-redux';
import _ from 'lodash';
import load from '../utils/load';
import { selectItem, loadItems } from '../actions';

const mapStateToProps = state => {
  const props = {
    appState: state.appState,
  };
  return props;
};

class Category extends React.Component {
  constructor(props) {
    super(props);
    // const { category } =
    const loadedItems = _.get(this.props, 'appState.items', null);

    if (loadedItems) {
      this.state = {
        items: loadedItems,
      };
    } else {
      this.state = {
        items: [],
      };
      this.loadItems();
    }
  }

  loadItems() {
    const url = '/data/items.json';
    return load(url).then(response => {
      const data = JSON.parse(response);
      const items = Array.isArray(data) ? data : [];
      const { dispatch } = this.props;
      dispatch(loadItems(items));
      this.setState({
        items,
      });
    });
  }

  selectItem(item) {
    const { dispatch } = this.props;
    dispatch(selectItem(item));
  }

  renderItem = (item) => {
    const { id, title } = item;
    return <div className="category-square"
        key={id}
        id={id}
        title={title}
        onClick={() => this.selectItem(item)}
      >
      <div className="category-content">
        <div className="category-table">
          <div className="category-table-cell">
            {title}
          </div>
        </div>
      </div>
    </div>;
  }

  render() {
    const { items } = this.state;

    return items.map(this.renderItem);
  }
}

export default connect(mapStateToProps)(Category);

