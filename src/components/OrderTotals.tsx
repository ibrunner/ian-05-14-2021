import { useOrderDataListener } from "../util/useOrderData";
import {Order} from "../types";

function OrderTotals() {
    const { orderSet }  = useOrderDataListener();
    const {bids, asks} = orderSet;
    const totalReducer = (accumulator: number, currentValue: Order) => accumulator + currentValue.size;

    const totalBids = bids.reduce<number>(totalReducer, 0).toLocaleString();
    const totalAsks = asks.reduce<number>(totalReducer, 0).toLocaleString();

    return (
        <div className="totals">
            <div>Asks: <span className="asks">{totalAsks}</span></div>
            <div>Bids: <span className="bids">{totalBids}</span></div>
        </div>
    );
}

export default OrderTotals;