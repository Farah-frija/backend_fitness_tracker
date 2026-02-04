-- SQL Server Migration Script for Workouts Table
-- Run this script in your SQL Server database to create the workouts table

-- Create workouts table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'workouts')
BEGIN
    CREATE TABLE workouts (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT NOT NULL,
        activity_type NVARCHAR(50) NOT NULL,
        workout_date DATETIME NOT NULL,
        duration INT DEFAULT 0, -- in minutes
        calories DECIMAL(10, 2) DEFAULT 0,
        distance DECIMAL(10, 2) DEFAULT 0, -- in km
        created_at DATETIME DEFAULT GETDATE(),
        
        -- Foreign key constraint (assuming you have a users table)
        -- CONSTRAINT FK_workouts_user FOREIGN KEY (user_id) REFERENCES users(id)
    );
    
    -- Create indexes for better query performance
    CREATE INDEX IDX_workouts_user_id ON workouts(user_id);
    CREATE INDEX IDX_workouts_workout_date ON workouts(workout_date);
    CREATE INDEX IDX_workouts_activity_type ON workouts(activity_type);
    CREATE INDEX IDX_workouts_user_date ON workouts(user_id, workout_date);
    
    PRINT 'Workouts table created successfully';
END
ELSE
BEGIN
    PRINT 'Workouts table already exists';
END

-- Sample data for testing (optional)
-- Uncomment the lines below to insert sample data

/*
-- Insert sample workouts for user_id = 1
INSERT INTO workouts (user_id, activity_type, workout_date, duration, calories, distance)
VALUES
    (1, 'Running', DATEADD(day, -1, GETDATE()), 30, 300, 5.0),
    (1, 'Cycling', DATEADD(day, -2, GETDATE()), 45, 400, 15.5),
    (1, 'Swimming', DATEADD(day, -3, GETDATE()), 25, 250, 1.0),
    (1, 'Running', DATEADD(day, -4, GETDATE()), 35, 350, 6.0),
    (1, 'Yoga', DATEADD(day, -5, GETDATE()), 60, 180, 0),
    (1, 'Weight Training', DATEADD(day, -6, GETDATE()), 50, 300, 0),
    (1, 'Running', DATEADD(day, -7, GETDATE()), 40, 400, 7.0),
    (1, 'Cycling', DATEADD(day, -10, GETDATE()), 60, 500, 20.0),
    (1, 'Running', DATEADD(day, -12, GETDATE()), 30, 300, 5.5),
    (1, 'Swimming', DATEADD(day, -15, GETDATE()), 30, 280, 1.2),
    (1, 'Yoga', DATEADD(day, -18, GETDATE()), 45, 150, 0),
    (1, 'Running', DATEADD(day, -20, GETDATE()), 35, 340, 6.2),
    (1, 'Cycling', DATEADD(day, -22, GETDATE()), 50, 450, 18.0),
    (1, 'Weight Training', DATEADD(day, -25, GETDATE()), 45, 280, 0),
    (1, 'Running', DATEADD(day, -28, GETDATE()), 32, 320, 5.8);

PRINT 'Sample data inserted successfully';
*/

-- Verify the table structure
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'workouts'
ORDER BY ORDINAL_POSITION;
