import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import '../css/App.css';
import Categories from './Categories';
import Category from './Category';
import Item from './Item';
import Basket from './Basket';
import { returnHome, selectCategory } from '../actions';


const mapStateToProps = state => {
  const props = {
    appState: state.appState,
  };
  return props;
};

class App extends React.Component {
  getView(appState) {
    const { currentView } = appState;
    console.log('current view:');
    console.log(currentView);
    const views = {
      categories: () => {
        return <Categories />;
      },
      category: () => {
        const { id } = appState.category;
        return <Category id={id} />;
      },
      item: () => {
        return <Item />;
      }
    };

    return views[currentView] ? views[currentView] : views.categories;
  }

  goToHome = () => {
    const { dispatch } = this.props;
    dispatch(returnHome());
  };

  goToItems = (category) => {
    const { dispatch } = this.props;
    dispatch(selectCategory(category));
  };

  renderNavigation(appState = {}) {
    const category = _.get(appState, 'category');
    const item = _.get(appState, 'item');
    const renderNavCategory = () => {
      if (category) {
        return <a className="nav" onClick={this.goToHome}>Перейти к выбору категорий</a>;
      }
      return '';
    };
    const renderNavItem = () => {
      if (item) {
        return <a className="nav" onClick={() => this.goToItems(category)}>Перейти к выбору товаров</a>;
      }
      return '';
    };
    return <div className="navigation">
      {renderNavCategory()}{renderNavItem()}
    </div>
  }

  renderInfo(appState = {}) {
    const category = _.get(appState, 'category');
    const item = _.get(appState, 'item');
    const renderInfoCategory = () => {
      if (category) {
        return <span className="info-text">/{category.title}</span>;
      }
      return '';
    };
    const renderInfoItem = () => {
      if (item) {
        return <span className="info-text">/{item.title}</span>;
      }
      return '';
    };
    return <div className="info">
      <div className="title">Добро пожаловать в наш магазин</div>
      <br />
      {this.renderNavigation(appState)}
      {renderInfoCategory()}{renderInfoItem()}
    </div>
  }

  renderBusket() {
    return <Basket />;
  }

  render() {
    const { appState } = this.props;
    // const { currentView } = appState;

    return (
      <div className='App'>
        {this.renderInfo(appState)}
        {this.renderBusket()}
        <hr />
        {this.getView(appState)()}
      </div>
    );
  }
}

export default connect(mapStateToProps)(App);
