-- STEP 1: First, check if workouts table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'workouts';

-- STEP 2: If it doesn't exist, create it
CREATE TABLE IF NOT EXISTS workouts (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    activity_type VARCHAR(50) NOT NULL,
    workout_date TIMESTAMP NOT NULL,
    duration INT DEFAULT 0,
    calories DECIMAL(10,2) DEFAULT 0,
    distance DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_workouts_user 
        FOREIGN KEY (user_id) 
        REFERENCES utilisateur(id) 
        ON DELETE CASCADE
);

-- STEP 3: Get your user ID (copy this value!)
SELECT id, email, nom, prenom 
FROM utilisateur 
WHERE email LIKE '%test%' OR email LIKE '%fit%';

-- STEP 4: Insert sample workouts (REPLACE 'YOUR_USER_ID_HERE' with the actual UUID from STEP 3)
-- Example: INSERT INTO workouts (user_id, activity_type, workout_date, duration, calories, distance) VALUES
-- ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Running', '2026-01-20', 45, 350, 5.2);

INSERT INTO workouts (user_id, activity_type, workout_date, duration, calories, distance) VALUES
('YOUR_USER_ID_HERE', 'Running', '2026-01-20 08:00:00', 45, 350, 5.2),
('YOUR_USER_ID_HERE', 'Cycling', '2026-01-21 07:30:00', 60, 420, 15.0),
('YOUR_USER_ID_HERE', 'Swimming', '2026-01-22 18:00:00', 30, 280, 1.5),
('YOUR_USER_ID_HERE', 'Running', '2026-01-23 08:15:00', 50, 400, 6.0),
('YOUR_USER_ID_HERE', 'Yoga', '2026-01-24 19:00:00', 40, 150, 0),
('YOUR_USER_ID_HERE', 'Running', '2026-01-25 08:00:00', 55, 430, 6.5),
('YOUR_USER_ID_HERE', 'Cycling', '2026-01-26 07:00:00', 70, 500, 18.0),
('YOUR_USER_ID_HERE', 'Swimming', '2026-01-27 18:30:00', 35, 300, 1.8),
('YOUR_USER_ID_HERE', 'Running', '2026-01-28 08:30:00', 48, 380, 5.8);
