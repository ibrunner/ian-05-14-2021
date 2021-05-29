import React from "react";
import "../styles/App.css";
import OrderBook from "./OrderBook";
import OrderTotals from "./OrderTotals";
import useOrderData, { OrderContext } from "../util/useOrderData";

function App() {
  const [showOrderBook, setShowOrderBook] = React.useState<boolean>(true);
  const [showOrderTotals, setShowOrderTotals] = React.useState<boolean>(false);
  const orderData = useOrderData();

  const toggleOrderBook = () => {
    setShowOrderBook(!showOrderBook);
  };

  const toggleOrderTotals = () => {
    setShowOrderTotals(!showOrderTotals);
  };

  return (
    <OrderContext.Provider value={orderData}>
      <div>
        <button onClick={toggleOrderTotals}>
          {showOrderTotals ? "Hide Order Totals" : "Show Order Totals"}
        </button>
        {showOrderTotals && <OrderTotals />}
      </div>
      <div>
        <button onClick={toggleOrderBook}>
          {showOrderBook ? "Hide Order Book" : "Show Order Book"}
        </button>
        {showOrderBook && <OrderBook />}
      </div>
    </OrderContext.Provider>
  );
}

export default App;
