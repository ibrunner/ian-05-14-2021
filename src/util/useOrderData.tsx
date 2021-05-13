import React from "react";
import {Order, OrderSet} from "../types";


export type OrderMessage = {
  asks: number[][];
  bids: number[][];
  feed: string;
  product_id: string;
};

export function getSortedIndex(array: Order[], value: Order): number {
  var low = 0,
    high = array.length;

  while (low < high) {
    var mid = (low + high) >>> 1;
    if (array[mid].price < value.price) low = mid + 1;
    else high = mid;
  }
  return low;
}

export function getUpdatedOrderList(
  orderList: Order[],
  newOrders: number[][]
): Order[] {
  let updatedOrders: Order[] = [...orderList];

  if (newOrders.length) {
    newOrders.forEach((order) => {
      const [price, size] = order;

      const orderIndex = updatedOrders.findIndex(
        (order) => order.price === price
      );

      const newOrder = {
        price,
        size,
      };

      if (orderIndex >= 0) {
        // order price exists
        if (!size) {
          // delete orders with size 0
          updatedOrders.splice(orderIndex, 1);
        } else {
          // replace existing
          updatedOrders.splice(orderIndex, 1, newOrder);
        }
      } else if (size) {
        // insert sorted order
        const newOrder = {
          price,
          size,
        };

        const sortedIndex = getSortedIndex(updatedOrders, newOrder);
        updatedOrders.splice(sortedIndex, 0, newOrder);
      }
    });
  }
  // recalculate totals
  //   for (let index = 0; index < updatedOrders.length; index++) {
  //     const updatedOrder = updatedOrders[index];
  //     if (index === 0) {
  //       updatedOrders[index] = { ...updatedOrder, total: updatedOrder.size };
  //     } else {
  //       updatedOrders[index] = {
  //         ...updatedOrder,
  //         total: updatedOrder.size + updatedOrders[index - 1].total,
  //       };
  //     }
  //   }
  return updatedOrders;
}

function useOrderData() {
  // const [asks, setAsks] = React.useState<Order[]>([]);
  // const [bids, setBids] = React.useState<Order[]>([]);
  const [orderSet, setOrderSet] = React.useState<OrderSet>({asks:[], bids: []});
  //   const [isPaused, setPause] = React.useState(false);
  const ws: React.MutableRefObject<WebSocket | null> = React.useRef(null);

  React.useEffect(() => {
    const params = {
      event: "subscribe",
      feed: "book_ui_1",
      product_ids: ["PI_XBTUSD"],
    };
    ws.current = new WebSocket("wss://www.cryptofacilities.com/ws/v1");
    ws.current.onopen = () => {
      ws.current?.send(JSON.stringify(params));
    };
    ws.current.onclose = () => console.log("ws closed");

    return () => {
      ws.current?.close();
    };
  }, []);

  React.useEffect(
    () => {
      if (!ws.current) return;

      ws.current.onmessage = (e) => {
        //   if (isPaused) return;
        const message: OrderMessage = JSON.parse(e.data);
        //   setPause(true);

        setOrderSet(({asks, bids}) => ({
          asks: message.asks ? getUpdatedOrderList(asks, message.asks) : asks,
          bids: message.bids ? getUpdatedOrderList(bids, message.bids) : bids
        }));

        //   setPause(false);
      };
    },
    [
      /*isPaused, bids, asks*/
    ]
  );

  return orderSet;
}

export default useOrderData;
