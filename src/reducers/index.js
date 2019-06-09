import _ from 'lodash';
import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import * as actions from '../actions';

const basket = handleActions({
  [actions.addItem](state, payload) {
    // TODO: сделать сохранение корзины в сессии
    const { item, countItem } = payload.payload;
    const { items } = state;
    const newItems = { ...items, [item.id]: { item, countItem } };
    const newState = { ...state, items: newItems };
    return newState;
  },
  [actions.incrementItem](state, payload) {
    // TODO: добавить проверку наличия
    const payloadItem = payload.payload;
    const { items } = state;
    const item = _.get(items, payloadItem.id);
    const newCount = _.parseInt(item.countItem) + 1;
    item.countItem = newCount;
    return { ...state, items };
  },
  [actions.decrementItem](state, payload) {
    // TODO: добавить проверку если количество 0 или ниже
    const payloadItem = payload.payload;
    const { items } = state;
    const item = _.get(items, payloadItem.id);
    const newCount = _.parseInt(item.countItem) - 1;
    item.countItem = newCount;
    return { ...state, items };
  },
  [actions.removeItem](state, payload) {
    const payloadItem = payload.payload;
    const { items } = state;
    const newItems = _.omit(items, payloadItem.id);
    return { ...state, items: newItems };
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
