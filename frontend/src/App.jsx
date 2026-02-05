import { Provider } from "react-redux";
import AppRouter from "./router/AppRouter.jsx";
import { store } from "./store/store.js";
import { ErrorBoundary } from "./common/components/ErrorBoundary";

function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary
        title="Oops! Something went wrong"
        message="We're sorry for the inconvenience. Please try reloading the page."
      >
        <AppRouter />
      </ErrorBoundary>
    </Provider>
  );
}

export default App;
