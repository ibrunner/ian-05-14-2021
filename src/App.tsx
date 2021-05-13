// import React from 'react';
import "./App.css";
import useOrderData from "./util/useOrderData";
// TODO remove from package if unused
// import {uniqueId} from "lodash";

function App() {
  const { asks, bids } = useOrderData();
  console.info(asks);
  return (
    <div style={{display: "flex"}}>
      <div className="bids"  style={{backgroundColor: "green", height: 500, overflow: "scroll"}}>
        {[...bids].map(([price, size]) => {
          return <OrderRow price={price} size={size} key={price} />;
        })}
      </div>
      <div className="asks" style={{backgroundColor: "red", height: 500, overflow: "scroll"}}>
        {[...asks].map(([price, size]) => {
          return <OrderRow price={price} size={size} key={price} />;
        })}
      </div>
    </div>
  );
}

export default App;

type OrderRowProps = {
  price: number;
  size: number;
};

function OrderRow({ price, size }: OrderRowProps) {
  return (
    <div>
      Price: {price} Size: {size}
    </div>
  );
}
