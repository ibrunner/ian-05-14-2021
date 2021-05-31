import { useOrderDataListener } from "../util/useOrderData";
import {Order} from "../types";

function OrderTotals() {
    const { orderSet }  = useOrderDataListener();
    const {bids, asks} = orderSet;
    const totalReducer = (accumulator: number, currentValue: Order) => accumulator + currentValue.size;

    const totalBids = asks.reduce<number>(totalReducer, 0);
    const totalAsks = bids.reduce<number>(totalReducer, 0)

    return (
        <div className="totals">
            <div className="asks">Asks: {totalAsks}</div>
            <div className="bids">Bids: {totalBids}</div>
        </div>
    );
}

export default OrderTotals;