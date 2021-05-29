import { GroupedOrder } from "../types";

interface OrderListProps {
  orderType: "bids" | "asks";
  orders: GroupedOrder[];
}

function OrderList({ orderType, orders }: OrderListProps) {
  return (
    <>
      <OrdersTableHeader
        title={orderType === "bids" ? "Bids" : "Asks"}
        orderType={orderType}
      />
      <OrdersTable orders={orders} orderType={orderType} />
    </>
  );
}

interface OrdersTableHeaderProps {
  title: string;
  orderType: "bids" | "asks";
}

export default OrderList;

function OrdersTableHeader({ title, orderType }: OrdersTableHeaderProps) {
  return (
    <table className={`orders-header ${orderType}`}>
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

interface OrdersTableProps {
  orderType: "bids" | "asks";
  orders: GroupedOrder[];
}

function OrdersTable({ orderType, orders }: OrdersTableProps) {
  let highValue: number | null;
  if(orders.length) {
    highValue = orderType === "asks" ? orders[orders.length - 1].total : orders[0].total
  }

  return (
    <div className={`orders-table-container ${orderType}`}>
      <table>
        <tbody>
          {[...orders].reverse().map(({ price, ...rest }) => {
            return (
              <OrderRow
                {...rest}
                price={price}
                key={price}
                highValue={highValue}
                orderType={orderType}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

interface OrderRowProps extends GroupedOrder {
  highValue: number | null;
  orderType: "bids" | "asks";
}

function OrderRow({ price, size, total, highValue, orderType }: OrderRowProps) {
  const relativeValue = highValue && highValue !== 0 ? (total / highValue) * 0.5 : 0;
  const rgb = orderType === "bids" ? "158, 235, 207" : "255, 114, 92";
  return (
    <tr>
      <td
        className="price"
        style={{ backgroundColor: `rgba(${rgb}, ${relativeValue})` }}
      >
        {price.toFixed(2).toLocaleString()}
      </td>
      <td>{size.toLocaleString()}</td>
      <td>{total.toLocaleString()}</td>
    </tr>
  );
}
