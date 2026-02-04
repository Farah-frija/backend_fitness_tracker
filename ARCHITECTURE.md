# 📐 Dashboard Module Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         ANGULAR FRONTEND                            │
│                      (http://localhost:4200)                        │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │  Dashboard   │  │   Charts     │  │  Statistics  │            │
│  │  Component   │  │  Component   │  │  Component   │            │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘            │
│         │                  │                  │                     │
│         └──────────────────┴──────────────────┘                     │
│                            │                                         │
│                   ┌────────▼─────────┐                              │
│                   │  Dashboard       │                              │
│                   │  Service         │                              │
│                   └────────┬─────────┘                              │
└────────────────────────────┼─────────────────────────────────────────┘
                             │
                             │ HTTP/REST
                             │ (JWT Token)
                             │
┌────────────────────────────▼─────────────────────────────────────────┐
│                      NESTJS BACKEND                                  │
│                   (http://localhost:3001)                            │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    main.ts (Entry Point)                     │  │
│  │  • CORS Configuration                                        │  │
│  │  • Port: 3001                                               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                             │                                        │
│  ┌──────────────────────────▼─────────────────────────────────┐   │
│  │                    app.module.ts                            │   │
│  │  • DashboardModule                                          │   │
│  │  • AuthModule (JWT)                                         │   │
│  │  • TypeORM Configuration                                    │   │
│  └──────────────────────────────────────────────────────────────┘  │
│                             │                                        │
│  ┌──────────────────────────▼─────────────────────────────────┐   │
│  │              DASHBOARD MODULE                               │   │
│  │                                                             │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │         DashboardController                         │   │   │
│  │  │  (API Routes: /api/dashboard/*)                     │   │   │
│  │  │                                                     │   │   │
│  │  │  ┌──────────────────────────────────────────────┐  │   │   │
│  │  │  │  @UseGuards(JwtAuthGuard)                    │  │   │   │
│  │  │  │                                              │  │   │   │
│  │  │  │  1. GET /stats                              │  │   │   │
│  │  │  │  2. GET /weekly                             │  │   │   │
│  │  │  │  3. GET /monthly                            │  │   │   │
│  │  │  │  4. GET /activity-breakdown                 │  │   │   │
│  │  │  │  5. GET /summary/weekly                     │  │   │   │
│  │  │  │  6. GET /summary/monthly                    │  │   │   │
│  │  │  └──────────────────────────────────────────────┘  │   │   │
│  │  └───────────────────┬─────────────────────────────────┘   │   │
│  │                      │                                       │   │
│  │  ┌───────────────────▼───────────────────────────────────┐ │   │
│  │  │           DashboardService                            │ │   │
│  │  │  (Business Logic & SQL Query Builder)                │ │   │
│  │  │                                                       │ │   │
│  │  │  • getStats(userId)                                  │ │   │
│  │  │  • getWeeklyData(userId)                             │ │   │
│  │  │  • getMonthlyData(userId)                            │ │   │
│  │  │  • getActivityBreakdown(userId)                      │ │   │
│  │  │  • getWeeklySummary(userId)                          │ │   │
│  │  │  • getMonthlySummary(userId)                         │ │   │
│  │  └───────────────────┬───────────────────────────────────┘ │   │
│  │                      │                                       │   │
│  │  ┌───────────────────▼───────────────────────────────────┐ │   │
│  │  │        TypeORM Repository<Workout>                    │ │   │
│  │  │  (Database Access Layer)                              │ │   │
│  │  │                                                       │ │   │
│  │  │  • createQueryBuilder()                               │ │   │
│  │  │  • count()                                            │ │   │
│  │  │  • getRawOne()                                        │ │   │
│  │  │  • getRawMany()                                       │ │   │
│  │  └───────────────────┬───────────────────────────────────┘ │   │
│  └────────────────────────┼───────────────────────────────────────┘│
└────────────────────────────┼──────────────────────────────────────┘
                             │
                             │ SQL Queries
                             │
┌────────────────────────────▼─────────────────────────────────────────┐
│                      SQL SERVER DATABASE                             │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                      workouts TABLE                          │  │
│  │                                                              │  │
│  │  Columns:                                                    │  │
│  │  • id (PK, INT, IDENTITY)                                   │  │
│  │  • user_id (INT, FK)                                        │  │
│  │  • activity_type (NVARCHAR(50))                             │  │
│  │  • workout_date (DATETIME)                                  │  │
│  │  • duration (INT) - minutes                                 │  │
│  │  • calories (DECIMAL(10,2))                                 │  │
│  │  • distance (DECIMAL(10,2)) - km                            │  │
│  │  • created_at (DATETIME)                                    │  │
│  │                                                              │  │
│  │  Indexes:                                                    │  │
│  │  • IDX_workouts_user_id                                     │  │
│  │  • IDX_workouts_workout_date                                │  │
│  │  • IDX_workouts_activity_type                               │  │
│  │  • IDX_workouts_user_date (Composite)                       │  │
│  └──────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Request Flow Diagram

```
1. User opens Dashboard in Angular
         │
         ▼
2. Angular sends GET request to /api/dashboard/stats
   Headers: { Authorization: Bearer <JWT_TOKEN> }
         │
         ▼
3. NestJS receives request at DashboardController
         │
         ▼
4. JwtAuthGuard validates token
   • Extracts user_id from token
   • Attaches to request.user
         │
         ▼
5. Controller calls DashboardService.getStats(userId)
         │
         ▼
6. Service builds SQL query using TypeORM QueryBuilder
   SELECT COUNT(*), SUM(calories), SUM(distance), SUM(duration)
   FROM workouts
   WHERE user_id = ?
         │
         ▼
7. TypeORM executes query against SQL Server
         │
         ▼
8. Database returns result set
         │
         ▼
9. Service processes data
   • Calculates percentages
   • Formats dates
   • Computes averages
         │
         ▼
10. Service returns DTO (DashboardStatsDto)
         │
         ▼
11. Controller sends JSON response
         │
         ▼
12. Angular receives data
         │
         ▼
13. Charts and widgets updated with new data
```

---

## Data Flow: Weekly Endpoint Example

```
┌──────────────────────────────────────────────────────────────────┐
│  Request: GET /api/dashboard/weekly                              │
│  Headers: Authorization: Bearer eyJ0eXAi...                      │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│  JwtAuthGuard                                                    │
│  • Validates token                                               │
│  • Extracts userId = 42                                          │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│  DashboardController.getWeeklyData(req)                          │
│  • userId = req.user.userId || req.user.id                       │
│  • Calls service.getWeeklyData(42)                               │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│  DashboardService.getWeeklyData(42)                              │
│  • Calculate: weekAgo = today - 7 days                           │
│  • Build query:                                                  │
│    SELECT CONVERT(date, workout_date) as date,                   │
│           COUNT(*) as workouts,                                  │
│           SUM(calories) as calories,                             │
│           SUM(duration) as duration,                             │
│           SUM(distance) as distance                              │
│    FROM workouts                                                 │
│    WHERE user_id = 42 AND workout_date >= weekAgo                │
│    GROUP BY CONVERT(date, workout_date)                          │
│    ORDER BY date ASC                                             │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│  SQL Server executes query                                       │
│  Returns:                                                        │
│  [                                                               │
│    { date: 2026-01-20, workouts: 1, calories: 250, ... },       │
│    { date: 2026-01-21, workouts: 2, calories: 540, ... },       │
│    { date: 2026-01-23, workouts: 1, calories: 300, ... }        │
│  ]                                                               │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│  Service processes results                                       │
│  • Formats dates to YYYY-MM-DD                                   │
│  • Converts strings to numbers                                   │
│  • Maps to WorkoutDataDto[]                                      │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│  Response: 200 OK                                                │
│  [                                                               │
│    {                                                             │
│      "date": "2026-01-20",                                       │
│      "workouts": 1,                                              │
│      "calories": 250,                                            │
│      "duration": 30,                                             │
│      "distance": 5.0                                             │
│    },                                                            │
│    ...                                                           │
│  ]                                                               │
└──────────────────────────────────────────────────────────────────┘
```

---

## Module Dependencies

```
DashboardModule
    │
    ├── Imports
    │   ├── TypeOrmModule.forFeature([Workout])
    │   └── (Implicit: AuthModule for JWT validation)
    │
    ├── Controllers
    │   └── DashboardController
    │       └── Uses: JwtAuthGuard (from AuthModule)
    │
    ├── Providers
    │   └── DashboardService
    │       └── Injects: Repository<Workout>
    │
    └── Exports
        └── DashboardService (for potential reuse)
```

---

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  1. User logs in via /api/auth/login                            │
│     POST { email, password }                                    │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. AuthService validates credentials                           │
│     • Checks user exists                                        │
│     • Verifies password                                         │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. AuthService generates JWT                                   │
│     payload = { userId: 42, email: "user@example.com" }         │
│     token = sign(payload, JWT_SECRET)                           │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. Return token to client                                      │
│     { "access_token": "eyJ0eXAiOiJKV1QiLC..." }                 │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  5. Client stores token (localStorage/sessionStorage)           │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  6. Client makes dashboard request                              │
│     GET /api/dashboard/stats                                    │
│     Authorization: Bearer eyJ0eXAiOiJKV1QiLC...                 │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  7. JwtAuthGuard validates token                                │
│     • Decodes token                                             │
│     • Verifies signature with JWT_SECRET                        │
│     • Checks expiration                                         │
│     • Extracts userId from payload                              │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  8. Request proceeds with user context                          │
│     req.user = { userId: 42, email: "user@example.com" }        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Error Handling Flow

```
Try {
    Controller receives request
         │
         ▼
    Extract userId from req.user
         │
         ▼
    Call service method
         │
         ▼
    Execute SQL query
         │
         ▼
    Process results
         │
         ▼
    Return DTO
}
Catch (error) {
    │
    ├── Database connection error
    │   └── Return 500: "Failed to connect to database"
    │
    ├── SQL query error
    │   └── Return 500: "Failed to fetch data"
    │
    ├── Data processing error
    │   └── Return 500: "Failed to process results"
    │
    └── Unknown error
        └── Return 500: "Internal server error"
}
```

---

## File Structure Visualization

```
src/modules/dashboard/
│
├── dashboard.module.ts ────────────────► Module definition
│   └── Imports: TypeOrmModule
│   └── Controllers: DashboardController
│   └── Providers: DashboardService
│
├── dashboard.controller.ts ────────────► HTTP endpoints
│   └── Uses: JwtAuthGuard
│   └── Injects: DashboardService
│   └── 6 GET endpoints
│
├── dashboard.service.ts ───────────────► Business logic
│   └── Injects: Repository<Workout>
│   └── 6 query methods
│   └── Helper methods
│
├── dto/ ───────────────────────────────► Response types
│   ├── dashboard-stats.dto.ts
│   ├── workout-data.dto.ts
│   ├── activity-breakdown.dto.ts
│   ├── weekly-summary.dto.ts
│   ├── monthly-summary.dto.ts
│   └── index.ts
│
└── entities/ ──────────────────────────► Database models
    └── workout.entity.ts
        └── Maps to 'workouts' table
```

This architecture ensures:
- ✅ Separation of concerns
- ✅ Dependency injection
- ✅ Type safety
- ✅ Security (JWT)
- ✅ Performance (indexes)
- ✅ Maintainability
