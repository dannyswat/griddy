import type { DataRow } from "../../models/DataRow";

export type ValueComparerSimpleFunction = (valueA: unknown, valueB: unknown) => number;
export type ValueComparerFunctionWithRows = (valueA: unknown, valueB: unknown, rowA: DataRow, rowB: DataRow) => number;

export type ValueComparerFunction = ValueComparerSimpleFunction | ValueComparerFunctionWithRows;