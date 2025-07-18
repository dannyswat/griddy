import { useState } from 'react';
import DataGrid from '../Grid/DataGrid';
import { useGridBuilder } from './useGridBuilder';
import { exampleColumnDefs, exampleRowData } from './example';

export default function GridBuilderDemo() {
    const [pivotMode, setPivotMode] = useState(false);
    
    // Use the grid builder to convert column definitions to column state
    const { columnState, rowData } = useGridBuilder({
        columnDefs: exampleColumnDefs,
        rowData: exampleRowData,
        pivotMode
    });

    return (
        <div style={{ padding: '20px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <h1>GridBuilder Demo</h1>
            <p>Demonstrates column definition conversion and pivot mode functionality.</p>
            
            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={pivotMode}
                        onChange={(e) => setPivotMode(e.target.checked)}
                        style={{ marginRight: '8px' }}
                    />
                    Enable Pivot Mode
                </label>
                <p style={{ margin: '5px 0 0 24px', fontSize: '14px', color: '#666' }}>
                    {pivotMode 
                        ? 'Shows row groups on left, then pivot columns with aggregated values'
                        : 'Shows all columns in their original definition order'
                    }
                </p>
            </div>

            <div style={{ 
                flex: 1,
                border: '1px solid #ccc', 
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
                <DataGrid 
                    data={rowData} 
                    columns={columnState}
                    enableRowVirtualization={true}
                    enableAutoColumnSizing={true}
                    autoColumnSizingOptions={{
                        maxSampleSize: 100,
                        minWidth: 80,
                        maxWidth: 300,
                        padding: 24
                    }}
                    keyField="athlete"
                />
            </div>

            <div style={{ 
                marginTop: '20px', 
                padding: '16px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '8px',
                border: '1px solid #e9ecef',
                color: '#333'
            }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#333' }}>🔧 GridBuilder Features</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
                    <div>
                        <h4 style={{ color: '#333' }}>Normal Mode:</h4>
                        <ul style={{ margin: 0, paddingLeft: '20px', color: '#555' }}>
                            <li>✅ Direct column definition mapping</li>
                            <li>✅ Groups preserved as defined</li>
                            <li>✅ Original column order maintained</li>
                            <li>✅ All standard column features</li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ color: '#333' }}>Pivot Mode:</h4>
                        <ul style={{ margin: 0, paddingLeft: '20px', color: '#555' }}>
                            <li>✅ Row group columns on left</li>
                            <li>✅ Dynamic pivot column generation</li>
                            <li>✅ Aggregated value columns</li>
                            <li>✅ Automatic grouping of multiple values</li>
                        </ul>
                    </div>
                </div>
                
                <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#e7f3ff', borderRadius: '4px', color: '#0066cc' }}>
                    <strong>💡 Pivot Mode:</strong> Toggle pivot mode to see how row groups (Country) appear first, 
                    followed by dynamically generated columns for each Year-Sport combination, 
                    each containing the aggregated medal counts (Gold, Silver, Bronze).
                </div>
            </div>
        </div>
    );
}
