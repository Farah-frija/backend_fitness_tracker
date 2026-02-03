-- Create goals table for tracking user fitness goals
CREATE TABLE IF NOT EXISTS goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INTEGER NOT NULL,
    goal_name VARCHAR(100) NOT NULL,
    goal_type VARCHAR(50), -- e.g., 'weekly', 'monthly', 'custom'
    target_value DECIMAL(10, 2), -- e.g., target calories, distance, workouts
    target_unit VARCHAR(20), -- e.g., 'workouts', 'km', 'calories'
    is_active BOOLEAN DEFAULT true,
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_goals_user FOREIGN KEY (user_id) REFERENCES utilisateur(id) ON DELETE CASCADE
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_is_active ON goals(is_active);

-- Insert sample goals for User 1 and User 2
INSERT INTO goals (user_id, goal_name, goal_type, target_value, target_unit, is_active) VALUES
(1, 'Weekly Workout Goal', 'weekly', 5, 'workouts', true),
(1, 'Monthly Distance Goal', 'monthly', 50, 'km', true),
(2, 'Weekly Workout Goal', 'weekly', 7, 'workouts', true),
(2, 'Monthly Calories Goal', 'monthly', 10000, 'calories', true);

-- Display created goals
SELECT * FROM goals ORDER BY user_id, created_at;
