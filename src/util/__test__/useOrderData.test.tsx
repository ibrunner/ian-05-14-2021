import { getUpdatedOrderList } from "../useOrderData";
import {orderList} from "./mocks";

describe("getUpdatedOrderList()", () => {
  test("removes orders with size 0", () => {
    const newOrder = [[50, 0], [1, 0], [500, 0], [900, 0]];
    const listWithRemovedItem = getUpdatedOrderList(orderList, newOrder);
    expect(listWithRemovedItem).toEqual([
      {
        price: 4,
        size: 5,
      },
      {
        price: 700,
        size: 5,
      },
    ]);
  });

  test("replaces order", () => {
    const newOrder = [[4, 10]];
    const listWithRemovedItem = getUpdatedOrderList(orderList, newOrder);
    expect(listWithRemovedItem).toEqual([
      {
        price: 1,
        size: 5,
      },
      {
        price: 4,
        size: 10,
      },
      {
        price: 500,
        size: 5,
      },
      {
        price: 700,
        size: 5,
      },
      {
        price: 900,
        size: 5,
      }
    ]);
  });

  test("adds orders in sorted order", () => {
    const newOrder = [
      [300, 5],
      [50, 5],
    ];
    const listWithRemovedItem = getUpdatedOrderList(orderList, newOrder);
    expect(listWithRemovedItem).toEqual([
      {
        price: 1,
        size: 5,
      },
      {
        price: 4,
        size: 5,
      },
      {
        price: 50,
        size: 5,
      },
      {
        price: 300,
        size: 5,
      },
      {
        price: 500,
        size: 5,
      },
      {
        price: 700,
        size: 5,
      },
      {
        price: 900,
        size: 5,
      }
    ]);
  });
});
