import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../config/global';

export const fetchPizzas = createAsyncThunk('pizza/fetchPizzasStatus', async (params) => {
  const { category, search, order, currentPage, sortType } = params;
  const { data } = await axios.get(
    `${BASE_URL}pizzas?${category}&page=${currentPage}&sortBy=${sortType}&order=${order}${search}`,
  );

  return data;
});

const initialState = {
  count: 0,
  items: [],
  status: 'loading', // loading | success | error
};

export const pizzaSlice = createSlice({
  name: 'pizza',
  initialState,
  reducers: {
    setItems(state, action) {
      state.items = action.payload.data;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPizzas.pending, (state) => {
      state.status = 'loading';
      state.items = [];
    });
    builder.addCase(fetchPizzas.fulfilled, (state, action) => {
      state.status = 'success';
      state.count = action.payload.count;
      state.items = action.payload.data;
    });
    builder.addCase(fetchPizzas.rejected, (state) => {
      state.status = 'error';
      state.items = [];
    });
  },
});

export const selectCartItemById = (id) => (state) => state.cart.items.find((obj) => obj.id === id);

export const { setItems } = pizzaSlice.actions;

export default pizzaSlice.reducer;
