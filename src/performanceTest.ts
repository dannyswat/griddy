import type { DataRow } from './models/DataRow';
import type { ColumnState } from './features/Grid/columnState';

// Generate a large dataset for performance testing
export const generateLargeDataset = (count: number = 1000): DataRow[] => {
  const firstNames = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Diana', 'Edward', 'Fiona', 'George', 'Helen'];
  const lastNames = ['Doe', 'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez'];
  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
  
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
    lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
    email: `user${index + 1}@example.com`,
    age: Math.floor(Math.random() * 40) + 22,
    salary: Math.floor(Math.random() * 80000) + 40000,
    department: departments[Math.floor(Math.random() * departments.length)],
    isActive: Math.random() > 0.2,
    hireDate: new Date(2018 + Math.floor(Math.random() * 7), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
    performance: Math.floor(Math.random() * 5) + 1
  }));
};

// Column configuration for performance testing
export const performanceTestColumns: ColumnState[] = [
  {
    field: 'id',
    colId: 'id',
    headerName: 'ID',
    headerClassName: '',
    cellClassName: '',
    dataType: 'number',
    dataFormat: '',
    width: 60,
    sorted: undefined,
    filtered: false
  },
  {
    groupId: 'personal',
    headerName: 'Personal Information',
    headerClassName: 'group-personal',
    children: [
      {
        field: 'firstName',
        colId: 'firstName',
        headerName: 'First Name',
        headerClassName: '',
        cellClassName: '',
        dataType: 'string',
        dataFormat: '',
        width: 100,
        sorted: undefined,
        filtered: false
      },
      {
        field: 'lastName',
        colId: 'lastName',
        headerName: 'Last Name',
        headerClassName: '',
        cellClassName: '',
        dataType: 'string',
        dataFormat: '',
        width: 100,
        sorted: undefined,
        filtered: false
      },
      {
        field: 'email',
        colId: 'email',
        headerName: 'Email',
        headerClassName: '',
        cellClassName: '',
        dataType: 'string',
        dataFormat: '',
        width: 180,
        sorted: undefined,
        filtered: false
      },
      {
        field: 'age',
        colId: 'age',
        headerName: 'Age',
        headerClassName: '',
        cellClassName: '',
        dataType: 'number',
        dataFormat: '',
        width: 60,
        sorted: undefined,
        filtered: false
      }
    ]
  },
  {
    groupId: 'employment',
    headerName: 'Employment Details',
    headerClassName: 'group-employment',
    children: [
      {
        field: 'department',
        colId: 'department',
        headerName: 'Department',
        headerClassName: '',
        cellClassName: '',
        dataType: 'string',
        dataFormat: '',
        width: 120,
        sorted: undefined,
        filtered: false
      },
      {
        field: 'salary',
        colId: 'salary',
        headerName: 'Salary',
        headerClassName: '',
        cellClassName: '',
        dataType: 'number',
        dataFormat: 'currency',
        width: 100,
        sorted: undefined,
        filtered: false
      },
      {
        field: 'performance',
        colId: 'performance',
        headerName: 'Rating',
        headerClassName: '',
        cellClassName: '',
        dataType: 'number',
        dataFormat: '',
        width: 70,
        sorted: undefined,
        filtered: false
      },
      {
        field: 'isActive',
        colId: 'isActive',
        headerName: 'Active',
        headerClassName: '',
        cellClassName: '',
        dataType: 'boolean',
        dataFormat: '',
        width: 70,
        sorted: undefined,
        filtered: false
      },
      {
        field: 'hireDate',
        colId: 'hireDate',
        headerName: 'Hire Date',
        headerClassName: '',
        cellClassName: '',
        dataType: 'date',
        dataFormat: '',
        width: 100,
        sorted: undefined,
        filtered: false
      }
    ]
  }
];

// Pre-generated datasets for different performance scenarios
export const smallDataset = generateLargeDataset(100);
export const mediumDataset = generateLargeDataset(1000);
export const largeDataset = generateLargeDataset(10000);
