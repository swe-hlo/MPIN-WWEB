-- MPIN Database Schema Initialization
-- V1__init_schema.sql

CREATE TABLE IF NOT EXISTS departments (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    state VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS police_stations (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    city VARCHAR(100),
    contact VARCHAR(50),
    officer_in_charge VARCHAR(150),
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    phone VARCHAR(50),
    avatar_url TEXT,
    department_id VARCHAR(50),
    station_id VARCHAR(50),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS missing_persons (
    id VARCHAR(50) PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    nick_name VARCHAR(150),
    gender VARCHAR(20) NOT NULL,
    dob DATE,
    age INT NOT NULL,
    height NUMERIC(6,2),
    weight NUMERIC(6,2),
    blood_group VARCHAR(10),
    skin_tone VARCHAR(50),
    hair_color VARCHAR(50),
    eye_color VARCHAR(50),
    identification_marks TEXT,
    medical_conditions TEXT,
    mental_health_condition TEXT,
    last_seen_date DATE NOT NULL,
    last_seen_time VARCHAR(20),
    last_seen_location VARCHAR(255) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    city VARCHAR(100),
    missing_circumstances TEXT,
    clothing_description TEXT,
    guardian_name VARCHAR(150),
    guardian_contact VARCHAR(50),
    police_station_id VARCHAR(50) NOT NULL,
    fir_number VARCHAR(100),
    case_number VARCHAR(100) NOT NULL UNIQUE,
    status VARCHAR(30) NOT NULL,
    priority VARCHAR(30) NOT NULL,
    registered_by_user_id VARCHAR(50),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS missing_person_images (
    id VARCHAR(50) PRIMARY KEY,
    person_id VARCHAR(50) NOT NULL,
    image_url TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_image_person FOREIGN KEY (person_id) REFERENCES missing_persons(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS volunteer_case_assignments (
    id VARCHAR(50) PRIMARY KEY,
    person_id VARCHAR(50) NOT NULL,
    volunteer_id VARCHAR(50) NOT NULL,
    assigned_by_user_id VARCHAR(50),
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT uk_person_volunteer UNIQUE (person_id, volunteer_id),
    CONSTRAINT fk_assign_person FOREIGN KEY (person_id) REFERENCES missing_persons(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS investigation_notes (
    id VARCHAR(50) PRIMARY KEY,
    case_id VARCHAR(50) NOT NULL,
    author_id VARCHAR(50) NOT NULL,
    author_name VARCHAR(150) NOT NULL,
    note TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_note_case FOREIGN KEY (case_id) REFERENCES missing_persons(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS timeline_events (
    id VARCHAR(50) PRIMARY KEY,
    case_id VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_timeline_case FOREIGN KEY (case_id) REFERENCES missing_persons(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sighting_reports (
    id VARCHAR(50) PRIMARY KEY,
    case_id VARCHAR(50),
    reporter_name VARCHAR(150) NOT NULL,
    contact_number VARCHAR(50) NOT NULL,
    sighting_date DATE NOT NULL,
    sighting_time VARCHAR(20),
    location VARCHAR(255) NOT NULL,
    maps_link TEXT,
    description TEXT,
    image_url TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'NEW',
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    case_id VARCHAR(50),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS system_logs (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    user_name VARCHAR(150),
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(100),
    entity_id VARCHAR(100),
    level VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL
);

-- Indexes for performance & search
CREATE INDEX IF NOT EXISTS idx_mp_status ON missing_persons(status);
CREATE INDEX IF NOT EXISTS idx_mp_state ON missing_persons(state);
CREATE INDEX IF NOT EXISTS idx_mp_district ON missing_persons(district);
CREATE INDEX IF NOT EXISTS idx_mp_gender ON missing_persons(gender);
CREATE INDEX IF NOT EXISTS idx_mp_station ON missing_persons(police_station_id);
CREATE INDEX IF NOT EXISTS idx_mp_created ON missing_persons(created_at);
CREATE INDEX IF NOT EXISTS idx_sighting_case ON sighting_reports(case_id);
CREATE INDEX IF NOT EXISTS idx_sighting_status ON sighting_reports(status);
CREATE INDEX IF NOT EXISTS idx_notif_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_assign_vol ON volunteer_case_assignments(volunteer_id);
