import './App.css'
import DataGrid from './features/Grid/DataGrid'
import { sampleData, sampleColumns } from './sample'
import { smallDataset, mediumDataset, largeDataset, performanceTestColumns } from './performanceTest'
import { useState } from 'react'
import type { DataRow } from './models/DataRow'

function App() {
  const [currentDataset, setCurrentDataset] = useState<'sample' | 'small' | 'medium' | 'large'>('sample');
  const [autoSizing, setAutoSizing] = useState(true);
  
  const datasets = {
    sample: { data: sampleData, columns: sampleColumns, name: 'Sample Data (50 rows)' },
    small: { data: smallDataset, columns: performanceTestColumns, name: 'Small Dataset (100 rows)' },
    medium: { data: mediumDataset, columns: performanceTestColumns, name: 'Medium Dataset (1,000 rows)' },
    large: { data: largeDataset, columns: performanceTestColumns, name: 'Large Dataset (10,000 rows)' }
  };

  const currentData = datasets[currentDataset];

  const totalRow: DataRow = {
    salary: currentData.data.reduce((sum, row) => sum + (row.salary as number || 0), 0),
    age: Math.round(currentData.data.reduce((sum, row) => sum + (row.age as number || 0), 0) / currentData.data.length),
  };

  return (
    <div style={{ padding: '20px', height: '150vh', display: 'flex', flexDirection: 'column' }}>
      <h1>Griddy - Advanced DataGrid Component</h1>
      <p>A high-performance React data grid with row virtualization, grouped columns, and custom renderers.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Dataset:</label>
          {Object.entries(datasets).map(([key, dataset]) => (
            <button
              key={key}
              onClick={() => setCurrentDataset(key as any)}
              style={{
                marginRight: '10px',
                padding: '8px 16px',
                backgroundColor: currentDataset === key ? '#007acc' : '#f0f0f0',
                color: currentDataset === key ? 'white' : 'black',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {dataset.name}
            </button>
          ))}
        </div>
        
        <div>
          <label style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={autoSizing}
              onChange={(e) => setAutoSizing(e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            Enable Auto Column Sizing
          </label>
          <p style={{ margin: '5px 0 0 24px', fontSize: '14px', color: '#666' }}>
            Automatically adjusts column widths to fit content (header + data sampling)
          </p>
        </div>
      </div>
      
      <div style={{ 
        flex: 1,
        border: '1px solid #ccc', 
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <DataGrid 
          data={currentData.data} 
          totalRow={totalRow}
          columns={currentData.columns} 
          enableRowVirtualization={true}
          enableAutoColumnSizing={autoSizing}
          autoColumnSizingOptions={{
            maxSampleSize: 200,
            minWidth: 60,
            maxWidth: 400,
            padding: 24
          }}
          keyField="id"
        />
      </div>
      
      <div style={{ 
        marginTop: '20px', 
        padding: '16px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <h3 style={{ margin: '0 0 12px 0' }}>🚀 Features Demonstrated</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
          <div>
            <h4>Performance Features:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>✅ Row Virtualization (smooth scrolling)</li>
              <li>✅ Auto Column Sizing (fits content)</li>
              <li>✅ Efficient DOM rendering</li>
              <li>✅ Memory optimization</li>
              <li>✅ Smart sampling for large datasets</li>
            </ul>
          </div>
          <div>
            <h4>UI Features:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>✅ Grouped Column Headers</li>
              <li>✅ Sticky Headers</li>
              <li>✅ Hover Effects</li>
              <li>✅ Professional Styling</li>
            </ul>
          </div>
          <div>
            <h4>Data Features:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>✅ Multiple Data Types</li>
              <li>✅ Currency Formatting</li>
              <li>✅ Date Formatting</li>
              <li>✅ Boolean Display</li>
            </ul>
          </div>
        </div>
        
        <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#e7f3ff', borderRadius: '4px' }}>
          <strong>💡 Auto-Sizing Tip:</strong> Toggle auto column sizing to see the difference! 
          Auto-sizing analyzes headers and data content to calculate optimal widths. 
          It uses intelligent sampling (max 200 rows) for performance with large datasets.
        </div>
      </div>
    </div>
  )
}

export default App
