# Dashboard & Analytics Module - Setup Guide

## Overview
This module provides 6 API endpoints for aggregating workout data and displaying analytics on a fitness tracker dashboard.

## Module Structure
```
src/modules/dashboard/
├── dashboard.module.ts          # Module registration
├── dashboard.controller.ts      # API endpoints
├── dashboard.service.ts         # Business logic & SQL queries
├── dto/
│   ├── dashboard-stats.dto.ts
│   ├── workout-data.dto.ts
│   ├── activity-breakdown.dto.ts
│   ├── weekly-summary.dto.ts
│   ├── monthly-summary.dto.ts
│   └── index.ts
└── entities/
    └── workout.entity.ts        # Workout database entity
```

## Database Setup

### 1. Create Workouts Table
Run the SQL migration script located at `database/migrations/create-workouts-table.sql` in your SQL Server database:

```sql
-- Creates workouts table with proper indexes
-- See file for complete script
```

### 2. Table Schema
```sql
CREATE TABLE workouts (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    activity_type NVARCHAR(50) NOT NULL,
    workout_date DATETIME NOT NULL,
    duration INT DEFAULT 0,           -- minutes
    calories DECIMAL(10, 2) DEFAULT 0,
    distance DECIMAL(10, 2) DEFAULT 0, -- km
    created_at DATETIME DEFAULT GETDATE()
);
```

### 3. Insert Sample Data (Optional)
Uncomment the INSERT statements in the migration script to add test data.

## API Endpoints

All endpoints require JWT authentication. Include the Bearer token in the Authorization header.

### 1. GET /api/dashboard/stats
Get overall dashboard statistics.

**Response:**
```json
{
  "totalWorkouts": 42,
  "totalCalories": 15420,
  "totalDistance": 156.8,
  "totalDuration": 2140,
  "weeklyGoalProgress": 75,
  "monthlyGoalProgress": 68
}
```

### 2. GET /api/dashboard/weekly
Get daily workout data for the last 7 days.

**Response:**
```json
[
  {
    "date": "2026-01-21",
    "workouts": 2,
    "calories": 540,
    "duration": 65,
    "distance": 8.5
  }
]
```

### 3. GET /api/dashboard/monthly
Get weekly workout data for the last 30 days (aggregated by week).

**Response:**
```json
[
  {
    "date": "2026-01-13",
    "workouts": 8,
    "calories": 2340,
    "duration": 245,
    "distance": 35.5
  }
]
```

### 4. GET /api/dashboard/activity-breakdown
Get activity type distribution with percentages and colors.

**Response:**
```json
[
  {
    "type": "Running",
    "count": 15,
    "percentage": 36,
    "color": "#4CAF50"
  },
  {
    "type": "Cycling",
    "count": 10,
    "percentage": 24,
    "color": "#2196F3"
  }
]
```

### 5. GET /api/dashboard/summary/weekly
Get weekly summary with most active day.

**Response:**
```json
{
  "totalWorkouts": 12,
  "totalCalories": 3540,
  "totalDistance": 45.8,
  "totalDuration": 385,
  "mostActiveDay": {
    "date": "2026-01-23",
    "workouts": 3
  },
  "averageCaloriesPerDay": 506
}
```

### 6. GET /api/dashboard/summary/monthly
Get monthly summary with top activity.

**Response:**
```json
{
  "totalWorkouts": 42,
  "totalCalories": 15420,
  "totalDistance": 156.8,
  "totalDuration": 2140,
  "topActivity": {
    "type": "Running",
    "count": 15
  },
  "averageWorkoutsPerWeek": 10,
  "averageCaloriesPerDay": 514
}
```

## Testing the Endpoints

### Using cURL:

1. **Login to get JWT token:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

2. **Get dashboard stats:**
```bash
curl http://localhost:3001/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman:

1. Create a new collection "Dashboard API"
2. Set up an environment variable for `authToken`
3. Add Authorization header: `Bearer {{authToken}}`
4. Test each endpoint

## CORS Configuration

The backend is configured to accept requests from your Angular frontend:

```typescript
// main.ts
app.enableCors({
  origin: ['http://localhost:4200', '*'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
  allowedHeaders: 'Content-Type, Accept, Authorization',
});
```

## Error Handling

All endpoints include try-catch blocks with proper HTTP status codes:

- **200 OK**: Successful request
- **401 Unauthorized**: Missing or invalid JWT token
- **500 Internal Server Error**: Database or server error

Error response format:
```json
{
  "status": 500,
  "error": "Failed to fetch dashboard statistics",
  "message": "Detailed error message"
}
```

## Key Features

### SQL Aggregations Used:
- `COUNT(*)` - Count total workouts
- `SUM()` - Total calories, distance, duration
- `AVG()` - Average values
- `GROUP BY` - Group by date and activity type
- `DATEPART()` - Week calculations
- `CONVERT(date, ...)` - Date formatting

### Performance Optimizations:
- Indexed columns: `user_id`, `workout_date`, `activity_type`
- Composite index on `(user_id, workout_date)`
- Efficient SQL queries with proper WHERE clauses

### Security:
- JWT authentication on all endpoints
- User isolation (queries filtered by user_id)
- SQL injection prevention via TypeORM query builder

## Running the Application

1. **Install dependencies:**
```bash
npm install
```

2. **Configure database connection:**
Update your `src/config/configuration.ts` with SQL Server credentials.

3. **Run migrations:**
Execute the SQL script in your database.

4. **Start the server:**
```bash
npm run start:dev
```

5. **Access API:**
- Backend: http://localhost:3001
- Swagger Docs: http://localhost:3001/api-docs

## Integration with Angular

Your Angular app should make HTTP requests like:

```typescript
// dashboard.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';

export class DashboardService {
  private apiUrl = 'http://localhost:3001/api/dashboard';
  
  getStats() {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.get(`${this.apiUrl}/stats`, { headers });
  }
}
```

## Troubleshooting

### Common Issues:

1. **CORS errors:**
   - Verify CORS is enabled in `main.ts`
   - Check Angular app is running on port 4200

2. **401 Unauthorized:**
   - Verify JWT token is valid and not expired
   - Check Authorization header format: `Bearer <token>`

3. **Empty data:**
   - Insert sample data using the migration script
   - Verify user_id matches your authenticated user

4. **SQL errors:**
   - Check database connection in configuration
   - Verify workouts table exists
   - Check SQL Server is running

## Next Steps

- Add more endpoints (goals, achievements, etc.)
- Implement caching for better performance
- Add unit and integration tests
- Set up real-time updates with WebSockets
- Add data validation and sanitization

## Support

For issues or questions:
1. Check the error logs in the console
2. Review SQL Server query logs
3. Test endpoints with Postman
4. Verify database schema matches entity definitions
