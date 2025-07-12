Griddy
- columns ColumnDefinition[]
- data DataRow[]

ColumnDefinition = ColDef | GroupColDef


AggregateState
- value unknown

GridAggregateState = Record<string, AggregateState>

Grid (Presentational component)
- columns ColumnState[]
- keyField string = 'id'
- data? DataRow[]
- totalRow? DataRow
- className string
- rowsVirtualization boolean
- _scrollState number

ColumnState = ColState | GroupColState

ColState
- field string
- colId string
- width string
- headerName string
- headerClassName string
- headerCellRenderer (state ColState) => ReactNode
- cellClassName string
- valueFormatter (value unknown, state ColState) => string
- dataType DataType
- cellRenderer (formattedValue string, row DataRow, state ColState) => ReactNode
- sorted 'asc' | 'desc' | undefined
- filtered boolean
- grid GridState

GroupColState
- groupId string
- headerName string
- headerClassName string
- headerCellRender (state ColState) => ReactNode
- grid GridState