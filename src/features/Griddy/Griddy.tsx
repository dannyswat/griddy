import type { DataRow } from "../../models/DataRow";
import type { ColumnDefinition } from "../GridBuilder/columnDefinition";

interface GriddyProps {
    columnDefs: ColumnDefinition[];
    rowData: DataRow[];
}