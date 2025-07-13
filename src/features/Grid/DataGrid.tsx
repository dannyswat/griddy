import React, { useMemo, useCallback, useState, useEffect, useRef } from "react";
import type { GridState } from "./gridState";
import type { ColumnState, ColState, GroupColState, ValueFormatterFunction, CellRendererFunction } from "./columnState";
import type { DataRow } from "../../models/DataRow";
import { calculateAllColumnWidths } from "./textMeasurement";
import "./DataGrid.css";

// Default value formatter
const defaultValueFormatter: ValueFormatterFunction = (value: unknown, _row: DataRow, col: ColState) => {
    if (value === null || value === undefined) {
        return '';
    }

    switch (col.dataType) {
        case 'number':
            const num = Number(value);
            if (isNaN(num)) return String(value);
            return col.dataFormat === 'currency' 
                ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num)
                : num.toLocaleString();
        
        case 'date':
            if (value instanceof Date) {
                return col.dataFormat 
                    ? value.toLocaleDateString(undefined, { dateStyle: col.dataFormat as any })
                    : value.toLocaleDateString();
            }
            return String(value);
        
        case 'boolean':
            return value ? 'Yes' : 'No';
        
        default:
            return String(value);
    }
};

// Default cell renderer
const defaultCellRenderer: CellRendererFunction = (formattedValue: string, _row: DataRow, _col: ColState) => {
    return <span>{formattedValue}</span>;
};

// Default header cell renderer
const defaultHeaderCellRenderer = (col: ColState) => {
    return (
        <div className="data-grid-header-content">
            <span className="data-grid-header-text">{col.headerName}</span>
            {col.sorted && (
                <span className={`data-grid-sort-indicator ${col.sorted}`}>
                    {col.sorted === 'asc' ? '↑' : '↓'}
                </span>
            )}
        </div>
    );
};

// Default group header cell renderer
const defaultGroupHeaderCellRenderer = (group: GroupColState) => {
    return <span>{group.headerName}</span>;
};

// Helper to check if column is a group column
const isGroupColumn = (column: ColumnState): column is GroupColState => {
    return 'children' in column;
};

// Helper to flatten columns
const flattenColumns = (columns: ColumnState[]): ColState[] => {
    const result: ColState[] = [];
    
    columns.forEach(column => {
        if (isGroupColumn(column)) {
            result.push(...flattenColumns(column.children));
        } else {
            result.push(column);
        }
    });
    
    return result;
};

// Virtualization constants
const ROW_HEIGHT = 40;
const HEADER_HEIGHT = 44;
const GROUP_HEADER_HEIGHT = 36;
const BUFFER_SIZE = 5; // Number of rows to render outside visible area

interface VirtualRange {
    start: number;
    end: number;
}

export default function DataGrid(props: GridState) {
    const {
        columns,
        data = [],
        totalRow,
        keyField = 'id',
        className = '',
        style,
        enableRowVirtualization = true,
        enableAutoColumnSizing = false,
        autoColumnSizingOptions = {}
    } = props;

    const containerRef = useRef<HTMLDivElement>(null);
    const [containerHeight, setContainerHeight] = useState(0);
    const [scrollTop, setScrollTop] = useState(0);

    // Flatten columns for rendering with auto-sizing if enabled
    const flatColumns = useMemo(() => {
        const flattened = flattenColumns(columns);
        
        if (enableAutoColumnSizing && data.length > 0) {
            return calculateAllColumnWidths(flattened, data, totalRow, autoColumnSizingOptions);
        }
        
        return flattened;
    }, [columns, enableAutoColumnSizing, data, totalRow, autoColumnSizingOptions]);

    // Calculate virtual range
    const virtualRange = useMemo((): VirtualRange => {
        if (!enableRowVirtualization || containerHeight === 0) {
            return { start: 0, end: data.length };
        }

        const headerGroupsHeight = columns.some(isGroupColumn) ? GROUP_HEADER_HEIGHT : 0;
        const availableHeight = containerHeight - HEADER_HEIGHT - headerGroupsHeight;
        const visibleRowCount = Math.ceil(availableHeight / ROW_HEIGHT);
        
        const start = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER_SIZE);
        const end = Math.min(data.length, start + visibleRowCount + (BUFFER_SIZE * 2));

        return { start, end };
    }, [enableRowVirtualization, containerHeight, scrollTop, data.length, columns]);

    // Visible data based on virtualization
    const visibleData = useMemo(() => {
        return enableRowVirtualization 
            ? data.slice(virtualRange.start, virtualRange.end)
            : data;
    }, [data, virtualRange, enableRowVirtualization]);

    // Handle scroll
    const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
        setScrollTop(event.currentTarget.scrollTop);
    }, []);

    // Resize observer to track container height
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setContainerHeight(entry.contentRect.height);
            }
        });

        resizeObserver.observe(container);
        return () => resizeObserver.disconnect();
    }, []);

    // Calculate total content height for scrollbar
    const totalContentHeight = useMemo(() => {
        const headerGroupsHeight = columns.some(isGroupColumn) ? GROUP_HEADER_HEIGHT : 0;
        // Don't include totalRow height in content height since it's sticky
        return HEADER_HEIGHT + headerGroupsHeight + (data.length * ROW_HEIGHT);
    }, [data.length, columns]);

    // Render header groups if there are grouped columns
    const renderHeaderGroups = () => {
        const hasGroups = columns.some(isGroupColumn);
        if (!hasGroups) return null;

        let currentColumnIndex = 1; // CSS Grid columns are 1-indexed

        return (
            <div 
                className="data-grid-header-groups" 
                style={{ 
                    height: GROUP_HEADER_HEIGHT,
                    gridTemplateColumns: groupHeaderGridTemplateColumns
                }}
            >
                {columns.map((column, index) => {
                    if (isGroupColumn(column)) {
                        const renderer = column.headerCellRenderer || defaultGroupHeaderCellRenderer;
                        const childrenCount = flattenColumns(column.children).length;
                        
                        const groupElement = (
                            <div 
                                key={column.groupId || index}
                                className={`data-grid-header-group ${column.headerClassName || ''}`}
                                style={enableAutoColumnSizing ? {} : {
                                    gridColumn: `${currentColumnIndex} / ${currentColumnIndex + childrenCount}`
                                }}
                            >
                                {renderer(column)}
                            </div>
                        );
                        
                        if (!enableAutoColumnSizing) {
                            currentColumnIndex += childrenCount;
                        }
                        
                        return groupElement;
                    } else {
                        // For non-grouped columns, render a placeholder
                        const placeholderElement = (
                            <div 
                                key={column.colId || index}
                                className="data-grid-header-group-placeholder"
                                style={enableAutoColumnSizing ? {} : {
                                    gridColumn: `${currentColumnIndex} / ${currentColumnIndex + 1}`
                                }}
                            />
                        );
                        
                        if (!enableAutoColumnSizing) {
                            currentColumnIndex += 1;
                        }
                        
                        return placeholderElement;
                    }
                })}
            </div>
        );
    };

    // Render column headers
    const renderHeaders = () => {
        const hasGroups = columns.some(isGroupColumn);
        const headerTop = hasGroups ? GROUP_HEADER_HEIGHT : 0;
        
        return (
            <div 
                className="data-grid-headers" 
                style={{ 
                    height: HEADER_HEIGHT,
                    top: `${headerTop}px`
                }}
            >
                {flatColumns.map((column, index) => {
                    const renderer = column.headerCellRenderer || defaultHeaderCellRenderer;
                    
                    return (
                        <div 
                            key={column.colId || index}
                            className={`data-grid-header ${column.headerClassName}`}
                            style={{ 
                                width: enableAutoColumnSizing ? `${column.width}px` : undefined,
                                minWidth: enableAutoColumnSizing ? undefined : 0,
                                maxWidth: enableAutoColumnSizing ? undefined : 'none'
                            }}
                        >
                            {renderer(column)}
                        </div>
                    );
                })}
            </div>
        );
    };

    // Render a single row
    const renderRow = (row: DataRow, _rowIndex: number, actualRowIndex: number) => (
        <div 
            key={String(row[keyField] || actualRowIndex)} 
            className="data-grid-row"
            style={{ 
                height: ROW_HEIGHT,
                transform: enableRowVirtualization ? `translateY(${actualRowIndex * ROW_HEIGHT}px)` : undefined,
                position: enableRowVirtualization ? 'absolute' : undefined,
                width: '100%'
            }}
        >
            {flatColumns.map((column, colIndex) => {
                const cellValue = row[column.field];
                const valueFormatter = column.valueFormatter || defaultValueFormatter;
                const cellRenderer = column.cellRenderer || defaultCellRenderer;
                
                const formattedValue = valueFormatter(cellValue, row, column);
                
                return (
                    <div 
                        key={`${actualRowIndex}-${column.colId || colIndex}`}
                        className={`data-grid-cell ${column.cellClassName}`}
                        data-type={column.dataType}
                        style={{ 
                            width: enableAutoColumnSizing ? `${column.width}px` : undefined,
                            minWidth: enableAutoColumnSizing ? undefined : 0,
                            maxWidth: enableAutoColumnSizing ? undefined : 'none'
                        }}
                    >
                        {cellRenderer(formattedValue, row, column)}
                    </div>
                );
            })}
        </div>
    );

    // Render data rows
    const renderRows = () => {
        if (!data || data.length === 0) {
            return (
                <div className="data-grid-no-data" style={{ height: ROW_HEIGHT }}>
                    <div style={{ 
                        gridColumn: `1 / ${flatColumns.length + 1}`, 
                        textAlign: 'center', 
                        padding: '20px' 
                    }}>
                        No data to display
                    </div>
                </div>
            );
        }

        return visibleData.map((row, index) => {
            const actualRowIndex = enableRowVirtualization ? virtualRange.start + index : index;
            return renderRow(row, index, actualRowIndex);
        });
    };

    // Render total row if provided
    const renderTotalRow = () => {
        if (!totalRow) return null;

        return (
            <div 
                className="data-grid-total-row"
                style={{ 
                    height: ROW_HEIGHT,
                    // Remove transform and position since it's now sticky
                    width: '100%'
                }}
            >
                {flatColumns.map((column, colIndex) => {
                    const cellValue = totalRow[column.field];
                    const valueFormatter = column.valueFormatter || defaultValueFormatter;
                    const cellRenderer = column.cellRenderer || defaultCellRenderer;
                    
                    const formattedValue = valueFormatter(cellValue, totalRow, column);
                    
                    return (
                        <div 
                            key={`total-${column.colId || colIndex}`}
                            className={`data-grid-cell data-grid-total-cell ${column.cellClassName}`}
                            data-type={column.dataType}
                            style={{ 
                                width: enableAutoColumnSizing ? `${column.width}px` : undefined,
                                minWidth: enableAutoColumnSizing ? undefined : 0,
                                maxWidth: enableAutoColumnSizing ? undefined : 'none'
                            }}
                        >
                            {cellRenderer(formattedValue, totalRow, column)}
                        </div>
                    );
                })}
            </div>
        );
    };

    // Calculate grid template columns
    const gridTemplateColumns = useMemo(() => {
        if (enableAutoColumnSizing) {
            return flatColumns.map(col => `${col.width}px`).join(' ');
        }
        return `repeat(${flatColumns.length}, 1fr)`;
    }, [flatColumns, enableAutoColumnSizing]);

    // Calculate grid template columns for group headers
    const groupHeaderGridTemplateColumns = useMemo(() => {
        if (enableAutoColumnSizing) {
            // For auto-sizing, calculate widths for each top-level column/group
            const groupWidths: string[] = [];
            
            columns.forEach(column => {
                if (isGroupColumn(column)) {
                    // Sum up widths of all children
                    const childrenFlat = flattenColumns(column.children);
                    const totalWidth = childrenFlat.reduce((sum, childCol) => {
                        const matchingFlatCol = flatColumns.find(fc => fc.colId === childCol.colId);
                        return sum + (matchingFlatCol?.width || childCol.width);
                    }, 0);
                    groupWidths.push(`${totalWidth}px`);
                } else {
                    // Single column
                    const matchingFlatCol = flatColumns.find(fc => fc.colId === column.colId);
                    groupWidths.push(`${matchingFlatCol?.width || column.width}px`);
                }
            });
            
            return groupWidths.join(' ');
        } else {
            // When auto-sizing is disabled, create a grid that matches the individual columns
            // Each group spans the number of columns equal to its children count
            const groupSpans: string[] = [];
            
            columns.forEach(column => {
                if (isGroupColumn(column)) {
                    const childrenCount = flattenColumns(column.children).length;
                    // Each group gets a number of fr units equal to its children count
                    for (let i = 0; i < childrenCount; i++) {
                        groupSpans.push('1fr');
                    }
                } else {
                    // Single column gets 1fr
                    groupSpans.push('1fr');
                }
            });
            
            return groupSpans.join(' ');
        }
    }, [columns, flatColumns, enableAutoColumnSizing]);

    return (
        <div 
            ref={containerRef}
            className={`data-grid-container ${className}`}
            style={{ 
                width: '100%', 
                height: '100%', 
                overflow: 'auto',
                ...style 
            }}
            onScroll={handleScroll}
        >
            <div 
                className="data-grid-content"
                style={{
                    height: enableRowVirtualization ? totalContentHeight : undefined,
                    position: 'relative',
                    '--grid-template-columns': gridTemplateColumns
                } as React.CSSProperties & { '--grid-template-columns': string }}
            >
                {renderHeaderGroups()}
                {renderHeaders()}
                <div 
                    className="data-grid-body"
                    style={{
                        position: enableRowVirtualization ? 'relative' : undefined,
                        height: enableRowVirtualization ? data.length * ROW_HEIGHT : undefined
                    }}
                >
                    {renderRows()}
                </div>
                {renderTotalRow()}
            </div>
        </div>
    );
}