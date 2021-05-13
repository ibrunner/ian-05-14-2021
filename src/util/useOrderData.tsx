import React from 'react';

export type Order = {
    asks: number[][];
    bids: number[][];
    feed: string;
    product_id: string;
};

// type OrderData = {
//     asks: Map<number, number>;
// }
// adapted from https://stackoverflow.com/questions/60152922/proper-way-of-using-react-hooks-websockets
function useOrderData(){
    // const [isPaused, setPause] = React.useState(false);
    // const [orders, setOrders] = React.useState<Order[]>([])
    const [asks, setAsks] = React.useState<Map<number, number>>(new Map())
    const ws: React.MutableRefObject<WebSocket | null> = React.useRef(null);

    React.useEffect(() => {
        const params = {event:"subscribe", feed:"book_ui_1", product_ids:["PI_XBTUSD"]};
        ws.current = new WebSocket("wss://www.cryptofacilities.com/ws/v1");
        ws.current.onopen = () => {
          ws.current?.send(JSON.stringify(params))
        };
        ws.current.onclose = () => console.log("ws closed");
  
        return () => {
            ws.current?.close();
        };
    }, []);
  
    React.useEffect(() => {
        if (!ws.current) return;
  
        ws.current.onmessage = e => {
            // if (isPaused) return;
            const message: Order = JSON.parse(e.data);
            // TODO size fixer
            if(asks.size > 10) {
                setAsks(new Map());
                return;    
            }
           
            const updatedAsks= new Map(asks);
            if(message.asks?.length) {
                message.asks.forEach(messageAsk => {
                const [price, size] = messageAsk;
                !size ? updatedAsks.delete(price) : updatedAsks.set(price, size)
            });
            setAsks(updatedAsks);
            }
            console.log("e", message.asks);
        };
    }, [asks]);

    return {
        asks
    }
}

export default useOrderData;