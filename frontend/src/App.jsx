import { Provider } from "react-redux";
import AppRouter from "./router/AppRouter.jsx";
import { store } from "./store/store.js";

function App() {
  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
}

export default App;
