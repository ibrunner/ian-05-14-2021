import React from "react";

export type OrderMap = Map<number, number>;

export type OrderMessage = {
  asks: number[][];
  bids: number[][];
  feed: string;
  product_id: string;
};

function getUpdatedOrderMap(
  orderMap: OrderMap,
  newOrders: number[][]
): OrderMap {
  const updatedOrders: OrderMap = new Map(orderMap);
  if (newOrders.length) {
    newOrders.forEach((order) => {
      const [price, size] = order;
      !size ? updatedOrders.delete(price) : updatedOrders.set(price, size);
    });
  }
  return updatedOrders;
}

function useOrderData() {
  const [asks, setAsks] = React.useState<OrderMap>(new Map());
  const [bids, setBids] = React.useState<OrderMap>(new Map());
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

  React.useEffect(() => {
    if (!ws.current) return;

    ws.current.onmessage = (e) => {
      const message: OrderMessage = JSON.parse(e.data);

      message.asks && setAsks((asks) => getUpdatedOrderMap(asks, message.asks));
      message.bids && setBids((bids) => getUpdatedOrderMap(bids, message.bids));
    };
  }, []);

  return {
    asks,
    bids
  };
}

export default useOrderData;
