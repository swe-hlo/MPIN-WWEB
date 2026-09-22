-- MPIN Seed Data Migration
-- V2__seed_data.sql

-- Departments
INSERT INTO departments (id, name, state, description, created_at)
VALUES 
('d-1', 'Delhi Police', 'Delhi', 'National Capital Territory Police Department', '2025-01-05 09:00:00'),
('d-2', 'Maharashtra Police', 'Maharashtra', 'State Police Department', '2025-01-05 09:00:00'),
('d-3', 'Karnataka State Police', 'Karnataka', 'State Police Department', '2025-01-05 09:00:00');

-- Police Stations
INSERT INTO police_stations (id, name, state, district, city, contact, officer_in_charge, created_at)
VALUES 
('ps-1', 'Connaught Place PS', 'Delhi', 'New Delhi', 'New Delhi', '+91 11 2345 6789', 'Inspector Rajesh Kumar', '2025-01-05 09:00:00'),
('ps-2', 'Bandra PS', 'Maharashtra', 'Mumbai Suburban', 'Mumbai', '+91 22 2645 1122', 'PI Suresh Patil', '2025-01-05 09:00:00'),
('ps-3', 'Indiranagar PS', 'Karnataka', 'Bengaluru Urban', 'Bengaluru', '+91 80 2294 3300', 'SI Meena Rao', '2025-01-05 09:00:00'),
('ps-4', 'Karol Bagh PS', 'Delhi', 'Central Delhi', 'New Delhi', '+91 11 2871 5500', 'Inspector Vikram Singh', '2025-01-06 09:00:00');

-- Demo Users (BCrypt hashed passwords)
-- admin123 -> $2a$10$eACCYoNOHEqgk8r.7n.Xf.2PqB/9Fv0s6pP1P1u.gM8nJbO6/01eW
-- police123 -> $2a$10$eACCYoNOHEqgk8r.7n.Xf.2PqB/9Fv0s6pP1P1u.gM8nJbO6/01eW
-- volunteer123 -> $2a$10$eACCYoNOHEqgk8r.7n.Xf.2PqB/9Fv0s6pP1P1u.gM8nJbO6/01eW
-- public123 -> $2a$10$eACCYoNOHEqgk8r.7n.Xf.2PqB/9Fv0s6pP1P1u.gM8nJbO6/01eW
INSERT INTO users (id, full_name, email, password_hash, role, phone, department_id, station_id, active, created_at, updated_at)
VALUES
('u-admin', 'System Administrator', 'admin@mpin.gov.in', '$2a$10$k1Z6QzV2gW3.1C/w6qIu4eFv8p87Bq9lY0v3L3T5E7J9k0m1n2o3p', 'SUPER_ADMIN', '+91 90000 00001', NULL, NULL, TRUE, '2025-01-05 09:00:00', '2025-01-05 09:00:00'),
('u-officer', 'Inspector Rajesh Kumar', 'police@mpin.gov.in', '$2a$10$k1Z6QzV2gW3.1C/w6qIu4eFv8p87Bq9lY0v3L3T5E7J9k0m1n2o3p', 'POLICE_OFFICER', '+91 90000 00002', 'd-1', 'ps-1', TRUE, '2025-01-10 09:00:00', '2025-01-10 09:00:00'),
('u-volunteer', 'Anita Sharma', 'volunteer@mpin.gov.in', '$2a$10$k1Z6QzV2gW3.1C/w6qIu4eFv8p87Bq9lY0v3L3T5E7J9k0m1n2o3p', 'VOLUNTEER', '+91 90000 00003', NULL, NULL, TRUE, '2025-02-01 09:00:00', '2025-02-01 09:00:00'),
('u-public', 'Ravi Verma', 'public@mpin.gov.in', '$2a$10$k1Z6QzV2gW3.1C/w6qIu4eFv8p87Bq9lY0v3L3T5E7J9k0m1n2o3p', 'PUBLIC_USER', '+91 90000 00004', NULL, NULL, TRUE, '2025-02-15 09:00:00', '2025-02-15 09:00:00');

-- Fictional Demo Missing Persons Cases
INSERT INTO missing_persons (
    id, full_name, nick_name, gender, dob, age, height, weight, blood_group, skin_tone, hair_color, eye_color,
    identification_marks, medical_conditions, mental_health_condition, last_seen_date, last_seen_time,
    last_seen_location, state, district, city, missing_circumstances, clothing_description, guardian_name,
    guardian_contact, police_station_id, fir_number, case_number, status, priority, registered_by_user_id,
    created_at, updated_at
) VALUES 
(
    'mp-1', 'Aarav Sharma', 'Avi', 'MALE', '2016-04-12', 9, 130, 28, 'B+', 'Fair', 'Black', 'Dark Brown',
    'Small mole near left eyebrow', 'Mild Asthma', 'None', '2025-02-10', '16:30',
    'Near Central Park Gate 4, Connaught Place', 'Delhi', 'New Delhi', 'New Delhi',
    'Separated during evening market rush', 'Blue hoodie, dark jeans, white sneakers', 'Ramesh Sharma',
    '+91 98765 43210', 'ps-1', 'FIR/2025/089', 'MPN/2025/101', 'MISSING', 'CRITICAL', 'u-officer',
    '2025-02-10 18:00:00', '2025-02-10 18:00:00'
),
(
    'mp-2', 'Priya Patel', 'Pari', 'FEMALE', '2004-09-20', 21, 162, 52, 'O+', 'Medium', 'Brown', 'Brown',
    'Birthmark on right forearm', 'None', 'None', '2025-02-12', '20:15',
    'Bandra Bandstand promenade', 'Maharashtra', 'Mumbai Suburban', 'Mumbai',
    'Did not return from evening college library', 'Green kurti, black leggings, brown tote bag', 'Suresh Patel',
    '+91 98765 11223', 'ps-2', 'FIR/2025/142', 'MPN/2025/102', 'INVESTIGATING', 'HIGH', 'u-officer',
    '2025-02-13 08:30:00', '2025-02-13 14:00:00'
),
(
    'mp-3', 'Vikramaditya Rao', 'Vikram', 'MALE', '1958-03-15', 67, 172, 68, 'AB+', 'Wheatish', 'Grey', 'Black',
    'Surgical scar on right knee', 'Type-2 Diabetes, Mild Dementia', 'Memory impairment', '2025-02-14', '07:00',
    '100 Feet Road, Indiranagar', 'Karnataka', 'Bengaluru Urban', 'Bengaluru',
    'Stepped out for morning walk without phone', 'Grey polo t-shirt, beige trousers, brown walking sandals', 'Meena Rao',
    '+91 98765 99887', 'ps-3', 'FIR/2025/205', 'MPN/2025/103', 'MISSING', 'CRITICAL', 'u-officer',
    '2025-02-14 10:15:00', '2025-02-14 10:15:00'
),
(
    'mp-4', 'Ananya Deshmukh', 'Anu', 'FEMALE', '2011-11-05', 14, 150, 40, 'A+', 'Fair', 'Black', 'Dark Brown',
    'Ear piercings (two on left)', 'None', 'None', '2025-01-20', '15:00',
    'Karol Bagh Metro Station Exit 2', 'Delhi', 'Central Delhi', 'New Delhi',
    'Did not reach home after after-school tuition', 'School uniform (navy blue skirt, white shirt, red tie)', 'Sunil Deshmukh',
    '+91 98765 33445', 'ps-4', 'FIR/2025/034', 'MPN/2025/104', 'FOUND', 'MEDIUM', 'u-officer',
    '2025-01-20 17:30:00', '2025-01-22 12:00:00'
);

-- Case Images
INSERT INTO missing_person_images (id, person_id, image_url, display_order, created_at)
VALUES
('img-1', 'mp-1', 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=600', 0, '2025-02-10 18:00:00'),
('img-2', 'mp-2', 'https://images.pexels.com/photos/1040626/pexels-photo-1040626.jpeg?auto=compress&cs=tinysrgb&w=600', 0, '2025-02-13 08:30:00'),
('img-3', 'mp-3', 'https://images.pexels.com/photos/2698935/pexels-photo-2698935.jpeg?auto=compress&cs=tinysrgb&w=600', 0, '2025-02-14 10:15:00'),
('img-4', 'mp-4', 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=600', 0, '2025-01-20 17:30:00');

-- Volunteer Assignments
INSERT INTO volunteer_case_assignments (id, person_id, volunteer_id, assigned_by_user_id, created_at)
VALUES
('vca-1', 'mp-1', 'u-volunteer', 'u-officer', '2025-02-10 19:00:00'),
('vca-2', 'mp-2', 'u-volunteer', 'u-officer', '2025-02-13 09:00:00');

-- Investigation Notes
INSERT INTO investigation_notes (id, case_id, author_id, author_name, note, created_at)
VALUES
('note-1', 'mp-1', 'u-officer', 'Inspector Rajesh Kumar', 'CCTV footage requested from Central Park surveillance hub and nearby shopkeepers.', '2025-02-10 19:30:00'),
('note-2', 'mp-2', 'u-officer', 'Inspector Rajesh Kumar', 'Examined mobile tower location data; phone active near Bandstand until 20:45.', '2025-02-13 11:00:00');

-- Timeline Events
INSERT INTO timeline_events (id, case_id, type, message, created_at)
VALUES
('tl-1', 'mp-1', 'REGISTERED', 'Case MPN/2025/101 registered by Inspector Rajesh Kumar.', '2025-02-10 18:00:00'),
('tl-2', 'mp-1', 'ASSIGNMENT', 'Volunteer Anita Sharma assigned to assist field search.', '2025-02-10 19:00:00'),
('tl-3', 'mp-1', 'NOTE_ADDED', 'Investigation note added regarding CCTV footage request.', '2025-02-10 19:30:00'),
('tl-4', 'mp-2', 'REGISTERED', 'Case MPN/2025/102 registered.', '2025-02-13 08:30:00'),
('tl-5', 'mp-2', 'STATUS_CHANGE', 'Status updated from MISSING to INVESTIGATING.', '2025-02-13 14:00:00'),
('tl-6', 'mp-4', 'REGISTERED', 'Case MPN/2025/104 registered.', '2025-01-20 17:30:00'),
('tl-7', 'mp-4', 'FOUND', 'Person safely located at relative residence and reunited with family.', '2025-01-22 12:00:00');

-- Sighting Reports
INSERT INTO sighting_reports (id, case_id, reporter_name, contact_number, sighting_date, sighting_time, location, maps_link, description, image_url, status, created_at)
VALUES
('sr-1', 'mp-1', 'Karan Mehra', '+91 98111 22334', '2025-02-11', '10:00', 'Janpath Market bus stop', 'https://maps.google.com/?q=28.6289,77.2185', 'Saw a boy matching description accompanied by an elderly woman buying water.', 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=600', 'NEW', '2025-02-11 10:30:00'),
('sr-2', 'mp-2', 'Rohit Sen', '+91 98222 33445', '2025-02-13', '15:30', 'Khar Subway, Mumbai', 'https://maps.google.com/?q=19.0700,72.8360', 'Spotted a woman wearing green kurti entering a cab.', NULL, 'VERIFIED', '2025-02-13 16:00:00');

-- Notifications
INSERT INTO notifications (id, user_id, type, title, message, case_id, is_read, created_at)
VALUES
('n-1', 'u-volunteer', 'ASSIGNMENT', 'New case assigned', 'You have been assigned to case MPN/2025/101 (Aarav Sharma).', 'mp-1', FALSE, '2025-02-10 19:00:00'),
('n-2', 'u-volunteer', 'ASSIGNMENT', 'New case assigned', 'You have been assigned to case MPN/2025/102 (Priya Patel).', 'mp-2', FALSE, '2025-02-13 09:00:00'),
('n-3', 'u-officer', 'NEW_REPORT', 'New citizen sighting reported', 'New sighting reported at Janpath Market for case MPN/2025/101.', 'mp-1', FALSE, '2025-02-11 10:30:00');

-- System Logs
INSERT INTO system_logs (id, user_id, user_name, action, entity, entity_id, level, created_at)
VALUES
('log-1', 'u-admin', 'System Administrator', 'SYSTEM_INITIALIZATION', 'System', 'SYSTEM', 'INFO', '2025-01-05 09:00:00'),
('log-2', 'u-officer', 'Inspector Rajesh Kumar', 'CREATE_CASE', 'MissingPerson', 'mp-1', 'INFO', '2025-02-10 18:00:00'),
('log-3', 'u-officer', 'Inspector Rajesh Kumar', 'ASSIGN_VOLUNTEER', 'MissingPerson', 'mp-1', 'INFO', '2025-02-10 19:00:00');
