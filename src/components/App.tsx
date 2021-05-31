import "../styles/App.css";
import OrderBook from "./OrderBook";
import useIsVisible from "../util/useIsVisible"

function App() {
  const visible = useIsVisible();
  if(visible) {
    return <OrderBook />
  }
  return null;
}

export default App;
