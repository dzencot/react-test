import _ from 'lodash';
import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import * as actions from '../actions';
import { config } from '../config';

const basket = handleActions({
  [actions.addItem](state, payload) {
    const { item, countItem } = payload.payload;
    const { items } = state;
    const oldCountItem = _.get(items, `${item.id}.countItem`, 0);
    const newCount = _.parseInt(oldCountItem) + _.parseInt(countItem);
    const newItems = { ...items, [item.id]: { item, countItem: newCount } };
    const newState = { ...state, items: newItems };
    const dataSessionStorage = JSON.stringify({ items: newItems });
    sessionStorage.setItem(config.appCode, dataSessionStorage);
    return newState;
  },
  [actions.itemCountChange](state, payload) {
    const { item } = payload.payload;
    let { countItem } = payload.payload;
    // TODO: сделать проверку наличия количества товаров
    if (countItem < 0) {
      countItem = 0;
    }
    const { items } = state;
    const newItems = { ...items, [item.id]: { item, countItem } };
    const newState = { ...state, items: newItems };
    const dataSessionStorage = JSON.stringify({ items: newItems });
    sessionStorage.setItem(config.appCode, dataSessionStorage);
    return newState;
  },
  [actions.incrementItem](state, payload) {
    // TODO: добавить проверку наличия
    const payloadItem = payload.payload;
    const { items } = state;
    const item = _.get(items, payloadItem.id);
    const newCount = (_.parseInt(item.countItem) || 0) + 1;
    item.countItem = newCount;
    return { ...state, items };
  },
  [actions.decrementItem](state, payload) {
    const payloadItem = payload.payload;
    const { items } = state;
    const item = _.get(items, payloadItem.id);
    const newCount = (_.parseInt(item.countItem) || 0) - 1;
    if (newCount > 0) {
      item.countItem = newCount;
    }
    return { ...state, items };
  },
  [actions.removeItem](state, payload) {
    const payloadItem = payload.payload;
    const { items } = state;
    const newItems = _.omit(items, payloadItem.id);
    return { ...state, items: newItems };
  },
  [actions.setEmptyBasket](state) {
    return { ...state, items: [] };
  },
}, '');

const appState = handleActions({
  [actions.selectCategory](state, payload ) {
    const category = payload.payload;
    return { ...state, currentView: 'category', category };
  },
  [actions.selectItem](state, payload) {
    const item = payload.payload;
    return { ...state, currentView: 'item', item };
  },
  [actions.returnHome](state, { payload }) {
    return { ...state,  category: false, item: false, currentView: 'categories' };
  },
  [actions.loadCategories](state, payload) {
    const categories = payload.payload;
    return { ...state, categories };
  },
  [actions.loadItems](state, payload) {
    const items = payload.payload;
    return { ...state, items };
  },
}, '');

export default combineReducers({
  basket,
  appState,
});
