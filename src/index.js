import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ThemeProvider } from "styled-components";
import {lightTheme,GlobalStyles } from "./styles";
import Reducer from './redux/_reducers';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware,compose  } from 'redux';
// import promiseMiddleware from 'redux-promise';
// import ReduxThunk from 'redux-thunk';
import { BrowserRouter } from "react-router-dom";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from 'redux-persist/integration/react';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage
}
const persisted = persistReducer(persistConfig, Reducer)
const store = createStore(persisted, compose(
  process.env.NODE_ENV !== 'production' && 
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
)
)
const persistor = persistStore(store)

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <ThemeProvider theme={lightTheme}>
      <GlobalStyles />
      <PersistGate persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        </PersistGate>
      </ThemeProvider>
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

