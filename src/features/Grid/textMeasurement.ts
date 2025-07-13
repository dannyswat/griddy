// Text measurement utilities for auto column sizing
import type { DataRow } from "../../models/DataRow";
import type { ColState } from "./columnState";

// Canvas for text measurement - cached for performance
let measurementCanvas: HTMLCanvasElement | null = null;
let measurementContext: CanvasRenderingContext2D | null = null;
let isInitialized = false;

// Initialize canvas for text measurement
const initializeMeasurementCanvas = () => {
    if (!isInitialized) {
        try {
            measurementCanvas = document.createElement('canvas');
            measurementContext = measurementCanvas.getContext('2d');
            isInitialized = true;
        } catch (error) {
            console.warn('Failed to initialize text measurement canvas:', error);
            measurementContext = null;
        }
    }
    return measurementContext;
};

// Default font settings that match our CSS
const DEFAULT_FONT = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif';
const HEADER_FONT = '600 14px -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif';

// Fallback character width estimation (average character width in pixels)
const CHAR_WIDTH_ESTIMATE = 7;

// Measure text width using canvas
export const measureTextWidth = (text: string, font: string = DEFAULT_FONT): number => {
    if (!text) return 0;
    
    const ctx = initializeMeasurementCanvas();
    if (!ctx) {
        // Fallback: estimate width based on character count
        return text.length * CHAR_WIDTH_ESTIMATE;
    }
    
    try {
        ctx.font = font;
        return ctx.measureText(text).width;
    } catch (error) {
        // Fallback if measurement fails
        return text.length * CHAR_WIDTH_ESTIMATE;
    }
};

// Calculate the ideal width for a column based on its content
export const calculateColumnWidth = (
    column: ColState,
    data: DataRow[],
    totalRow: DataRow | undefined = undefined,
    maxSampleSize: number = 100,
    minWidth: number = 60,
    maxWidth: number = 300,
    padding: number = 24 // 12px on each side
): number => {
    const ctx = initializeMeasurementCanvas();
    if (!ctx) {
        return column.width || 120; // Fallback to default width
    }

    let maxWidth_measured = 0;

    // Measure header text
    ctx.font = HEADER_FONT;
    const headerWidth = ctx.measureText(column.headerName).width;
    
    // Add extra space for header-specific elements:
    // - 20px reserved space for potential sort indicators (margin + icon)
    // Note: Base padding is added later in the function, so don't double-count it
    const headerWithSortSpace = headerWidth + 20; // Sort indicator space
    
    maxWidth_measured = Math.max(maxWidth_measured, headerWithSortSpace);

    // Helper function to format and measure cell value
    const formatAndMeasureValue = (cellValue: unknown): number => {
        let displayText = '';

        // Format the value the same way it would be displayed
        if (cellValue === null || cellValue === undefined) {
            displayText = '';
        } else {
            switch (column.dataType) {
                case 'number':
                    const num = Number(cellValue);
                    if (isNaN(num)) {
                        displayText = String(cellValue);
                    } else {
                        displayText = column.dataFormat === 'currency' 
                            ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num)
                            : num.toLocaleString();
                    }
                    break;
                
                case 'date':
                    if (cellValue instanceof Date) {
                        displayText = column.dataFormat 
                            ? cellValue.toLocaleDateString(undefined, { dateStyle: column.dataFormat as any })
                            : cellValue.toLocaleDateString();
                    } else {
                        displayText = String(cellValue);
                    }
                    break;
                
                case 'boolean':
                    displayText = cellValue ? 'Yes' : 'No';
                    break;
                
                default:
                    displayText = String(cellValue);
            }
        }

        return ctx.measureText(displayText).width;
    };

    // Set font for cell content measurement
    ctx.font = DEFAULT_FONT;

    // Measure total row if provided (total row values are often the widest)
    if (totalRow && totalRow[column.field] !== undefined) {
        const totalCellWidth = formatAndMeasureValue(totalRow[column.field]);
        maxWidth_measured = Math.max(maxWidth_measured, totalCellWidth);
        
        // Early exit optimization: if total row already reaches max width, no need to check data
        if (maxWidth_measured >= maxWidth - padding) {
            const typeMinWidth = getTypeMinWidth(column, minWidth);
            return Math.ceil(Math.max(typeMinWidth, Math.min(maxWidth, maxWidth_measured + padding)));
        }
    }

    // Sample data for measurement (to avoid performance issues with large datasets)
    const sampleData = data.length > maxSampleSize 
        ? data.slice(0, maxSampleSize) 
        : data;
    
    for (const row of sampleData) {
        const cellValue = row[column.field];
        const cellWidth = formatAndMeasureValue(cellValue);
        maxWidth_measured = Math.max(maxWidth_measured, cellWidth);
        
        // Early exit optimization: if we've reached max width, no need to continue
        if (maxWidth_measured >= maxWidth - padding) {
            break;
        }
    }

    // For certain data types, apply minimum widths that make sense
    const typeMinWidth = getTypeMinWidth(column, minWidth);

    // Add padding and constrain to min/max bounds
    const finalWidth = Math.max(typeMinWidth, Math.min(maxWidth, maxWidth_measured + padding));
    
    return Math.ceil(finalWidth);
};

// Helper function to get type-specific minimum width
const getTypeMinWidth = (column: ColState, minWidth: number): number => {
    switch (column.dataType) {
        case 'number':
            if (column.dataFormat === 'currency') {
                return Math.max(minWidth, 100); // Currency needs more space
            } else {
                return Math.max(minWidth, 80); // Regular numbers
            }
        case 'date':
            return Math.max(minWidth, 100); // Dates need consistent space
        case 'boolean':
            return Math.max(minWidth, 70); // Yes/No columns
        default:
            return minWidth;
    }
};

// Calculate optimal widths for all columns
export const calculateAllColumnWidths = (
    columns: ColState[],
    data: DataRow[],
    totalRow: DataRow | undefined = undefined,
    options: {
        maxSampleSize?: number;
        minWidth?: number;
        maxWidth?: number;
        padding?: number;
    } = {}
): ColState[] => {
    const {
        maxSampleSize = 100,
        minWidth = 60,
        maxWidth = 300,
        padding = 24
    } = options;

    return columns.map(column => ({
        ...column,
        width: calculateColumnWidth(column, data, totalRow, maxSampleSize, minWidth, maxWidth, padding)
    }));
};

// Calculate total width of all columns
export const calculateTotalColumnsWidth = (columns: ColState[]): number => {
    return columns.reduce((total, col) => total + col.width, 0);
};

// Clean up measurement canvas (optional, for memory management)
export const cleanupMeasurementCanvas = (): void => {
    measurementCanvas = null;
    measurementContext = null;
    isInitialized = false;
};
