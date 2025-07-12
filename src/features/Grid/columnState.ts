import type { ReactNode } from "react";
import type { DataRow } from "../../models/DataRow";
import type { DataType } from "../../models/DataType";
import type { SortState } from "../../models/GridState";

export type ValueFormatterFunction = (value: unknown, row: DataRow, col: ColState) => string;

export type CellRendererFunction = (value: string, row: DataRow, col: ColState) => ReactNode;

export type HeaderCellRendererFunction = (col: ColState) => ReactNode;

export type GroupHeaderCellRendererFunction = (group: GroupColState) => ReactNode;

export interface ColState {
    field: string;
    colId: string;
    headerName: string;
    headerClassName: string;
    cellClassName: string;
    dataType: DataType;
    dataFormat: string;
    valueFormatter?: ValueFormatterFunction;
    cellRenderer?: CellRendererFunction;
    headerCellRenderer?: HeaderCellRendererFunction;
    width: number;
    sorted: SortState;
    filtered: boolean;
}

export interface GroupColState {
    groupId: string;
    headerName: string;
    headerClassName: string;
    headerCellRenderer?: GroupHeaderCellRendererFunction;
    children: ColumnState[];
}

export type ColumnState = ColState | GroupColState;