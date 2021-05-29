import { GroupedOrder, Order, GroupSize } from "../types";

/**
 * Adds groupings and totals to order lists
 * @param {Order[]} orders - the lists of orders
 * @param {GroupSize} groupSize - the size of the grouping
 */
function getGroupedOrders(
  orders: Order[],
  groupSize: GroupSize,
  totalDirection: "asc" | "desc"
): GroupedOrder[] {

  // return early on empty list
  if(!orders) {
    return []
  }

  // set initial groupVal
  let groupedOrders: Omit<GroupedOrder, "total">[] = [];
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
        groupedOrders.push({ price: currentGroupVal, size /*total: size*/ });
      } else {
        // list not empty
        // if first item in group
        if (groupedOrders[currentGroupIndex].price < currentGroupVal) {
          groupedOrders.push({
            price: currentGroupVal,
            size,
            // total: size + groupedOrders[currentGroupIndex].total,
          });
          currentGroupIndex++;
        } else {
          // recalculate last groupedOrders item
          const currentGroupOrder: Omit<GroupedOrder, "total"> =
            groupedOrders[currentGroupIndex];
          const newSize = currentGroupOrder.size + size;
          // const newTotal = currentGroupOrder.total + size;
          groupedOrders.splice(currentGroupIndex, 1, {
            ...currentGroupOrder,
            size: newSize,
            // total: newTotal,
          });
        }
      }
    } else {
      // use ceil to get new groupVal
      currentGroupVal = Math.ceil(price / groupSize) * groupSize;

      if (!groupedOrders.length) {
        groupedOrders.push({ price: currentGroupVal, size /*total: size */ });
      } else {
        // const newTotal = size + groupedOrders[currentGroupIndex].total;

        // add to last groupedOrders item
        groupedOrders.push({
          price: currentGroupVal,
          size,
          // total: newTotal,
        });
        currentGroupIndex++;
      }
    }
  }
  
  let groupedOrdersWithTotals: GroupedOrder[] = [];

  // calculate totals
  if (totalDirection === "asc") {
    groupedOrdersWithTotals.push({
      ...groupedOrders[0],
      total: groupedOrders[0].size,
    });
    for (let index = 1; index < groupedOrders.length; index++) {
      const element = groupedOrders[index];
      groupedOrdersWithTotals.push({
        ...element,
        total: element.size + groupedOrdersWithTotals[groupedOrdersWithTotals.length-1].total,
      });
    }
  } else {
    groupedOrdersWithTotals.push({
      ...groupedOrders[groupedOrders.length - 1],
      total: groupedOrders[groupedOrders.length - 1].size,
    });
    for (let index = groupedOrders.length - 2; index >= 0 ; index--) {
      const element = groupedOrders[index];
      groupedOrdersWithTotals.push({
        ...element,
        total: element.size + groupedOrdersWithTotals[groupedOrdersWithTotals.length-1].total,
      });
    }
    
    groupedOrdersWithTotals.reverse();
  }

  return groupedOrdersWithTotals;
}

export default getGroupedOrders;
