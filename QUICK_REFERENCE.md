# Dashboard API - Quick Reference

## 🚀 Quick Start

### 1. Database Setup
```bash
# Run the SQL migration script in SQL Server Management Studio
# File: database/migrations/create-workouts-table.sql
```

### 2. Start the Server
```bash
npm install
npm run start:dev
```

### 3. Test Endpoints
```bash
# Import Dashboard-API.postman_collection.json into Postman
# OR use the test script: node test-dashboard-api.js
```

---

## 📊 All 6 Endpoints

| # | Endpoint | Description | Auth |
|---|----------|-------------|------|
| 1 | `GET /api/dashboard/stats` | Overall statistics | ✅ |
| 2 | `GET /api/dashboard/weekly` | Last 7 days data | ✅ |
| 3 | `GET /api/dashboard/monthly` | Last 30 days (by week) | ✅ |
| 4 | `GET /api/dashboard/activity-breakdown` | Activity percentages | ✅ |
| 5 | `GET /api/dashboard/summary/weekly` | Weekly summary | ✅ |
| 6 | `GET /api/dashboard/summary/monthly` | Monthly summary | ✅ |

---

## 🔑 Authentication

**All endpoints require JWT token in header:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Get token:**
```bash
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

---

## 📝 Response Examples

### 1. Stats
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

### 2. Weekly/Monthly
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

### 3. Activity Breakdown
```json
[
  {
    "type": "Running",
    "count": 15,
    "percentage": 36,
    "color": "#4CAF50"
  }
]
```

### 4. Weekly Summary
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

### 5. Monthly Summary
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

---

## 🧪 Testing with cURL

```bash
# 1. Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Save the token, then:

# 2. Get Stats
curl http://localhost:3001/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN"

# 3. Get Weekly Data
curl http://localhost:3001/api/dashboard/weekly \
  -H "Authorization: Bearer YOUR_TOKEN"

# 4. Get Monthly Data
curl http://localhost:3001/api/dashboard/monthly \
  -H "Authorization: Bearer YOUR_TOKEN"

# 5. Get Activity Breakdown
curl http://localhost:3001/api/dashboard/activity-breakdown \
  -H "Authorization: Bearer YOUR_TOKEN"

# 6. Get Weekly Summary
curl http://localhost:3001/api/dashboard/summary/weekly \
  -H "Authorization: Bearer YOUR_TOKEN"

# 7. Get Monthly Summary
curl http://localhost:3001/api/dashboard/summary/monthly \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🗄️ Database Structure

```sql
workouts
├── id (PK)
├── user_id (FK)
├── activity_type
├── workout_date
├── duration (minutes)
├── calories
├── distance (km)
└── created_at
```

**Indexes:**
- user_id
- workout_date
- activity_type
- (user_id, workout_date) composite

---

## 🔧 Configuration

### CORS (main.ts)
```typescript
app.enableCors({
  origin: ['http://localhost:4200', '*'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
});
```

### Module Registration (app.module.ts)
```typescript
imports: [
  // ... other modules
  DashboardModule,
]
```

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Check JWT token is valid and in header |
| CORS Error | Verify frontend on port 4200, check CORS config |
| Empty Data | Insert sample data from migration script |
| SQL Error | Check database connection, verify table exists |

---

## 📂 File Structure

```
src/modules/dashboard/
├── dashboard.module.ts
├── dashboard.controller.ts
├── dashboard.service.ts
├── dto/
│   ├── dashboard-stats.dto.ts
│   ├── workout-data.dto.ts
│   ├── activity-breakdown.dto.ts
│   ├── weekly-summary.dto.ts
│   └── monthly-summary.dto.ts
└── entities/
    └── workout.entity.ts
```

---

## 🎯 Key SQL Queries

**Stats Query:**
```sql
SELECT COUNT(*), SUM(calories), SUM(distance), SUM(duration)
FROM workouts WHERE user_id = ? 
```

**Weekly Data:**
```sql
SELECT CONVERT(date, workout_date), COUNT(*), SUM(calories)
FROM workouts WHERE user_id = ? AND workout_date >= ?
GROUP BY CONVERT(date, workout_date)
```

**Activity Breakdown:**
```sql
SELECT activity_type, COUNT(*) 
FROM workouts WHERE user_id = ?
GROUP BY activity_type
```

---

## 📱 Angular Integration

```typescript
// dashboard.service.ts
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DashboardService {
  private api = 'http://localhost:3001/api/dashboard';
  
  getStats() {
    return this.http.get(`${this.api}/stats`);
  }
  
  getWeekly() {
    return this.http.get(`${this.api}/weekly`);
  }
  
  // ... other methods
}
```

---

## ✅ Checklist

- [ ] Database table created
- [ ] Sample data inserted
- [ ] Server running on port 3001
- [ ] JWT authentication working
- [ ] CORS enabled
- [ ] All 6 endpoints tested
- [ ] Angular frontend connected

---

**🎉 You're all set! Happy coding!**
