import React from "react";
import { Order, OrderSet } from "../types";
import useIsVisible from "./useIsVisible";
import usePrevious from "./usePrevious";

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
  if(!orderList.length) {
    return 0;
  }

  var low = 0,
    high = orderList.length;

  while (low < high) {
    var mid = (low + high) >>> 1;
    if (orderList[mid].price < order.price) {
      low = mid + 1;
    } else {
      high = mid;
    } 
  }
  return low;
}

/**
 * gets the index of an item by price
 * @param {Order[]} orderList - the lists of orders
 * @param {number} price - the price to test
 */
 function getIndexByPrice(orderList: Order[], price: number): number {
   if(!orderList.length) {
     return -1;
   }

  var low = 0,
    high = orderList.length;

  while (low < high) {
    var mid = (low + high) >>> 1;
    if (orderList[mid].price < price) {
      low = mid + 1;
    } else {
      high = mid;
    } 
  }

  if(orderList[low]?.price === price) {
    return low;
  }
  
  return -1;
  
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

      const orderIndex = getIndexByPrice(updatedOrders, price)

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
}

function useOrderData(): UseOrderData {
  const visible = useIsVisible();
  const prevVisible = usePrevious(visible);
  const [orderSet, setOrderSet] = React.useState<OrderSet>({
    asks: [],
    bids: [],
  });
  const [listenerCount, setListenerCount] = React.useState<number>(0);
  const prevListenerCount = usePrevious(listenerCount);
  const [error, setError] = React.useState<Event | null>(null);
  const ws: React.MutableRefObject<WebSocket | null> = React.useRef(null);

  const addListener = React.useCallback(() => {
    setListenerCount((listenerCount) => listenerCount + 1);
  }, [setListenerCount]);

  const removeListener = React.useCallback(() => {
    setListenerCount((listenerCount) => listenerCount - 1);
  }, [setListenerCount]);

  const initializeWS = React.useCallback(() => {
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
  }, []);

  const initializeOnMessage = React.useCallback(() => {
    if (!ws.current) return;
    ws.current.onmessage = (e) => {
      const message: OrderMessage = JSON.parse(e.data);

      setOrderSet(({ asks, bids }) => ({
        asks: message.asks ? getUpdatedOrderList(asks, message.asks) : asks,
        bids: message.bids ? getUpdatedOrderList(bids, message.bids) : bids,
      }));
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
    ws.current?.close();
  }, []);

  React.useEffect(() => {
    const visibleChanged = visible !== prevVisible;
    const listenerCountChanged = listenerCount !== prevListenerCount;

    if (
      (visible && visibleChanged && listenerCount) ||
      (prevListenerCount === 0 && listenerCount === 1 && visible)
    ) {
      initializeWS();
      initializeOnMessage();
      initializeOnError();
    } else if (
      (!visible && visibleChanged) ||
      (listenerCount < 1 && listenerCountChanged)
    ) {
      closeWS();
    }
  }, [
    visible,
    listenerCount,
    prevVisible,
    prevListenerCount,
    initializeWS,
    closeWS,
    initializeOnMessage,
    initializeOnError,
  ]);

  // cleanup on unmount
  React.useEffect(() => {
    return () => {
      closeWS();
    };
  }, [closeWS]);

  return {
    orderSet,
    error,
    addListener,
    removeListener,
  };
}

export default useOrderData;

export const OrderContext = React.createContext(
  null as unknown as UseOrderData
);

export const useOrderDataContext = () => React.useContext(OrderContext);

export const useOrderDataListener = () => {
  const { orderSet, error, addListener, removeListener } =
    useOrderDataContext();

  React.useEffect(() => {
    addListener();
    return () => {
      removeListener();
    };
  }, [addListener, removeListener]);

  return { orderSet, error };
};
