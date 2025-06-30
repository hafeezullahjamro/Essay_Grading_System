-- CorestoneGrader Database Initialization Script
-- This script creates the initial database schema and default data

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS corestone_grader;

-- Use the database
\c corestone_grader;

-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    credits INTEGER DEFAULT 1 NOT NULL,
    subscription_expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create purchases table
CREATE TABLE IF NOT EXISTS purchases (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bundle_id INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'completed' NOT NULL
);

-- Create gradings table
CREATE TABLE IF NOT EXISTS gradings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    essay_text TEXT NOT NULL,
    rubric_id INTEGER NOT NULL,
    scores TEXT NOT NULL, -- JSON stringified
    feedback TEXT NOT NULL,
    recommendations TEXT NOT NULL, -- JSON stringified
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create session store table for express-session
CREATE TABLE IF NOT EXISTS session (
    sid VARCHAR NOT NULL COLLATE "default",
    sess JSON NOT NULL,
    expire TIMESTAMP(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE session ADD CONSTRAINT session_pkey PRIMARY KEY (sid) NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX IF NOT EXISTS IDX_session_expire ON session(expire);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_date ON purchases(date);
CREATE INDEX IF NOT EXISTS idx_gradings_user_id ON gradings(user_id);
CREATE INDEX IF NOT EXISTS idx_gradings_date ON gradings(date);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, email, password, credits) 
VALUES (
    'admin', 
    'admin@corestronegrader.com', 
    '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', -- sha256 of 'admin123'
    1000
) ON CONFLICT (username) DO NOTHING;

-- Insert default rubric data (this would be handled by the application)
-- The rubrics are defined in the application code

COMMIT;