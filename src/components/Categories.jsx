/* eslint-disable react/prefer-stateless-function */

import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import load from '../utils/load';
import { selectCategory, loadCategories } from '../actions';

const mapStateToProps = state => {
  const props = {
    appState: state.appState,
  };
  return props;
};

class Categories extends React.Component {
  constructor(props) {
    super(props);
    const loadedCategories = _.get(this.props, 'appState.categories', null);

    if (loadedCategories) {
      this.state = {
        categories: loadedCategories,
      };
    } else {
      this.state = {
        categories: [],
      };
      this.loadCategories();
    }
  }

  loadCategories() {
    const url = '/data/categories.json';
    return load(url).then(response => {
      console.log('categories loaded');
      const data = JSON.parse(response);
      const categories = Array.isArray(data) ? data : [];
      const { dispatch } = this.props;
      dispatch(loadCategories(categories));
      this.setState({
        categories,
      });
    });
  }

  selectCategory(category) {
    const { dispatch } = this.props;
    dispatch(selectCategory(category));
  }

  renderCategory = (category) => {
    const { id, title } = category;
    return <div className="category-square"
        key={id}
        id={id}
        title={title}
        onClick={() => this.selectCategory(category)}
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
    const { categories } = this.state;

    return categories.map(this.renderCategory);
  }
}

export default connect(mapStateToProps)(Categories);
