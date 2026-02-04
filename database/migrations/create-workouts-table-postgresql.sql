/* =========================================================
   FITTRACKER – FULL DATABASE SCHEMA (POSTGRESQL)
   ========================================================= */

------------------------------------------------------------
-- 1️⃣ EXTENSIONS
------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

------------------------------------------------------------
-- 2️⃣ USERS
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    timezone VARCHAR(50) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

------------------------------------------------------------
-- 3️⃣ BODY METRICS
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS body_metrics (
    id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    height_cm FLOAT NULL,
    weight_kg FLOAT NOT NULL,
    bmi FLOAT NULL,
    recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_body_metrics_users
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

------------------------------------------------------------
-- 4️⃣ GOALS
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS goals (
    id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,

    title VARCHAR(150) NOT NULL,
    description TEXT NULL,
    goal_type VARCHAR(50) NOT NULL,
    metric_type VARCHAR(50) NOT NULL,
    unit VARCHAR(20) NULL,
    target_value FLOAT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    start_date DATE NULL,
    end_date DATE NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_goals_users
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

------------------------------------------------------------
-- 5️⃣ GOAL SCHEDULES
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS goal_schedules (
    id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    goal_id UUID NOT NULL,

    frequency_type VARCHAR(20) NOT NULL,
    times_per_period INT NOT NULL,
    period VARCHAR(20) NOT NULL,
    days_of_week VARCHAR(20) NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_goal_schedules_goals
        FOREIGN KEY (goal_id)
        REFERENCES goals(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_goal_schedules_goal
        UNIQUE (goal_id)
);

------------------------------------------------------------
-- 6️⃣ DAILY GOAL INSTANCES
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS daily_goal_instances (
    id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    goal_id UUID NOT NULL,
    user_id UUID NOT NULL,
    date DATE NOT NULL,
    target_value FLOAT NOT NULL,
    completed_value FLOAT NOT NULL DEFAULT 0,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_daily_goal_instances_goals
        FOREIGN KEY (goal_id)
        REFERENCES goals(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_daily_goal_instances_users
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE NO ACTION,

    CONSTRAINT uq_daily_goal_instance
        UNIQUE (user_id, goal_id, date)
);

------------------------------------------------------------
-- 7️⃣ WORKOUTS (FOR DASHBOARD)
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS workouts (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    activity_type VARCHAR(50) NOT NULL,
    workout_date TIMESTAMP NOT NULL,
    duration INTEGER DEFAULT 0, -- in minutes
    calories DECIMAL(10, 2) DEFAULT 0,
    distance DECIMAL(10, 2) DEFAULT 0, -- in km
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_workouts_users
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- Indexes for workouts
CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_workouts_workout_date ON workouts(workout_date);
CREATE INDEX IF NOT EXISTS idx_workouts_activity_type ON workouts(activity_type);
CREATE INDEX IF NOT EXISTS idx_workouts_user_date ON workouts(user_id, workout_date);

------------------------------------------------------------
-- 🏆 GAMIFICATION
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS achievements (
    id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(100) NULL,
    xp_reward INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_achievements (
    user_id UUID NOT NULL,
    achievement_id UUID NOT NULL,
    unlocked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_user_achievements PRIMARY KEY (user_id, achievement_id),

    CONSTRAINT fk_user_achievements_users
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_user_achievements_achievements
        FOREIGN KEY (achievement_id)
        REFERENCES achievements(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_gamification (
    user_id UUID NOT NULL PRIMARY KEY,
    total_xp INT NOT NULL DEFAULT 0,
    level INT NOT NULL DEFAULT 1,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_gamification_users
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS xp_events (
    id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    source VARCHAR(50) NOT NULL,
    value INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_xp_events_users
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

------------------------------------------------------------
-- 💬 FORUM
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS forum_categories (
    id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS forum_posts (
    id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    category_id UUID NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    is_locked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_forum_posts_users
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE NO ACTION,

    CONSTRAINT fk_forum_posts_categories
        FOREIGN KEY (category_id)
        REFERENCES forum_categories(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS forum_comments (
    id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL,
    user_id UUID NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_forum_comments_posts
        FOREIGN KEY (post_id)
        REFERENCES forum_posts(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_forum_comments_users
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS forum_reactions (
    id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    post_id UUID NULL,
    comment_id UUID NULL,
    reaction_type VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_forum_reactions_users
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE NO ACTION,

    CONSTRAINT fk_forum_reactions_posts
        FOREIGN KEY (post_id)
        REFERENCES forum_posts(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_forum_reactions_comments
        FOREIGN KEY (comment_id)
        REFERENCES forum_comments(id)
        ON DELETE NO ACTION
);

------------------------------------------------------------
-- 🔔 NOTIFICATIONS
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
    id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    scheduled_at TIMESTAMP NULL,
    sent_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notifications_users
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notification_settings (
    user_id UUID NOT NULL PRIMARY KEY,
    goal_reminders BOOLEAN NOT NULL DEFAULT TRUE,
    forum_updates BOOLEAN NOT NULL DEFAULT TRUE,
    achievement_alerts BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notification_settings_users
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

------------------------------------------------------------
-- 📊 SAMPLE DATA FOR TESTING (OPTIONAL)
------------------------------------------------------------
/*
-- Insert a test user (password: 'password123' - hashed)
INSERT INTO users (name, email, password_hash) 
VALUES ('Test User', 'test@example.com', '$2b$10$abcdefghijklmnopqrstuvwxyz123456789');

-- Get the user ID and insert sample workouts
-- Replace 'user-uuid-here' with the actual UUID from the users table
INSERT INTO workouts (user_id, activity_type, workout_date, duration, calories, distance)
VALUES
    ('user-uuid-here', 'Running', CURRENT_TIMESTAMP - INTERVAL '1 day', 30, 300, 5.0),
    ('user-uuid-here', 'Cycling', CURRENT_TIMESTAMP - INTERVAL '2 days', 45, 400, 15.5),
    ('user-uuid-here', 'Swimming', CURRENT_TIMESTAMP - INTERVAL '3 days', 25, 250, 1.0),
    ('user-uuid-here', 'Running', CURRENT_TIMESTAMP - INTERVAL '4 days', 35, 350, 6.0),
    ('user-uuid-here', 'Yoga', CURRENT_TIMESTAMP - INTERVAL '5 days', 60, 180, 0),
    ('user-uuid-here', 'Weight Training', CURRENT_TIMESTAMP - INTERVAL '6 days', 50, 300, 0),
    ('user-uuid-here', 'Running', CURRENT_TIMESTAMP - INTERVAL '7 days', 40, 400, 7.0);
*/

-- Verify tables created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
