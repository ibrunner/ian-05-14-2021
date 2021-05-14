import React from "react";
import "../styles/App.css";
import useOrderData from "../util/useOrderData";
import groupedOrderReducer from "../util/groupedOrderReducer";
import GroupConfig from "./GroupConfig";
import OrderList from "./OrderList";

function App() {
  const [state, dispatch] = React.useReducer(groupedOrderReducer, {
    asks: [],
    bids: [],
    groupSize: 1,
  });
  const { orderSet, error } = useOrderData();

  const { groupSize, asks, bids } = state;

  React.useEffect(() => {
    dispatch({ type: "ORDER_SET_UPDATED", orderSet });
  }, [orderSet]);
  if (error) {
    return (
      <div className="error-container">
        <div className="error">Error Connecting to API</div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="layout-container center washed-yellow flex">
        <GroupConfig
          groupSize={groupSize}
          onIncrease={() =>
            dispatch({ type: "GROUP_SIZE_INCREASED", orderSet })
          }
          onDecrease={() =>
            dispatch({ type: "GROUP_SIZE_DECREASED", orderSet })
          }
        />
        <div className="orders-container">
          <OrderList orderType="bids" orders={bids} />
          <OrderList orderType="asks" orders={asks} />
        </div>
      </div>
    </div>
  );
}

export default App;
