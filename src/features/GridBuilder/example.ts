// Example usage of the GridBuilder
import type { ColumnDefinition } from './columnDefinition';
import type { DataRow } from '../../models/DataRow';
import { useGridBuilder } from './useGridBuilder';

// Example column definitions
export const exampleColumnDefs: ColumnDefinition[] = [
    {
        field: 'country',
        headerName: 'Country',
        rowGroup: true,
        width: 150
    },
    {
        field: 'year',
        headerName: 'Year', 
        pivot: true,
        width: 100
    },
    {
        field: 'sport',
        headerName: 'Sport',
        pivot: true,
        width: 120
    },
    {
        field: 'gold',
        headerName: 'Gold',
        dataType: 'number',
        aggFunc: 'sum',
        width: 100
    },
    {
        field: 'silver',
        headerName: 'Silver',
        dataType: 'number', 
        aggFunc: 'sum',
        width: 100
    },
    {
        field: 'bronze',
        headerName: 'Bronze',
        dataType: 'number',
        aggFunc: 'sum',
        width: 100
    },
    {
        field: 'athlete',
        headerName: 'Athlete',
        width: 150
    }
];

// Example data
export const exampleRowData: DataRow[] = [
    { country: 'USA', year: 2020, sport: 'Swimming', gold: 5, silver: 3, bronze: 2, athlete: 'Katie Ledecky' },
    { country: 'USA', year: 2020, sport: 'Track', gold: 7, silver: 6, bronze: 1, athlete: 'Ryan Crouser' },
    { country: 'USA', year: 2024, sport: 'Swimming', gold: 8, silver: 5, bronze: 3, athlete: 'Bobby Finke' },
    { country: 'GBR', year: 2020, sport: 'Swimming', gold: 1, silver: 2, bronze: 1, athlete: 'Adam Peaty' },
    { country: 'GBR', year: 2020, sport: 'Track', gold: 2, silver: 1, bronze: 1, athlete: 'Mo Farah' },
    { country: 'GBR', year: 2024, sport: 'Swimming', gold: 3, silver: 5, bronze: 2, athlete: 'Tom Dean' },
];

// Normal mode example
export function useNormalGridExample() {
    return useGridBuilder({
        columnDefs: exampleColumnDefs,
        rowData: exampleRowData,
        pivotMode: false
    });
}

// Pivot mode example  
export function usePivotGridExample() {
    return useGridBuilder({
        columnDefs: exampleColumnDefs,
        rowData: exampleRowData,
        pivotMode: true
    });
}

/*
Expected output in Normal Mode:
- All columns displayed as defined

Expected output in Pivot Mode:
1. Row Group Columns: [Country]
2. Pivot Columns: 
   - Group: "2020 - Swimming" 
     - Gold, Silver, Bronze
   - Group: "2020 - Track"
     - Gold, Silver, Bronze  
   - Group: "2024 - Swimming"
     - Gold, Silver, Bronze
3. Regular Columns: [Athlete]

The pivot creates dynamic columns based on unique combinations of year and sport,
with the aggregated value columns (gold, silver, bronze) under each combination.
*/
