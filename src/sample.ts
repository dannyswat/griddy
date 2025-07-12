import type { ColumnState } from './features/Grid/columnState';
import type { DataRow } from './models/DataRow';

// Sample data for demonstration - 50 rows
export const sampleData: DataRow[] = [
  { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', age: 30, salary: 75000, isActive: true, hireDate: new Date('2022-01-15'), notes: 'Excellent performer with strong leadership skills' },
  { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', age: 28, salary: 68000, isActive: true, hireDate: new Date('2022-03-20'), notes: 'Great team player, very reliable' },
  { id: 3, firstName: 'Bob', lastName: 'Johnson', email: 'bob.johnson@example.com', age: 35, salary: 82000, isActive: false, hireDate: new Date('2021-11-10'), notes: 'On leave for personal reasons' },
  { id: 4, firstName: 'Alice', lastName: 'Williams', email: 'alice.williams@example.com', age: 32, salary: 71000, isActive: true, hireDate: new Date('2023-02-14'), notes: 'New hire, showing great potential in technical areas' },
  { id: 5, firstName: 'Charlie', lastName: 'Brown', email: 'charlie.brown@example.com', age: 29, salary: 65000, isActive: true, hireDate: new Date('2023-05-10'), notes: 'Creative problem solver' },
  { id: 6, firstName: 'Diana', lastName: 'Prince', email: 'diana.prince@example.com', age: 31, salary: 78000, isActive: true, hireDate: new Date('2021-08-22'), notes: 'Exceptional' },
  { id: 7, firstName: 'Edward', lastName: 'Norton', email: 'edward.norton@example.com', age: 33, salary: 85000, isActive: false, hireDate: new Date('2020-12-01'), notes: 'Senior developer with extensive experience in multiple programming languages and frameworks' },
  { id: 8, firstName: 'Fiona', lastName: 'Green', email: 'fiona.green@example.com', age: 27, salary: 62000, isActive: true, hireDate: new Date('2023-09-15'), notes: 'Fast learner' },
  { id: 9, firstName: 'George', lastName: 'Miller', email: 'george.miller@example.com', age: 36, salary: 90000, isActive: true, hireDate: new Date('2019-04-18'), notes: 'Team lead with proven track record of delivering complex projects on time and within budget' },
  { id: 10, firstName: 'Helen', lastName: 'Davis', email: 'helen.davis@example.com', age: 34, salary: 73000, isActive: true, hireDate: new Date('2022-07-30'), notes: 'Detail-oriented analyst' },
  { id: 11, firstName: 'Ivan', lastName: 'Rodriguez', email: 'ivan.rodriguez@example.com', age: 26, salary: 58000, isActive: true, hireDate: new Date('2024-01-12'), notes: 'Junior developer' },
  { id: 12, firstName: 'Julia', lastName: 'Wilson', email: 'julia.wilson@example.com', age: 38, salary: 95000, isActive: false, hireDate: new Date('2018-11-05'), notes: 'Senior architect working remotely from different timezone' },
  { id: 13, firstName: 'Kevin', lastName: 'Lee', email: 'kevin.lee@example.com', age: 25, salary: 55000, isActive: true, hireDate: new Date('2024-03-08'), notes: 'Intern' },
  { id: 14, firstName: 'Laura', lastName: 'Martinez', email: 'laura.martinez@example.com', age: 30, salary: 70000, isActive: true, hireDate: new Date('2022-05-25'), notes: 'Marketing specialist with digital expertise' },
  { id: 15, firstName: 'Michael', lastName: 'Anderson', email: 'michael.anderson@example.com', age: 37, salary: 88000, isActive: true, hireDate: new Date('2020-09-14'), notes: 'Product manager' },
  { id: 16, firstName: 'Nina', lastName: 'Taylor', email: 'nina.taylor@example.com', age: 29, salary: 66000, isActive: false, hireDate: new Date('2023-01-20'), notes: 'Currently on maternity leave, expected return in Q3' },
  { id: 17, firstName: 'Oliver', lastName: 'Thomas', email: 'oliver.thomas@example.com', age: 32, salary: 76000, isActive: true, hireDate: new Date('2021-06-12'), notes: 'DevOps engineer' },
  { id: 18, firstName: 'Paula', lastName: 'Jackson', email: 'paula.jackson@example.com', age: 28, salary: 64000, isActive: true, hireDate: new Date('2023-04-03'), notes: 'UX designer' },
  { id: 19, firstName: 'Quinn', lastName: 'White', email: 'quinn.white@example.com', age: 35, salary: 81000, isActive: true, hireDate: new Date('2020-10-28'), notes: 'Backend specialist' },
  { id: 20, firstName: 'Rachel', lastName: 'Harris', email: 'rachel.harris@example.com', age: 33, salary: 79000, isActive: false, hireDate: new Date('2021-12-16'), notes: 'On sabbatical' },
  { id: 21, firstName: 'Steve', lastName: 'Clark', email: 'steve.clark@example.com', age: 31, salary: 72000, isActive: true, hireDate: new Date('2022-08-07'), notes: 'Regular team member' },
  { id: 22, firstName: 'Tina', lastName: 'Lewis', email: 'tina.lewis@example.com', age: 27, salary: 61000, isActive: true, hireDate: new Date('2023-11-18'), notes: 'Regular team member' },
  { id: 23, firstName: 'Ulrich', lastName: 'Walker', email: 'ulrich.walker@example.com', age: 39, salary: 97000, isActive: true, hireDate: new Date('2019-02-23'), notes: 'Regular team member' },
  { id: 24, firstName: 'Vera', lastName: 'Hall', email: 'vera.hall@example.com', age: 26, salary: 59000, isActive: true, hireDate: new Date('2024-05-14'), notes: 'Regular team member' },
  { id: 25, firstName: 'Walter', lastName: 'Allen', email: 'walter.allen@example.com', age: 34, salary: 84000, isActive: false, hireDate: new Date('2020-03-09'), notes: 'Regular team member' },
  { id: 26, firstName: 'Xara', lastName: 'Young', email: 'xara.young@example.com', age: 24, salary: 52000, isActive: true, hireDate: new Date('2024-07-21'), notes: 'Junior developer' },
  { id: 27, firstName: 'Yuki', lastName: 'King', email: 'yuki.king@example.com', age: 30, salary: 69000, isActive: true, hireDate: new Date('2022-10-11'), notes: 'QA engineer' },
  { id: 28, firstName: 'Zack', lastName: 'Wright', email: 'zack.wright@example.com', age: 28, salary: 63000, isActive: true, hireDate: new Date('2023-06-29'), notes: 'Frontend developer' },
  { id: 29, firstName: 'Amy', lastName: 'Lopez', email: 'amy.lopez@example.com', age: 32, salary: 77000, isActive: true, hireDate: new Date('2021-04-16'), notes: 'Business analyst' },
  { id: 30, firstName: 'Brian', lastName: 'Hill', email: 'brian.hill@example.com', age: 36, salary: 86000, isActive: false, hireDate: new Date('2019-08-30'), notes: 'Consultant' },
  { id: 31, firstName: 'Cathy', lastName: 'Scott', email: 'cathy.scott@example.com', age: 25, salary: 56000, isActive: true, hireDate: new Date('2024-02-05'), notes: 'New hire' },
  { id: 32, firstName: 'David', lastName: 'Adams', email: 'david.adams@example.com', age: 33, salary: 80000, isActive: true, hireDate: new Date('2021-01-28'), notes: 'System administrator' },
  { id: 33, firstName: 'Emma', lastName: 'Baker', email: 'emma.baker@example.com', age: 29, salary: 67000, isActive: true, hireDate: new Date('2022-12-13'), notes: 'Data scientist' },
  { id: 34, firstName: 'Frank', lastName: 'Gonzalez', email: 'frank.gonzalez@example.com', age: 37, salary: 91000, isActive: true, hireDate: new Date('2019-07-19'), notes: 'Technical lead' },
  { id: 35, firstName: 'Grace', lastName: 'Nelson', email: 'grace.nelson@example.com', age: 31, salary: 74000, isActive: false, hireDate: new Date('2022-04-07'), notes: 'Contract worker' },
  { id: 36, firstName: 'Henry', lastName: 'Carter', email: 'henry.carter@example.com', age: 28, salary: 65000, isActive: true, hireDate: new Date('2023-08-22'), notes: 'Full stack developer' },
  { id: 37, firstName: 'Iris', lastName: 'Mitchell', email: 'iris.mitchell@example.com', age: 26, salary: 60000, isActive: true, hireDate: new Date('2024-01-30'), notes: 'Mobile developer' },
  { id: 38, firstName: 'Jack', lastName: 'Perez', email: 'jack.perez@example.com', age: 35, salary: 83000, isActive: true, hireDate: new Date('2020-05-15'), notes: 'Cloud architect' },
  { id: 39, firstName: 'Kelly', lastName: 'Roberts', email: 'kelly.roberts@example.com', age: 32, salary: 78000, isActive: true, hireDate: new Date('2021-09-03'), notes: 'Security specialist' },
  { id: 40, firstName: 'Liam', lastName: 'Turner', email: 'liam.turner@example.com', age: 27, salary: 62000, isActive: false, hireDate: new Date('2023-10-17'), notes: 'Part-time' },
  { id: 41, firstName: 'Megan', lastName: 'Phillips', email: 'megan.phillips@example.com', age: 34, salary: 82000, isActive: true, hireDate: new Date('2020-08-26'), notes: 'Database administrator' },
  { id: 42, firstName: 'Nathan', lastName: 'Campbell', email: 'nathan.campbell@example.com', age: 29, salary: 68000, isActive: true, hireDate: new Date('2022-11-09'), notes: 'Network engineer' },
  { id: 43, firstName: 'Olivia', lastName: 'Parker', email: 'olivia.parker@example.com', age: 30, salary: 71000, isActive: true, hireDate: new Date('2022-02-18'), notes: 'Content manager' },
  { id: 44, firstName: 'Peter', lastName: 'Evans', email: 'peter.evans@example.com', age: 38, salary: 94000, isActive: true, hireDate: new Date('2018-12-04'), notes: 'Solution architect with expertise in enterprise systems' },
  { id: 45, firstName: 'Quincy', lastName: 'Edwards', email: 'quincy.edwards@example.com', age: 26, salary: 57000, isActive: true, hireDate: new Date('2024-04-11'), notes: 'Trainee' },
  { id: 46, firstName: 'Rita', lastName: 'Collins', email: 'rita.collins@example.com', age: 33, salary: 79000, isActive: false, hireDate: new Date('2021-07-24'), notes: 'Remote worker' },
  { id: 47, firstName: 'Sam', lastName: 'Stewart', email: 'sam.stewart@example.com', age: 31, salary: 75000, isActive: true, hireDate: new Date('2022-06-01'), notes: 'Scrum master' },
  { id: 48, firstName: 'Tara', lastName: 'Sanchez', email: 'tara.sanchez@example.com', age: 28, salary: 64000, isActive: true, hireDate: new Date('2023-03-27'), notes: 'UI designer' },
  { id: 49, firstName: 'Victor', lastName: 'Morris', email: 'victor.morris@example.com', age: 36, salary: 87000, isActive: true, hireDate: new Date('2019-09-12'), notes: 'Operations manager' },
  { id: 50, firstName: 'Wendy', lastName: 'Rogers', email: 'wendy.rogers@example.com', age: 25, salary: 54000, isActive: true, hireDate: new Date('2024-06-08'), notes: 'Junior analyst' }
];

// Column definitions with groups
export const sampleColumns: ColumnState[] = [
  {
    field: 'id',
    colId: 'id',
    headerName: 'ID',
    headerClassName: '',
    cellClassName: 'id-column',
    dataType: 'number',
    dataFormat: '',
    width: 80,
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
        width: 120,
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
        width: 120,
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
        width: 200,
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
        width: 80,
        sorted: undefined,
        filtered: false
      }
    ]
  },
  {
    groupId: 'employment',
    headerName: 'Employment',
    headerClassName: 'group-employment',
    children: [
      {
        field: 'salary',
        colId: 'salary',
        headerName: 'Salary',
        headerClassName: '',
        cellClassName: '',
        dataType: 'number',
        dataFormat: 'currency',
        width: 120,
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
        width: 80,
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
        width: 120,
        sorted: undefined,
        filtered: false
      }
    ]
  },
  {
    field: 'notes',
    colId: 'notes',
    headerName: 'Notes & Comments',
    headerClassName: '',
    cellClassName: '',
    dataType: 'string',
    dataFormat: '',
    width: 200,
    sorted: undefined,
    filtered: false
  }
];
