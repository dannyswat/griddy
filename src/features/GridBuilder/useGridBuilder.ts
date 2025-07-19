import type { DataRow } from "../../models/DataRow";
import type { ColumnState, ColState, GroupColState } from "../Grid/columnState";
import type { ColumnDefinition, ColDef, GroupColDef } from "./columnDefinition";
import { useTransformData } from "./useTransformData";

interface GridBuilderOptions {
    columnDefs: ColumnDefinition[];
    rowData: DataRow[];
    pivotMode?: boolean;
}

export function useGridBuilder(options: GridBuilderOptions) {
    const { columnDefs, rowData, pivotMode = false } = options;

    // Convert column definitions to column state
    const columnState = columnDefinitionsToState(columnDefs, rowData, pivotMode);

    // Transform data if in pivot mode
    const transformedData = useTransformData({
        rowData: rowData,
        grouped: pivotMode ? extractGroupedFields(columnDefs) : [],
        pivot: pivotMode ? extractPivotFields(columnDefs) : [],
        value: pivotMode ? extractValueFields(columnDefs) : []
    });

    return {
        columnState,
        rowData: transformedData || rowData
    };
}

function columnDefinitionsToState(columnDefs: ColumnDefinition[], rowData: DataRow[] | undefined, pivotMode: boolean): ColumnState[] {
    if (!pivotMode) {
        // Normal mode: convert column definitions directly
        return convertColumnDefinitions(columnDefs);
    }

    // Pivot mode: reorganize columns
    return createPivotColumns(columnDefs, rowData || []);
}

function convertColumnDefinitions(columnDefs: ColumnDefinition[]): ColumnState[] {
    return columnDefs
        .filter(colDef => !isHidden(colDef))
        .map(colDef => convertColumnDefinition(colDef));
}

function convertColumnDefinition(colDef: ColumnDefinition): ColumnState {
    if (isGroupColDef(colDef)) {
        return convertGroupColDef(colDef);
    } else {
        return convertColDef(colDef);
    }
}

function convertColDef(colDef: ColDef): ColState {
    return {
        field: colDef.field || colDef.colId || '',
        colId: colDef.colId || colDef.field || '',
        headerName: colDef.headerName || colDef.field || colDef.colId || '',
        headerClassName: colDef.headerClassName || '',
        cellClassName: colDef.cellClassName || '',
        dataType: colDef.dataType || 'string',
        dataFormat: colDef.dataFormat || '',
        valueFormatter: colDef.valueFormatter,
        width: colDef.width || 120,
        sorted: convertSortState(colDef.sort),
        filtered: false
    };
}

function convertGroupColDef(groupColDef: GroupColDef): GroupColState {
    return {
        groupId: groupColDef.groupId,
        headerName: groupColDef.headerName || groupColDef.groupId,
        headerClassName: groupColDef.headerClassName || '',
        children: convertColumnDefinitions(groupColDef.children)
    };
}

function createPivotColumns(columnDefs: ColumnDefinition[], rowData: DataRow[]): ColumnState[] {
    const flatColumnDefs = flattenColumnDefinitions(columnDefs);
    
    // Separate different types of columns
    const rowGroupCols = flatColumnDefs.filter(col => col.rowGroup);
    const pivotCols = flatColumnDefs.filter(col => col.pivot);
    const valueCols = flatColumnDefs.filter(col => col.aggFunc);
    
    const result: ColumnState[] = [];
    
    // 1. Add row group columns first (on the left)
    rowGroupCols.forEach(col => {
        result.push(convertColDef(col));
    });
    
    // 2. Generate pivot columns with value columns
    if (pivotCols.length > 0 && valueCols.length > 0) {
        const pivotValues = extractPivotValues(pivotCols, rowData);
        
        pivotValues.forEach(pivotValue => {
            if (valueCols.length === 1) {
                // Single value column: create direct column
                const valueCol = valueCols[0];
                result.push(createPivotValueColumn(valueCol, pivotValue));
            } else {
                // Multiple value columns: create group with children
                const groupCol: GroupColState = {
                    groupId: `pivot-${pivotValue}`,
                    headerName: pivotValue,
                    headerClassName: 'pivot-group',
                    children: valueCols.map(valueCol => 
                        createPivotValueColumn(valueCol, pivotValue)
                    )
                };
                result.push(groupCol);
            }
        });
    } else {
        // 3. Add regular value columns if no pivot columns
        valueCols.forEach(col => {
            result.push(convertColDef(col));
        });
    }
    
    // 4. In pivot mode, we don't add remaining columns - only show row groups and pivot columns
    // This keeps the pivot table clean and focused on the aggregated data
    
    return result;
}

function createPivotValueColumn(valueCol: ColDef, pivotValue: string): ColState {
    return {
        field: `${valueCol.field}_${pivotValue}`,
        colId: `${valueCol.colId || valueCol.field}_${pivotValue}`,
        headerName: valueCol.headerName || valueCol.field || '',
        headerClassName: valueCol.headerClassName || 'pivot-value',
        cellClassName: valueCol.cellClassName || 'pivot-value',
        dataType: valueCol.dataType || 'number',
        dataFormat: valueCol.dataFormat || '',
        valueFormatter: valueCol.valueFormatter,
        width: valueCol.width || 120,
        sorted: convertSortState(valueCol.sort),
        filtered: false
    };
}

function extractPivotValues(pivotCols: ColDef[], rowData: DataRow[]): string[] {
    const values = new Set<string>();
    
    rowData.forEach(row => {
        const pivotValue = pivotCols
            .map(col => String(row[col.field || col.colId || ''] || ''))
            .join(' - ');
        
        if (pivotValue && pivotValue !== '') {
            values.add(pivotValue);
        }
    });
    
    return Array.from(values).sort();
}

function flattenColumnDefinitions(columnDefs: ColumnDefinition[]): ColDef[] {
    const result: ColDef[] = [];
    
    columnDefs.forEach(colDef => {
        if (isGroupColDef(colDef)) {
            result.push(...flattenColumnDefinitions(colDef.children));
        } else {
            result.push(colDef);
        }
    });
    
    return result;
}

// Helper functions
function isGroupColDef(colDef: ColumnDefinition): colDef is GroupColDef {
    return 'children' in colDef;
}

function isHidden(colDef: ColumnDefinition): boolean {
    return colDef.hide === true;
}

function convertSortState(sort: any): "asc" | "desc" | undefined {
    if (sort === "asc" || sort === "desc") {
        return sort;
    }
    return undefined;
}

// Helper functions for data transformation
function extractGroupedFields(columnDefs: ColumnDefinition[]): string[] {
    return flattenColumnDefinitions(columnDefs)
        .filter(col => col.rowGroup)
        .map(col => col.field || col.colId || '');
}

function extractPivotFields(columnDefs: ColumnDefinition[]): string[] {
    return flattenColumnDefinitions(columnDefs)
        .filter(col => col.pivot)
        .map(col => col.field || col.colId || '');
}

function extractValueFields(columnDefs: ColumnDefinition[]): Array<{field: string, aggFunc: string}> {
    return flattenColumnDefinitions(columnDefs)
        .filter(col => col.aggFunc)
        .map(col => ({
            field: col.field || col.colId || '',
            aggFunc: col.aggFunc || 'sum'
        }));
}

