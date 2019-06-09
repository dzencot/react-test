/* eslint-disable react/prefer-stateless-function */

import React from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';
import '../css/Item.css';
import getDescriptionItem from '../utils/getDescriptionItem';
import _ from 'lodash';
import { addItem } from '../actions';

const mapStateToProps = state => {
  const props = {
    appState: state.appState,
  };
  return props;
};

class Item extends React.Component {
  constructor(props) {
    super(props);
    const { item } = props.appState;
    this.state = {
      item,
      error: false,
      errorText: '',
      countItem: 1,
      viewCount: 1,
    };
  }

  validator(countItem) {
    const errors = {
      subZero: 'Нельзя вводить отрицательное значение',
      overCount: 'Количество товара превышает максимум',
    };
    const currentItemCounts = this.state.item.quantity;
    if (countItem < 0) {
      this.setState({ error: true, errorText: errors.subZero });
      return false;
    } else if (countItem > currentItemCounts) {
      this.setState({ error: true, errorText: errors.overCount });
      return false;
    }
    this.setState({ error: false, errorText: '' });
    return true;
  }

  inputChange = (event) => {
    const countItem = event.target.value;
    const noError = this.validator(countItem);
    if (noError) {
      this.setState({ countItem: countItem, viewCount: countItem });
    } else {
      this.setState({ viewCount: countItem });
    }
  };

  incrementCount = () => {
    const newCount = _.toInteger(this.state.viewCount) + 1;
    const noError = this.validator(newCount);
    if (noError) {
      this.setState({
        countItem: newCount, viewCount: newCount
      });
    } else {
      this.setState({ viewCount: newCount });
    }
  };

  decrementCount = () => {
    const newCount = _.toInteger(this.state.viewCount) - 1;
    const noError = this.validator(newCount);
    if (noError) {
      this.setState({
        countItem: newCount, viewCount: newCount
      });
    } else {
      this.setState({ viewCount: newCount });
    }
  };

  addItem = () => {
    const { item, countItem } = this.state;
    const { dispatch } = this.props;
    dispatch(addItem({ item, countItem }));
  };

  render() {
    const { item, error, errorText, viewCount } = this.state;
    const description = item.description || getDescriptionItem();
    const imgStyle = {
      height: '100px',
      width: '400px',
    };
    const inputErrorClasses = cn({
      'item-count-input-error': true,
      hidden: !error,
    });
    return (
      <div className="item">
        <div className="item-header">
          <img style={imgStyle} />
          <div className="item-form-buy">
            <div className="item-count">
              <input className="item-count-input" type="number" onChange={this.inputChange} value={viewCount} />
              <div className="item-count-buttons">
                <div className="item-count-button">
                  <button className="item-count-button item-count-increment"
                  onClick={this.incrementCount}>
                    <div className="arrow-up" />
                  </button>
                </div>
                <div className="item-count-button">
                  <button className="item-count-button item-count-decrement"
                  onClick={this.decrementCount}>
                    <div className="arrow-down" />
                  </button>
                </div>
              </div>
            </div>
            <div className={inputErrorClasses}>{errorText}</div>
            <button className="item-buy-button" onClick={this.addItem}>Купить</button>
          </div>
        </div>
        <div className="item-title">
          {item.title}
        </div>
        <div className="item-description">
          {description}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Item);
