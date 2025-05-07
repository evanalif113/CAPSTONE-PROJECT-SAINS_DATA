CREATE DATABASE IF NOT EXISTS DB_JAMUR;
USE DB_JAMUR;

CREATE TABLE `PENGGUNA` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `email` VARCHAR(255) UNIQUE,
  `password` VARCHAR(255),
  `role` ENUM('admin', 'petani', 'teknisi') COMMENT 'admin, petani, teknisi',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `BAGLOG` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `pengguna_id` INTEGER NOT NULL,
  `name` VARCHAR(255),
  `location` VARCHAR(255),
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `DEVICE` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `baglog_id` INTEGER NOT NULL,
  `name` VARCHAR(255),
  `serial_number` VARCHAR(255) UNIQUE,
  `status` ENUM('active', 'inactive', 'error') COMMENT 'Status perangkat',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `DATA_SENSOR` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `device_id` INTEGER NOT NULL,
  `recorded_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `temperature` FLOAT COMMENT 'Suhu udara dalam °C',
  `humidity` FLOAT COMMENT 'Kelembapan udara dalam %',
  `moisture` FLOAT COMMENT 'Kelembapan baglog dalam %',
  `light` FLOAT COMMENT 'Intensitas cahaya dalam lux'
);

CREATE TABLE `ALERTS` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `id_perangkat` INTEGER NOT NULL,
  `alert_type` ENUM('threshold', 'offline', 'error') COMMENT 'Jenis alert',
  `message` TEXT,
  `triggered_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('active', 'resolved') COMMENT 'Status alert'
);

CREATE TABLE `MISTING` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `device_id` INTEGER NOT NULL,
  `pengguna_id` INTEGER NOT NULL,
  `started_at` TIMESTAMP,
  `ended_at` TIMESTAMP,
  `volume_liters` FLOAT
);

CREATE TABLE `PREDIKSI` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `device_id` INTEGER NOT NULL,
  `prediksi_suhu` FLOAT,
  `prediksi_kelembapan` FLOAT,
  `prediksi_air` FLOAT
);

-- Menambahkan komentar pada tabel
ALTER TABLE `PENGGUNA` COMMENT = 'Tabel Pengguna';
ALTER TABLE `BAGLOG` COMMENT = 'Tabel Baglog';
ALTER TABLE `DEVICE` COMMENT = 'Tabel perangkat';
ALTER TABLE `DATA_SENSOR` COMMENT = 'Data pembacaan sensor secara berkala';
ALTER TABLE `ALERTS` COMMENT = 'Data alert perangkat';
ALTER TABLE `MISTING` COMMENT = 'Catatan aktivitas irigasi otomatis';
ALTER TABLE `PREDIKSI` COMMENT = 'Tabel hasil prediksi';

-- Menambahkan FOREIGN KEY
ALTER TABLE `BAGLOG` ADD FOREIGN KEY (`pengguna_id`) REFERENCES `PENGGUNA` (`id`);
ALTER TABLE `DEVICE` ADD FOREIGN KEY (`baglog_id`) REFERENCES `BAGLOG` (`id`);
ALTER TABLE `DATA_SENSOR` ADD FOREIGN KEY (`device_id`) REFERENCES `DEVICE` (`id`);
ALTER TABLE `ALERTS` ADD FOREIGN KEY (`id_perangkat`) REFERENCES `DEVICE` (`id`);
ALTER TABLE `MISTING` ADD FOREIGN KEY (`device_id`) REFERENCES `DEVICE` (`id`);
ALTER TABLE `MISTING` ADD FOREIGN KEY (`pengguna_id`) REFERENCES `PENGGUNA` (`id`);
ALTER TABLE `PREDIKSI` ADD FOREIGN KEY (`device_id`) REFERENCES `DEVICE` (`id`);
