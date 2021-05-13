// import React from 'react';
import './App.css';
import useOrderData from "./util/useOrderData";
// TODO remove from package if unused
// import {uniqueId} from "lodash";

function App() {
 const {asks} = useOrderData();
  console.info(asks)
  return (
    <div>
      hi im the app
      {[...asks].map(([price, size]) => {
        console.log("ask", price);
      return <AskItem price={price} size={size} key={price}/>
      })
    }
    </div>
  );
}

export default App;

type AskItemProps = {
  price: number;
  size: number;
}

function AskItem({price, size}: AskItemProps) {
  console.log("price")
  return (<div>i
    Price: {price}
    Size: {size}
  </div>)
}