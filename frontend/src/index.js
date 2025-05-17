import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import configureStore from './store';
import rootSaga from './sagas';
import AppContainer from './containers/AppContainer';
import './index.css';
import reportWebVitals from './reportWebVitals';


const { store, persistor } = configureStore();
store.runSaga(rootSaga, store);

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <AppContainer />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

// Optional: Measure performance by passing a function to log results
reportWebVitals();