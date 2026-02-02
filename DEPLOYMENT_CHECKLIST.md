# 📋 Dashboard Module - Deployment Checklist

## Pre-Deployment Checklist

### ✅ Database Setup
- [ ] SQL Server is running and accessible
- [ ] Database connection string configured in `src/config/configuration.ts`
- [ ] Run migration script: `database/migrations/create-workouts-table.sql`
- [ ] Verify table created: `SELECT * FROM workouts`
- [ ] (Optional) Insert sample data for testing
- [ ] Verify indexes created with: `EXEC sp_helpindex 'workouts'`

### ✅ Code Verification
- [ ] All files created in `src/modules/dashboard/`
- [ ] DashboardModule imported in `app.module.ts`
- [ ] CORS configured in `main.ts` for Angular frontend
- [ ] JWT authentication is working (test with existing auth endpoints)
- [ ] TypeScript compiles without errors: `npm run build`

### ✅ Dependencies
- [ ] `npm install` completed successfully
- [ ] `@nestjs/common` installed
- [ ] `@nestjs/typeorm` installed
- [ ] `typeorm` installed
- [ ] `mssql` driver installed (for SQL Server)

### ✅ Environment Configuration
- [ ] Database host configured
- [ ] Database port configured (default: 1433)
- [ ] Database username/password set
- [ ] Database name specified
- [ ] JWT secret configured

---

## Testing Checklist

### ✅ Authentication
- [ ] Can successfully login via `POST /api/auth/login`
- [ ] Receive JWT token in response
- [ ] Token includes user_id or id field

### ✅ Endpoint Testing
Test each endpoint with valid JWT token:

- [ ] **1. GET /api/dashboard/stats**
  - Returns 200 status code
  - Response has all 6 fields (totalWorkouts, totalCalories, etc.)
  - Numbers are correct based on database data

- [ ] **2. GET /api/dashboard/weekly**
  - Returns 200 status code
  - Returns array of daily data (last 7 days)
  - Each item has: date, workouts, calories, duration, distance
  - Dates are in YYYY-MM-DD format

- [ ] **3. GET /api/dashboard/monthly**
  - Returns 200 status code
  - Returns array of weekly data (last 30 days)
  - Data grouped by week start date

- [ ] **4. GET /api/dashboard/activity-breakdown**
  - Returns 200 status code
  - Returns array of activities
  - Each activity has: type, count, percentage, color
  - Percentages add up to 100% (or close)

- [ ] **5. GET /api/dashboard/summary/weekly**
  - Returns 200 status code
  - Has totalWorkouts, totalCalories, totalDistance, totalDuration
  - Has mostActiveDay object with date and workouts
  - Has averageCaloriesPerDay

- [ ] **6. GET /api/dashboard/summary/monthly**
  - Returns 200 status code
  - Has totalWorkouts, totalCalories, totalDistance, totalDuration
  - Has topActivity object with type and count
  - Has averageWorkoutsPerWeek and averageCaloriesPerDay

### ✅ Error Handling
- [ ] Returns 401 when JWT token missing
- [ ] Returns 401 when JWT token invalid
- [ ] Returns 500 with error message when database error occurs
- [ ] Gracefully handles empty data (no workouts in database)

### ✅ Security
- [ ] All endpoints require authentication (401 without token)
- [ ] User only sees their own data (not other users' data)
- [ ] SQL injection prevention (using TypeORM query builder)
- [ ] CORS only allows specified origins

---

## Performance Checklist

### ✅ Database Optimization
- [ ] Indexes exist on: user_id, workout_date, activity_type
- [ ] Composite index on (user_id, workout_date)
- [ ] Queries use WHERE clauses efficiently
- [ ] No N+1 query problems

### ✅ Response Times
Test with sample data:
- [ ] Stats endpoint responds in < 500ms
- [ ] Weekly endpoint responds in < 500ms
- [ ] Monthly endpoint responds in < 500ms
- [ ] Activity breakdown responds in < 500ms
- [ ] Summaries respond in < 500ms

### ✅ Data Accuracy
- [ ] Total counts match database SELECT COUNT(*)
- [ ] Sums match manual calculations
- [ ] Percentages calculated correctly
- [ ] Dates formatted correctly (YYYY-MM-DD)
- [ ] Weekly goal progress capped at 100%
- [ ] Monthly goal progress capped at 100%

---

## Integration Checklist

### ✅ Angular Frontend
- [ ] Frontend can call all 6 endpoints
- [ ] JWT token passed in Authorization header
- [ ] CORS errors resolved
- [ ] Charts display data correctly
- [ ] Loading states implemented
- [ ] Error handling implemented

### ✅ API Documentation
- [ ] Swagger/OpenAPI docs accessible at `/api-docs`
- [ ] All endpoints documented
- [ ] Request/response examples included
- [ ] Authentication requirements documented

---

## Production Readiness

### ✅ Environment Variables
- [ ] Database credentials in .env file (not hardcoded)
- [ ] JWT secret in .env file
- [ ] Port number configurable
- [ ] CORS origins configurable

### ✅ Error Logging
- [ ] Errors logged to console/file
- [ ] Database connection errors handled
- [ ] Query errors logged with details
- [ ] User-friendly error messages returned to client

### ✅ Security
- [ ] SQL injection protection verified
- [ ] CORS configured for production domains
- [ ] Rate limiting considered (optional)
- [ ] Input validation on all endpoints
- [ ] Sensitive data not exposed in error messages

### ✅ Monitoring
- [ ] Consider adding logging middleware
- [ ] Consider adding performance monitoring
- [ ] Consider adding health check endpoint
- [ ] Consider adding metrics (response times, error rates)

---

## Deployment Steps

### Step 1: Prepare
```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run tests (if available)
npm test
```

### Step 2: Database
```bash
# Connect to production SQL Server
# Run migration script
# Verify table created
# Check indexes
```

### Step 3: Configure
```bash
# Set environment variables
export DB_HOST=production-server
export DB_PORT=1433
export DB_NAME=fitness_tracker
export DB_USER=app_user
export DB_PASSWORD=secure_password
export JWT_SECRET=your_secret_key
```

### Step 4: Deploy
```bash
# Start application
npm run start:prod

# Verify running on correct port
# Test health check
```

### Step 5: Verify
```bash
# Test each endpoint
# Check logs for errors
# Monitor performance
# Verify data accuracy
```

---

## Post-Deployment Checklist

### ✅ Smoke Tests
- [ ] Application starts without errors
- [ ] Database connection successful
- [ ] All 6 endpoints respond
- [ ] Authentication works
- [ ] CORS configured correctly

### ✅ Monitoring
- [ ] Application logs being written
- [ ] Error rates normal
- [ ] Response times acceptable
- [ ] Database queries performing well

### ✅ Documentation
- [ ] API docs accessible
- [ ] Team trained on new endpoints
- [ ] Runbook created for common issues
- [ ] Monitoring dashboards set up

---

## Rollback Plan

If issues occur:

1. **Check logs** - Review error logs for specific issues
2. **Database** - Verify connection and data integrity
3. **Rollback code** - Revert to previous version if needed
4. **Drop table** - `DROP TABLE workouts` (if needed to start over)
5. **Re-run migration** - Execute SQL script again

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Cannot find module @nestjs/common" | Run `npm install` |
| "Connection refused" | Check database is running and accessible |
| "Invalid credentials" | Verify DB username/password in config |
| "Table 'workouts' doesn't exist" | Run migration script |
| 401 Unauthorized | Check JWT token is valid and in header |
| CORS error | Add frontend origin to CORS config |
| Empty data | Insert test data or check user_id |

---

## Success Criteria

✅ All 6 endpoints operational
✅ Authentication working
✅ Data accurate
✅ Performance acceptable
✅ Frontend integrated
✅ Documentation complete
✅ Team trained

---

**🎉 Ready to Deploy!**

Print this checklist and check off items as you complete them.
