import React from "react";
import "../styles/App.css";
import OrderBook from "./OrderBook";
import useOrderData, {OrderContext} from "../util/useOrderData";

function App() {
  const orderData = useOrderData();
  return (
    <OrderContext.Provider value={orderData}>
      <OrderBook />
    </OrderContext.Provider>
  );
}

export default App;
