import React from "react";
import { Order, OrderSet } from "../types";
import useIsVisible from "./useIsVisible"

type OrderMessage = {
  asks: number[][];
  bids: number[][];
  feed: string;
  product_id: string;
};

/**
 * gets the index of an item in sorted order
 * @param {Order[]} orderList - the lists of orders
 * @param {Order} order - the individual order to test
 */
function getSortedIndex(orderList: Order[], order: Order): number {
  var low = 0,
    high = orderList.length;

  while (low < high) {
    var mid = (low + high) >>> 1;
    if (orderList[mid].price < order.price) low = mid + 1;
    else high = mid;
  }
  return low;
}

/**
 * processes new orders by sorting and merging them into the orders list
 * @param {Order[]} orderList - the lists of orders
 * @param {Order} newOrders - the new list to merge
 */
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
  return updatedOrders;
}

interface UseOrderData {
  orderSet: OrderSet;
  error: Event | null;
  addListener: () => void;
  removeListener: () => void;
};

function useOrderData(): UseOrderData {
  const visible = useIsVisible()
  const [orderSet, setOrderSet] = React.useState<OrderSet>({
    asks: [],
    bids: [],
  });
  const [listenerCount, setListenerCount] = React.useState<number>(1);
  const [error, setError] = React.useState<Event | null>(null);
  const ws: React.MutableRefObject<WebSocket | null> = React.useRef(null);
  
  const addListener = () => {
    setListenerCount(listenerCount + 1);
  }

  const removeListener = () => {
    setListenerCount(listenerCount - 1);
  }

  const initializeWS = React.useCallback(() => {
    console.log("init code")
    const params = {
      event: "subscribe",
      feed: "book_ui_1",
      product_ids: ["PI_XBTUSD"],
    };
    ws.current = new WebSocket("wss://www.cryptofacilities.com/ws/v1");
    ws.current.onopen = () => {
      console.info("on open")
      ws.current?.send(JSON.stringify(params));
    };
    ws.current.onclose = () => console.log("ws closed");
  }, []);

  const initializeOnMessage = React.useCallback(() => {
    if (!ws.current) return;
    console.log("setting message")
      ws.current.onmessage = (e) => {
        // if(listenerCount) {
        const message: OrderMessage = JSON.parse(e.data);

        setOrderSet(({ asks, bids }) => ({
          asks: message.asks ? getUpdatedOrderList(asks, message.asks) : asks,
          bids: message.bids ? getUpdatedOrderList(bids, message.bids) : bids,
        }));
      // }
    };
  }, []);

  const initializeOnError = React.useCallback(() => {
    if (!ws.current) return;
    ws.current.onerror = (e) => {
      setError(e);
      console.error("WebSocket error observed:", e);
    };
  }, []);

  const closeWS = React.useCallback(() => {
    console.log("close")
    ws.current?.close();
  }, []);

  // React.useEffect(() => {
  //   if(listenerCount === 1){
  //     initializeWS();
  //   } else if(listenerCount < 1) {
  //     closeWS();
  //   }

  //   return () => {
  //     closeWS()
  //   };
  // }, [listenerCount, initializeWS, closeWS]);

  React.useEffect(() => {
    if(visible){
      console.log("visibile init");
      initializeWS();
      initializeOnMessage();
      initializeOnError();
    } else {
      console.log("invisibile close");
      closeWS();
    }
  }, [visible, initializeWS, closeWS,initializeOnMessage,initializeOnError ]);

  React.useEffect(() => {
    if (!ws.current) return;
    // console.log("setting message")
    //   ws.current.onmessage = (e) => {
    //     if(listenerCount) {
    //     const message: OrderMessage = JSON.parse(e.data);

    //     setOrderSet(({ asks, bids }) => ({
    //       asks: message.asks ? getUpdatedOrderList(asks, message.asks) : asks,
    //       bids: message.bids ? getUpdatedOrderList(bids, message.bids) : bids,
    //     }));
    //   }
    // };
    initializeOnMessage();
    initializeOnError();

    return () => {
      closeWS()
    };

  }, [initializeOnMessage, initializeOnError, closeWS /*listenerCount*/]);


  // cleanup on unmount
  React.useEffect(() => {
    return () => {
      closeWS()
    };
  }, [closeWS]);

  return {
    orderSet,
    error,
    addListener,
    removeListener
  };
}

export default useOrderData;

export const OrderContext = React.createContext((null as unknown) as UseOrderData);

export const useOrderDataContext = () => React.useContext(OrderContext);
