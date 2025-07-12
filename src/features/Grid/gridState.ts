import type { CSSProperties } from "react";
import type { DataRow } from "../../models/DataRow";
import type { ColumnState } from "./columnState";

export interface AutoColumnSizingOptions {
    /** Maximum number of data rows to sample for width calculation (default: 100) */
    maxSampleSize?: number;
    /** Minimum column width in pixels (default: 60) */
    minWidth?: number;
    /** Maximum column width in pixels (default: 300) */
    maxWidth?: number;
    /** Padding to add to measured width in pixels (default: 24) */
    padding?: number;
}

export interface GridState {
    columns: ColumnState[];
    data?: DataRow[];
    totalRow?: DataRow;
    keyField?: string;
    className?: string;
    style?: CSSProperties;
    enableRowVirtualization?: boolean;
    enableAutoColumnSizing?: boolean;
    autoColumnSizingOptions?: AutoColumnSizingOptions;
}