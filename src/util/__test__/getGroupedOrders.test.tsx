import getGroupedOrders from "../getGroupedOrders";
import { orderList } from "./mocks";

describe("getGroupedOrders()", () => {
  test("aggregates orders by group and calculates totals", () => {
    expect(getGroupedOrders(orderList, 5)).toEqual([
      {
        price: 5,
        size: 10,
        total: 10,
      },
      {
        price: 500,
        size: 5,
        total: 15,
      },
      {
        price: 700,
        size: 5,
        total: 20,
      },
      {
        price: 900,
        size: 5,
        total: 25,
      },
    ]);
  });

  test("calculates total when ceil is above original group value", () => {
    expect(getGroupedOrders([{ price: 50, size: 5 }], 5)).toEqual([
      {
        price: 50,
        size: 5,
        total: 5,
      },
    ]);
  });

  test("accumulates total for multiple groups", () => {
    expect(getGroupedOrders([{ price: 10, size: 5 }, { price: 20, size: 5 }, { price: 50, size: 5 }], 50)).toEqual([
      {
        price: 50,
        size: 15,
        total: 15,
      },
    ]);
  });
});
