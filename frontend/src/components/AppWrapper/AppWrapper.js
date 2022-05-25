import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'store';
import App from 'components/App';

const AppWrapper = () => {
  return (
    <BrowserRouter>
      <Provider store={store}>
          <App />
      </Provider>
    </BrowserRouter>
  );
};

export default AppWrapper;
