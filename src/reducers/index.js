import _ from 'lodash';
import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import * as actions from '../actions';
import { config } from '../config';

const basket = handleActions({
  [actions.addItem](state, { payload }) {
    const { item } = payload;
    const { countItem } = payload;
    const { items } = state;
    const oldCountItem = _.get(items, `${item.id}.countItem`, 0);
    let newCount = _.parseInt(oldCountItem) + _.parseInt(countItem);
    // TODO: сделать вывод ошибок
    if (newCount <= 0) {
      return state;
    }
    if (newCount > _.parseInt(item.quantity)) {
      newCount = item.quantity;
    }
    const newItems = { ...items, [item.id]: { item, countItem: newCount } };
    const newState = { ...state, items: newItems };
    const dataSessionStorage = JSON.stringify({ items: newItems });
    sessionStorage.setItem(config.appCode, dataSessionStorage);
    return newState;
  },
  [actions.itemCountChange](state, { payload }) {
    const { item } = payload;
    let { countItem } = payload;
    if (_.parseInt(countItem) < 0) {
      countItem = 0;
    }
    if (_.parseInt(countItem) > _.parseInt(item.quantity)) {
      countItem = item.quantity;
    }
    const { items } = state;
    const newItems = { ...items, [item.id]: { item, countItem } };
    const newState = { ...state, items: newItems };
    const dataSessionStorage = JSON.stringify({ items: newItems });
    sessionStorage.setItem(config.appCode, dataSessionStorage);
    return newState;
  },
  [actions.incrementItem](state, { payload }) {
    const payloadItem = payload;
    const { items } = state;
    const item = _.get(items, payloadItem.id);
    let newCount = (_.parseInt(item.countItem) || 0) + 1;
    if (newCount > _.parseInt(item.item.quantity)) {
      newCount = item.item.quantity;
    }
    item.countItem = newCount;
    return { ...state, items };
  },
  [actions.decrementItem](state, { payload }) {
    const payloadItem = payload;
    const { items } = state;
    const item = _.get(items, payloadItem.id);
    const newCount = (_.parseInt(item.countItem) || 0) - 1;
    if (newCount > 0) {
      item.countItem = newCount;
    }
    return { ...state, items };
  },
  [actions.removeItem](state, { payload }) {
    const payloadItem = payload;
    const { items } = state;
    const newItems = _.omit(items, payloadItem.id);
    return { ...state, items: newItems };
  },
  [actions.setEmptyBasket](state) {
    sessionStorage.removeItem(config.appCode);
    return { ...state, items: [] };
  },
}, '');

const appState = handleActions({
  [actions.selectCategory](state, { payload } ) {
    const category = payload;
    return { ...state, currentView: 'category', category };
  },
  [actions.selectItem](state, { payload }) {
    const item = payload;
    return { ...state, currentView: 'item', item };
  },
  [actions.returnHome](state) {
    return { ...state,  category: false, item: false, currentView: 'categories' };
  },
  [actions.loadCategories](state, { payload }) {
    const categories = payload;
    return { ...state, categories };
  },
  [actions.loadItems](state, { payload }) {
    const items = payload;
    return { ...state, items };
  },
}, '');

export default combineReducers({
  basket,
  appState,
});
