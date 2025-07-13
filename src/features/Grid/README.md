# DataGrid Component

A high-performance, feature-rich data grid component built with React and TypeScript.

## Features

### ✨ Core Features
- **Row Virtualization**: Efficiently renders large datasets with smooth scrolling
- **Grouped Column Headers**: Support for multi-level column grouping
- **Auto Column Sizing**: Automatic width calculation based on content analysis
- **Smart Content Sampling**: Intelligent sampling for performance with large datasets
- **Data Type Support**: Built-in formatting for numbers, dates, booleans, and strings
- **Custom Renderers**: Extensible cell and header rendering system
- **Responsive Design**: Works across different screen sizes
- **TypeScript**: Full type safety and IntelliSense support

### 🎨 Presentation Features
- **100% Width/Height**: Always fills the container
- **Sticky Headers**: Column headers stay visible during scrolling
- **Hover Effects**: Interactive row highlighting
- **Sort Indicators**: Visual feedback for sorted columns
- **Professional Styling**: Clean, modern appearance

## Usage

### Basic Example

```tsx
import DataGrid from './features/Grid/DataGrid';
import type { ColumnState } from './features/Grid/columnState';

const columns: ColumnState[] = [
  {
    field: 'id',
    colId: 'id',
    headerName: 'ID',
    dataType: 'number',
    width: 80,
    // ... other properties
  },
  // ... more columns
];

const data = [
  { id: 1, name: 'John Doe', age: 30 },
  // ... more data
];

function MyApp() {
  return (
    <div style={{ height: '400px' }}>
      <DataGrid 
        data={data}
        columns={columns}
        enableRowVirtualization={true}
        enableAutoColumnSizing={true}
      />
    </div>
  );
}
```

### With Grouped Columns

```tsx
const groupedColumns: ColumnState[] = [
  {
    groupId: 'personal',
    headerName: 'Personal Info',
    children: [
      {
        field: 'firstName',
        colId: 'firstName',
        headerName: 'First Name',
        dataType: 'string',
        width: 120,
        // ... other properties
      },
      {
        field: 'lastName',
        colId: 'lastName',
        headerName: 'Last Name',
        dataType: 'string',
        width: 120,
        // ... other properties
      }
    ]
  }
];
```

## Props

### GridState Interface

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `columns` | `ColumnState[]` | **Required** | Column definitions |
| `data` | `DataRow[]` | `[]` | Data to display |
| `totalRow` | `DataRow` | `undefined` | Optional summary row |
| `keyField` | `string` | `'id'` | Field to use as row key |
| `className` | `string` | `''` | Additional CSS class |
| `style` | `CSSProperties` | `undefined` | Inline styles |
| `enableRowVirtualization` | `boolean` | `true` | Enable virtualization for large datasets |
| `enableAutoColumnSizing` | `boolean` | `false` | Auto-calculate column widths based on content |
| `autoColumnSizingOptions` | `AutoColumnSizingOptions` | `{}` | Configuration for auto-sizing behavior |

### Column Configuration

#### ColState (Regular Column)

| Property | Type | Description |
|----------|------|-------------|
| `field` | `string` | Data field name |
| `colId` | `string` | Unique column identifier |
| `headerName` | `string` | Display name in header |
| `dataType` | `DataType` | Data type for formatting |
| `width` | `number` | Column width in pixels |
| `sorted` | `SortState` | Sort direction |
| `valueFormatter` | `Function` | Custom value formatting |
| `cellRenderer` | `Function` | Custom cell renderer |
| `headerCellRenderer` | `Function` | Custom header renderer |

#### AutoColumnSizingOptions

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `maxSampleSize` | `number` | `100` | Maximum rows to sample for width calculation |
| `minWidth` | `number` | `60` | Minimum column width in pixels |
| `maxWidth` | `number` | `300` | Maximum column width in pixels |
| `padding` | `number` | `24` | Extra padding added to measured width |

#### GroupColState (Grouped Column)

| Property | Type | Description |
|----------|------|-------------|
| `groupId` | `string` | Unique group identifier |
| `headerName` | `string` | Group header display name |
| `children` | `ColumnState[]` | Child columns |
| `headerCellRenderer` | `Function` | Custom group header renderer |

## Auto Column Sizing

The DataGrid supports intelligent auto column sizing that analyzes both header text and data content to determine optimal column widths.

### Basic Usage

```tsx
<DataGrid 
  data={data}
  columns={columns}
  enableAutoColumnSizing={true}
/>
```

### Advanced Configuration

```tsx
<DataGrid 
  data={data}
  columns={columns}
  enableAutoColumnSizing={true}
  autoColumnSizingOptions={{
    maxSampleSize: 200,    // Sample up to 200 rows for width calculation
    minWidth: 80,          // Minimum column width
    maxWidth: 400,         // Maximum column width
    padding: 32            // Extra padding around content
  }}
/>
```

### How It Works

1. **Header Analysis**: Measures the width of header text using canvas text metrics
2. **Total Row Analysis**: Includes total/summary row values in width calculation (often the widest content)
3. **Content Sampling**: Samples data rows (configurable amount) to find the widest content
4. **Smart Formatting**: Applies the same formatting logic used for display (currency, dates, etc.)
5. **Type-Aware Minimums**: Applies sensible minimum widths based on data type
6. **Performance Optimization**: Uses early exit when maximum width is reached

### Performance Considerations

- **Sampling**: Only samples a subset of data (default: 100 rows) for performance
- **Caching**: Width calculations are memoized and only recalculated when data/columns change
- **Early Exit**: Stops measuring when maximum width is reached
- **Canvas Measurement**: Uses efficient canvas text measurement for accurate results

## Data Types

The component supports the following data types with automatic formatting:

- **`number`**: Right-aligned, supports currency formatting
- **`date`**: Formatted using `toLocaleDateString()`
- **`boolean`**: Displays as "Yes"/"No"
- **`string`**: Default left-aligned text

## Custom Renderers

### Cell Renderer

```tsx
const customCellRenderer: CellRendererFunction = (formattedValue, row, col) => {
  if (col.field === 'status') {
    return (
      <span className={`status-${row.status}`}>
        {formattedValue}
      </span>
    );
  }
  return <span>{formattedValue}</span>;
};
```

### Value Formatter

```tsx
const customFormatter: ValueFormatterFunction = (value, row, col) => {
  if (col.dataType === 'number' && col.dataFormat === 'percentage') {
    return `${(Number(value) * 100).toFixed(1)}%`;
  }
  return String(value);
};
```

## Performance

### Row Virtualization

The component automatically virtualizes rows when `enableRowVirtualization` is enabled (default: `true`). This allows smooth scrolling through thousands of rows by only rendering visible items plus a small buffer.

- **Buffer Size**: 5 rows above and below visible area
- **Row Height**: Fixed at 40px for consistent performance
- **Memory Efficient**: Only visible rows are in the DOM

### Optimization Tips

1. **Use Fixed Heights**: Set a specific height on the container for best performance
2. **Enable Auto Sizing**: Use `enableAutoColumnSizing` for content-based widths
3. **Minimal Re-renders**: Memoize data and column definitions when possible
4. **Key Field**: Provide a unique `keyField` for efficient React reconciliation

## Styling

The component uses CSS custom properties for theming:

```css
.data-grid-container {
  --grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
}
```

### CSS Classes

- `.data-grid-container`: Main container
- `.data-grid-header`: Column headers
- `.data-grid-header-group`: Group headers
- `.data-grid-row`: Data rows
- `.data-grid-cell`: Individual cells
- `.data-grid-total-row`: Summary row

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

Requires support for:
- CSS Grid
- ResizeObserver
- CSS Custom Properties
- ES2017+ features
