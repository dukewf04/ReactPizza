import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  totalPrice: 0,
  items: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      const findItem = state.items.find((obj) => obj.id === action.payload.id);

      if (findItem) {
        findItem.count++;
      } else {
        state.items.push({
          ...action.payload,
          count: 1,
        });
      }
      state.totalPrice += action.payload.price;
    },
    minusItem(state, action) {
      const findItem = state.items.find((obj) => obj.id === action.payload.id);

      findItem.count--;
      state.totalPrice -= action.payload.price;
    },
    removeItem(state, action) {
      const deletedItem = state.items.find((obj) => obj.id === action.payload);
      state.totalPrice -= deletedItem.price * deletedItem.count;
      state.items = state.items.filter((obj) => obj.id !== action.payload);
    },
    clearItems(state) {
      state.items = [];
      state.totalPrice = 0;
    },
  },
});

// Создаем селектор для Cart
export const selectCart = (state) => state.cart;

export const { addItem, removeItem, clearItems, minusItem } = cartSlice.actions;

export default cartSlice.reducer;
