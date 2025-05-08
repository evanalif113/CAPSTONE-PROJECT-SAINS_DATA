-- SQL script to create the DB_JAMUR database

-- Create the database
CREATE DATABASE IF NOT EXISTS DB_JAMUR;

-- Use the created database
USE DB_JAMUR;

-- Create the PENGGUNA table
CREATE TABLE IF NOT EXISTS PENGGUNA (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the BAGLOG table
CREATE TABLE IF NOT EXISTS BAGLOG (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pengguna_id INT NOT NULL,
    name VARCHAR(100),
    location VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the SENSOR table
CREATE TABLE IF NOT EXISTS SENSOR (
    id INT AUTO_INCREMENT PRIMARY KEY,
    baglog_id INT NOT NULL,
    name VARCHAR(100),
    serial_number VARCHAR(100) UNIQUE,
    status ENUM('active', 'inactive', 'error'),
    last_active TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the DATA_SENSOR table
CREATE TABLE IF NOT EXISTS DATA_SENSOR (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sensor_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    temperature FLOAT COMMENT 'Suhu udara dalam °C',
    humidity FLOAT COMMENT 'Kelembapan udara dalam %',
    light FLOAT COMMENT 'Intensitas cahaya dalam lux',
    moisture FLOAT COMMENT 'Kelembapan baglog dalam %'
);

-- Create the AKTUATOR table
CREATE TABLE IF NOT EXISTS AKTUATOR (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_id INT NOT NULL,
    pengguna_id INT NOT NULL,
    baglog_id INT NOT NULL,
    started_at TIMESTAMP,
    ended_at TIMESTAMP,
    volume_liters FLOAT
);

-- Add comments to tables and columns
COMMENT ON TABLE PENGGUNA IS 'Tabel Pengguna';
COMMENT ON COLUMN PENGGUNA.role IS 'admin, petani, teknisi';

COMMENT ON TABLE BAGLOG IS 'Tabel Baglog';

COMMENT ON TABLE SENSOR IS 'Tabel perangkat';

COMMENT ON TABLE DATA_SENSOR IS 'Data pembacaan sensor secara berkala';
COMMENT ON COLUMN DATA_SENSOR.temperature IS 'Suhu udara dalam °C';
COMMENT ON COLUMN DATA_SENSOR.humidity IS 'Kelembapan udara dalam %';
COMMENT ON COLUMN DATA_SENSOR.light IS 'Intensitas cahaya dalam lux';
COMMENT ON COLUMN DATA_SENSOR.moisture IS 'Kelembapan baglog dalam %';

COMMENT ON TABLE AKTUATOR IS 'Catatan aktivitas humidifier otomatis';

-- Add foreign keys
ALTER TABLE BAGLOG ADD FOREIGN KEY (pengguna_id) REFERENCES PENGGUNA (id);

ALTER TABLE SENSOR ADD FOREIGN KEY (baglog_id) REFERENCES BAGLOG (id);

ALTER TABLE DATA_SENSOR ADD FOREIGN KEY (sensor_id) REFERENCES SENSOR (id);

ALTER TABLE AKTUATOR ADD FOREIGN KEY (device_id) REFERENCES SENSOR (id);
ALTER TABLE AKTUATOR ADD FOREIGN KEY (pengguna_id) REFERENCES PENGGUNA (id);
ALTER TABLE AKTUATOR ADD FOREIGN KEY (baglog_id) REFERENCES BAGLOG (id);

