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
  const { orderSet, error } = useOrderData();

  const { groupSize, asks, bids } = state;

  React.useEffect(() => {
    dispatch({ type: "ORDER_SET_UPDATED", orderSet });
  }, [orderSet]);
  console.log("error", error);
  if (error) {
    return (
      <div className="error-container">
        <div className="error">Error Connecting to API</div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="orders-container center washed-yellow flex">
        <div className="group-config">
          <button
            onClick={() => dispatch({ type: "GROUP_SIZE_DECREASED", orderSet })}
            disabled={groupSize === groupSizes[0]}
          >
            -
          </button>
          <div className="group-config-label">
            Group: <span className="group-config-size">{groupSize}</span>
          </div>
          <button
            onClick={() => dispatch({ type: "GROUP_SIZE_INCREASED", orderSet })}
            disabled={groupSize === groupSizes[groupSizes.length - 1]}
          >
            +
          </button>
        </div>
        <TableHeader title="Bids" />
        <div className="orders bids">
          <table>
            <tbody>
              {bids.map(({ price, ...rest }) => {
                return (
                  <OrderRow
                    {...rest}
                    price={price}
                    key={price}
                    color="light-green"
                  />
                );
              })}
            </tbody>
          </table>
        </div>
        <TableHeader title="Asks" />
        <div className="orders asks">
          <table>
            <tbody>
              {asks.map(({ price, ...rest }) => {
                return (
                  <OrderRow
                    {...rest}
                    price={price}
                    key={price}
                    color="light-red"
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;

interface OrderRowProps extends GroupedOrder {
  color: "light-green" | "light-red";
}

function OrderRow({ price, size, total, color }: OrderRowProps) {
  return (
    <tr>
      <td className={color}>{price}</td>
      <td>{size}</td>
      <td>{total}</td>
    </tr>
  );
}

function TableHeader({ title }: { title: string }) {
  return (
    <table className="orders-header">
      <thead>
        <tr>
          <th colSpan={3}>
            <div className="orders-header-title">{title}</div>
          </th>
        </tr>
        <tr>
          <th className="price">Price</th>
          <th className="size">Size</th>
          <th className="total">Total</th>
        </tr>
      </thead>
    </table>
  );
}
