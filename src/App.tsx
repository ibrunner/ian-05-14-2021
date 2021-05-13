import React from "react";
import "./App.css";
import useOrderData from "./util/useOrderData";
import groupedOrderReducer from "./groupedOrderReducer";
import { GroupedOrder } from "./types";
import { groupSizes } from "./common";

function App() {
  const [state, dispatch] = React.useReducer(groupedOrderReducer, {
    asks: [],
    bids: [],
    groupSize: 1,
  });
  const orderSet = useOrderData();

  const { groupSize, asks, bids } = state;

  React.useEffect(() => {
    dispatch({ type: "ORDER_SET_UPDATED", orderSet });
  }, [orderSet]);

  return (
    <div className="container">
      <div className="group-config">
        <button
          onClick={() => dispatch({ type: "GROUP_SIZE_DECREASED", orderSet })}
          disabled={groupSize === groupSizes[0]}
        >
          -
        </button>
        Group: {groupSize}
        <button
          onClick={() => dispatch({ type: "GROUP_SIZE_INCREASED", orderSet })}
          disabled={groupSize === groupSizes[groupSizes.length - 1]}
        >
          +
        </button>
      </div>
      <div
        className="orders bids"
      >
        <table>
          <TableHeader />
          <tbody>
            {bids.map(({ price, ...rest }) => {
              return <OrderRow {...rest} price={price} key={price} />;
            })}
          </tbody>
        </table>
      </div>
      <div
        className="orders asks"
      >
        <table>
          <TableHeader />
          <tbody>
            {asks.map(({ price, ...rest }) => {
              return <OrderRow {...rest} price={price} key={price} />;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;

interface OrderRowProps extends GroupedOrder {}

function OrderRow({ price, size, total }: OrderRowProps) {
  return (
    <tr>
      <td>{price}</td>
      <td>{size}</td>
      <td>{total}</td>
    </tr>
  );
}

function TableHeader() {
  return (
    <thead>
      <tr>
        <th className="price">Price</th>
        <th className="size">Size</th>
        <th className="total">Total</th>
      </tr>
    </thead>
  );
}
