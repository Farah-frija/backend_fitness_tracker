-- Add goal_id to workouts table to link workouts to goals
ALTER TABLE workouts 
ADD COLUMN goal_id UUID NULL,
ADD CONSTRAINT fk_workouts_goals
    FOREIGN KEY (goal_id)
    REFERENCES goals(id)
    ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_workouts_goal_id ON workouts(goal_id);

-- Update existing workouts to have NULL goal_id (or link them to a default goal if needed)
-- This is safe because the column is nullable
