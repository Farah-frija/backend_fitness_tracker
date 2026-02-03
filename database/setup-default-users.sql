-- Setup default users (ID 1 and 2) for team testing
-- Run this in pgAdmin on Fittracker database

-- First, make sure we can set specific IDs
-- Temporarily disable the ID sequence constraint

-- Insert User 1
INSERT INTO utilisateur 
  (id, nom, prenom, email, "motDePasse", role, "estVerifie", "twoFactorEnabled", type)
VALUES 
  (1, 'User', 'One', 'user1@fittracker.com', 
   '$2b$10$abcdefghijklmnopqrstuOEZwG7C8hVG7k8G7k8G7k8G7k8G7k8G7',
   'PROPRIETAIRE_ANIMAL', true, false, 'pet_owner')
ON CONFLICT (id) DO NOTHING;

-- Insert User 2
INSERT INTO utilisateur 
  (id, nom, prenom, email, "motDePasse", role, "estVerifie", "twoFactorEnabled", type)
VALUES 
  (2, 'User', 'Two', 'user2@fittracker.com', 
   '$2b$10$abcdefghijklmnopqrstuOEZwG7C8hVG7k8G7k8G7k8G7k8G7k8G7',
   'PROPRIETAIRE_ANIMAL', true, false, 'pet_owner')
ON CONFLICT (id) DO NOTHING;

-- Sample workouts for User 1
INSERT INTO workouts (user_id, goal_id, activity_type, workout_date, duration, calories, distance) VALUES
(1, NULL, 'Running', '2026-01-28 08:00:00', 45, 350, 5.2),
(1, NULL, 'Cycling', '2026-01-29 07:30:00', 60, 420, 15.0),
(1, NULL, 'Swimming', '2026-01-30 18:00:00', 30, 280, 1.5),
(1, NULL, 'Running', '2026-01-31 08:15:00', 50, 400, 6.0),
(1, NULL, 'Yoga', '2026-02-01 19:00:00', 40, 150, 0),
(1, NULL, 'Running', '2026-02-02 08:00:00', 55, 430, 6.5),
(1, NULL, 'Cycling', '2026-02-03 07:00:00', 70, 500, 18.0);

-- Sample workouts for User 2
INSERT INTO workouts (user_id, goal_id, activity_type, workout_date, duration, calories, distance) VALUES
(2, NULL, 'Running', '2026-01-27 09:00:00', 40, 320, 4.8),
(2, NULL, 'Weightlifting', '2026-01-28 17:00:00', 45, 250, 0),
(2, NULL, 'Running', '2026-01-29 09:00:00', 35, 290, 4.2),
(2, NULL, 'Swimming', '2026-01-30 19:00:00', 25, 240, 1.2),
(2, NULL, 'Cycling', '2026-01-31 08:00:00', 50, 380, 12.0),
(2, NULL, 'Yoga', '2026-02-01 18:30:00', 30, 120, 0),
(2, NULL, 'Running', '2026-02-02 09:00:00', 45, 350, 5.5),
(2, NULL, 'Weightlifting', '2026-02-03 17:30:00', 50, 280, 0);

SELECT 'Setup complete! Users 1 and 2 ready with workout data.' as status;
