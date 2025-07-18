import type { DataType } from "../../models/DataType";
import type { ValueFormatterFunction } from "../Grid/columnState";
import type { SortState } from "./sortState";
import type { ValueComparerFunction } from "./valueComparerFunction";

export interface ColDef {
    field?: string;
    colId?: string;
    headerName?: string;
    headerClassName?: string;
    cellClassName?: string;
    dataType?: DataType;
    dataFormat?: string;
    valueFormatter?: ValueFormatterFunction;
    width?: number;
    rowGroup?: boolean;
    pivot?: boolean;
    valueComparer?: ValueComparerFunction;
    sort?: SortState;
    hide?: boolean;
    aggFunc?: string;
    allowUserSort?: boolean;
    allowUserFilter?: boolean;
    allowUserResize?: boolean;
    allowUserReorder?: boolean;
    allowUserHide?: boolean;
    allowUserPin?: boolean;
}

export interface GroupColDef {
    groupId: string;
    headerName?: string;
    headerClassName?: string;
    children: ColumnDefinition[];
    hide?: boolean;
}

export type ColumnDefinition = ColDef | GroupColDef;