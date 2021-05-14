import { GroupedOrder, Order, GroupSize } from "../types";

/**
 * Adds groupings and totals to order lists
 * @param {Order[]} orders - the lists of orders
 * @param {GroupSize} groupSize - the size of the grouping
 */
function getGroupedOrders(
  orders: Order[],
  groupSize: GroupSize
): GroupedOrder[] {
  // set initial groupVal
  let groupedOrders: GroupedOrder[] = [];
  let currentGroupVal: number = groupSize;
  let currentGroupIndex = 0;
  // for every order
  for (let index = 0; index < orders.length; index++) {
    const order = orders[index];
    const { price, size } = order;
    // if less than group val
    if (price <= currentGroupVal) {
      // list empty, add first element
      if (!groupedOrders.length) {
        groupedOrders.push({ price: currentGroupVal, size, total: size });
      } else {
        // list not empty
        // if first item in group
        if (groupedOrders[currentGroupIndex].price < currentGroupVal) {
          groupedOrders.push({
            price: currentGroupVal,
            size,
            total: size + groupedOrders[currentGroupIndex].total,
          });
          currentGroupIndex++;
        } else {
          // recalculate last groupedOrders item
          const currentGroupOrder: GroupedOrder =
            groupedOrders[currentGroupIndex];
          const newSize = currentGroupOrder.size + size;
          const newTotal = currentGroupOrder.total + newSize - size;

          groupedOrders[currentGroupIndex] = {
            ...currentGroupOrder,
            size: newSize,
            total: newTotal,
          };
        }
      }
    } else {
      // use ceil to get new groupVal
      currentGroupVal = Math.ceil(price / groupSize) * groupSize;

      if (!groupedOrders.length) {
        groupedOrders.push({ price: currentGroupVal, size, total: size });
      } else {
        const newTotal = size + groupedOrders[currentGroupIndex].total;

        // add to last groupedOrders item
        groupedOrders.push({
          price: currentGroupVal,
          size,
          total: newTotal,
        });
        currentGroupIndex++;
      }
    }
  }

  return groupedOrders;
}

export default getGroupedOrders;
