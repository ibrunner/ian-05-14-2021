import { GroupedOrder, GroupSize, OrderSet } from "../types";
import { groupSizes } from "./common";
import getGroupedOrders from "./getGroupedOrders";

export interface State {
  asks: GroupedOrder[];
  bids: GroupedOrder[];
  groupSize: GroupSize;
}

// Reducer Actions
type GroupSizeDecreased = {
  type: "GROUP_SIZE_DECREASED";
  orderSet: OrderSet;
};

type GroupSizeIncreased = {
  type: "GROUP_SIZE_INCREASED";
  orderSet: OrderSet;
};

type OrderSetUpdated = {
  type: "ORDER_SET_UPDATED";
  orderSet: OrderSet;
};

export type Action = GroupSizeDecreased | GroupSizeIncreased | OrderSetUpdated;

const groupedOrderReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "GROUP_SIZE_DECREASED":
      const currentIndexAtDecrease = groupSizes.findIndex(
        (size) => size === state.groupSize
      );
      const groupSizeDecreased = currentIndexAtDecrease > 0;
      const decreasedGroupSize = groupSizeDecreased
        ? groupSizes[currentIndexAtDecrease - 1]
        : state.groupSize;

      return {
        ...state,
        asks: groupSizeDecreased
          ? getGroupedOrders(action.orderSet.asks, decreasedGroupSize, "asc")
          : state.asks,
        bids: groupSizeDecreased
          ? getGroupedOrders(action.orderSet.bids, decreasedGroupSize, "desc")
          : state.bids,
        groupSize: decreasedGroupSize,
      };
    case "GROUP_SIZE_INCREASED":
      const currentIndexAtIncrease = groupSizes.findIndex(
        (size) => size === state.groupSize
      );
      const groupSizeIncreased =
        currentIndexAtIncrease < groupSizes[groupSizes.length - 1];
      const increasedGroupSize = groupSizeIncreased
        ? groupSizes[currentIndexAtIncrease + 1]
        : state.groupSize;

      return {
        ...state,
        asks: groupSizeIncreased
          ? getGroupedOrders(action.orderSet.asks, increasedGroupSize, "asc")
          : state.asks,
        bids: groupSizeIncreased
          ? getGroupedOrders(action.orderSet.bids, increasedGroupSize, "desc")
          : state.bids,
        groupSize: increasedGroupSize,
      };

    case "ORDER_SET_UPDATED":
      return {
        ...state,
        asks: getGroupedOrders(action.orderSet.asks, state.groupSize, "asc"),
        bids: getGroupedOrders(action.orderSet.bids, state.groupSize, "desc"),
      };

    default:
      return state;
  }
};

export default groupedOrderReducer;
