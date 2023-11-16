import { createSlice } from '@reduxjs/toolkit';
import { navigate } from "@reach/router";
import {get,set} from "local-storage";
import colors from '../../data/colors.json';
import data from '../../data/records.json';
const slugify = require('slugify');


// Combine colors and other data together
const records = data.records.map((record, ind) => {
  // Add colors
  record.colors = colors[record.image];
  // Add slug
  record.slug = slugify(record.title, {
    lower: true,
    strict: true,
  });
  return record
})

export const getRecordsData = () => records;

export const app = createSlice({
  name: 'app',
  initialState: {
    allRecords: records,
    filter: 'all', // all | newest | recent | top
    tab: 0,
    sideMenuOpen: false,
    sideMenuContent: false,
    currentRecord: false,
  },
  reducers: {
    changePage: (state, action) => {
      navigate(`/${action.payload}`);
    },
    setSideMenu: (state, action) => {
      state.sideMenuOpen = action.payload.open;
      state.sideMenuContent = action.payload.content;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setData: (state, action) => {
      //console.log(action.payload)
      state.currentRecord = state.allRecords.filter((record)=> record.slug === action.payload.location)[0];
    },
    setTab: (state, action) => {
      state.tab = action.payload;
    }
  }, 
});

export const { 
  changePage, 
  setSideMenu, 
  setDarkMode, 
  setFilter, 
  setData,
  setTab
} = app.actions;

// Selectors
export const selectMenuOpen = state => state.app.sideMenuOpen;
export const selectMenuContent = state => state.app.sideMenuContent;

export const selectFilter = state => state.app.filter;

export const selectRecords = state => {
  if (state.app.filter === 'all') {
    return state.app.allRecords
  } else {
    return state.app.allRecords.filter((record)=>record.categories.includes(state.app.filter))
  }
}

export const selectRecord = state => state.app.currentRecord;
export const selectTab = state => state.app.tab;


// Export reducer by default
export default app.reducer;
