import { createAction } from 'redux-actions';

export const addItem = createAction('ITEM_ADD');
export const removeItem = createAction('ITEM_REMOVE');

export const selectCategory = createAction('CATEGORY_SELECT');
export const selectItem = createAction('ITEM_SELECT');
export const returnHome = createAction('RETURN_HOME');

export const loadCategories = createAction('CATEGORIES_LOAD');

export const loadItems = createAction('ITEMS_LOAD');

export const incrementItem = createAction('ITEM_INCREMENT');
export const decrementItem = createAction('ITEM_DECREMENT');

