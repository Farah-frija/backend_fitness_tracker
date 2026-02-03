-- Delete all old workout data
DELETE FROM workouts;

-- Re-insert fresh data for User 1 (7 workouts)
INSERT INTO workouts (user_id, activity_type, workout_date, duration, calories, distance) VALUES
(1, 'Running', '2026-02-03', 45, 420, 6.5),
(1, 'Cycling', '2026-02-02', 60, 380, 15.2),
(1, 'Swimming', '2026-02-01', 30, 280, 1.5),
(1, 'Running', '2026-01-31', 50, 460, 7.2),
(1, 'Yoga', '2026-01-30', 40, 150, 0),
(1, 'Cycling', '2026-01-29', 55, 360, 14.8),
(1, 'Running', '2026-01-28', 40, 380, 6.0);

-- Re-insert fresh data for User 2 (8 workouts)
INSERT INTO workouts (user_id, activity_type, workout_date, duration, calories, distance) VALUES
(2, 'Running', '2026-02-03', 50, 450, 7.0),
(2, 'Weightlifting', '2026-02-02', 45, 320, 0),
(2, 'Cycling', '2026-02-01', 70, 420, 18.5),
(2, 'Running', '2026-01-31', 45, 430, 6.8),
(2, 'Swimming', '2026-01-30', 35, 300, 1.8),
(2, 'Weightlifting', '2026-01-29', 50, 350, 0),
(2, 'Running', '2026-01-28', 55, 480, 7.5),
(2, 'Cycling', '2026-01-27', 65, 400, 17.2);

-- Verify the clean data
SELECT user_id, COUNT(*) as workout_count, SUM(calories) as total_calories, SUM(distance) as total_distance
FROM workouts
GROUP BY user_id
ORDER BY user_id;

-- IMPORTANT: Commit the transaction to save changes!
COMMIT;
