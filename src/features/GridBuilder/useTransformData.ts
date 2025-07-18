import { useMemo } from "react";
import type { DataRow } from "../../models/DataRow";

interface TransformDataOptions {
    grouped?: string[];
    pivot?: string[];
    rowData?: DataRow[];
    value?: AggregateOptions[];
}

interface AggregateOptions {
    field: string;
    aggFunc: string;
}

export function useTransformData(options: TransformDataOptions): DataRow[] | undefined {
    const { grouped = [], pivot = [], rowData = [], value = [] } = options;

    return useMemo(() => {
        if (!rowData || rowData.length === 0) {
            return undefined;
        }

        // If no transformations requested, return original data
        if (grouped.length === 0 && pivot.length === 0 && value.length === 0) {
            return rowData;
        }

        // Apply transformations
        if (pivot.length > 0) {
            return transformDataWithPivot(rowData, grouped, pivot, value);
        } else if (grouped.length > 0) {
            return transformDataWithGrouping(rowData, grouped, value);
        } else if (value.length > 0) {
            return transformDataWithAggregation(rowData, value);
        }

        return rowData;
    }, [rowData, grouped, pivot, value]);
}

function transformDataWithPivot(
    data: DataRow[],
    groupedFields: string[],
    pivotFields: string[],
    valueFields: AggregateOptions[]
): DataRow[] {
    // 1. Group data by row group fields
    const groupedData = groupDataByFields(data, groupedFields);
    
    // 2. For each group, pivot the data
    const result: DataRow[] = [];
    
    Object.entries(groupedData).forEach(([groupKey, groupRows]) => {
        const pivotedRow = createPivotedRow(groupKey, groupRows, groupedFields, pivotFields, valueFields);
        if (pivotedRow) {
            result.push(pivotedRow);
        }
    });
    
    return result;
}

function transformDataWithGrouping(
    data: DataRow[],
    groupedFields: string[],
    valueFields: AggregateOptions[]
): DataRow[] {
    const groupedData = groupDataByFields(data, groupedFields);
    const result: DataRow[] = [];
    
    Object.entries(groupedData).forEach(([groupKey, groupRows]) => {
        const aggregatedRow = createAggregatedRow(groupKey, groupRows, groupedFields, valueFields);
        if (aggregatedRow) {
            result.push(aggregatedRow);
        }
    });
    
    return result;
}

function transformDataWithAggregation(
    data: DataRow[],
    valueFields: AggregateOptions[]
): DataRow[] {
    const aggregatedRow: DataRow = {};
    
    valueFields.forEach(({ field, aggFunc }) => {
        aggregatedRow[field] = calculateAggregation(data, field, aggFunc);
    });
    
    return [aggregatedRow];
}

function groupDataByFields(data: DataRow[], fields: string[]): Record<string, DataRow[]> {
    return data.reduce<Record<string, DataRow[]>>((groups, row) => {
        const key = fields.map(field => String(row[field] || '')).join('|');
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(row);
        return groups;
    }, {});
}

function createPivotedRow(
    groupKey: string,
    groupRows: DataRow[],
    groupedFields: string[],
    pivotFields: string[],
    valueFields: AggregateOptions[]
): DataRow | null {
    if (groupRows.length === 0) return null;
    
    const pivotedRow: DataRow = {};
    
    // Add group field values
    const groupValues = groupKey.split('|');
    groupedFields.forEach((field, index) => {
        pivotedRow[field] = groupValues[index] || '';
    });
    
    // Group pivot data by pivot field combinations
    const pivotGroups = groupDataByFields(groupRows, pivotFields);
    
    // For each pivot combination, aggregate the value fields
    Object.entries(pivotGroups).forEach(([pivotKey, pivotRows]) => {
        const pivotValues = pivotKey.split('|');
        const pivotLabel = pivotValues.join(' - ');
        
        valueFields.forEach(({ field, aggFunc }) => {
            const aggregatedValue = calculateAggregation(pivotRows, field, aggFunc);
            const columnKey = valueFields.length === 1 
                ? pivotLabel 
                : `${field}_${pivotLabel}`;
            pivotedRow[columnKey] = aggregatedValue;
        });
    });
    
    return pivotedRow;
}

function createAggregatedRow(
    groupKey: string,
    groupRows: DataRow[],
    groupedFields: string[],
    valueFields: AggregateOptions[]
): DataRow | null {
    if (groupRows.length === 0) return null;
    
    const aggregatedRow: DataRow = {};
    
    // Add group field values
    const groupValues = groupKey.split('|');
    groupedFields.forEach((field, index) => {
        aggregatedRow[field] = groupValues[index] || '';
    });
    
    // Add aggregated values
    valueFields.forEach(({ field, aggFunc }) => {
        aggregatedRow[field] = calculateAggregation(groupRows, field, aggFunc);
    });
    
    // Add first row's non-aggregated fields (for reference)
    const firstRow = groupRows[0];
    Object.keys(firstRow).forEach(key => {
        if (!groupedFields.includes(key) && !valueFields.find(v => v.field === key)) {
            aggregatedRow[key] = firstRow[key];
        }
    });
    
    return aggregatedRow;
}

function calculateAggregation(data: DataRow[], field: string, aggFunc: string): unknown {
    const values = data
        .map(row => row[field])
        .filter(value => value !== null && value !== undefined)
        .map(value => Number(value))
        .filter(value => !isNaN(value));
    
    if (values.length === 0) {
        return getDefaultAggregateValue(aggFunc);
    }
    
    switch (aggFunc.toLowerCase()) {
        case 'sum':
            return values.reduce((sum, val) => sum + val, 0);
        
        case 'avg':
        case 'average':
            return values.reduce((sum, val) => sum + val, 0) / values.length;
        
        case 'min':
            return Math.min(...values);
        
        case 'max':
            return Math.max(...values);
        
        case 'count':
            return data.length;
        
        case 'countdistinct':
            const distinctValues = new Set(data.map(row => row[field]));
            return distinctValues.size;
        
        case 'first':
            return data.length > 0 ? data[0][field] : null;
        
        case 'last':
            return data.length > 0 ? data[data.length - 1][field] : null;
        
        default:
            console.warn(`Unknown aggregation function: ${aggFunc}`);
            return values.reduce((sum, val) => sum + val, 0); // Default to sum
    }
}

function getDefaultAggregateValue(aggFunc: string): unknown {
    switch (aggFunc.toLowerCase()) {
        case 'sum':
        case 'avg':
        case 'average':
            return 0;
        case 'min':
        case 'max':
            return null;
        case 'count':
        case 'countdistinct':
            return 0;
        case 'first':
        case 'last':
            return null;
        default:
            return 0;
    }
}