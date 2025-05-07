CREATE DATABASE IF NOT EXISTS DB_JAMUR;
USE DB_JAMUR;

CREATE TABLE `PENGGUNA` (
  `id` integer PRIMARY KEY,
  `email` varchar(255) UNIQUE,
  `password` varchar(255),
  `role` varchar(255) COMMENT 'admin, petani, teknisi',
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `BAGLOG` (
  `id` integer PRIMARY KEY,
  `pengguna_id` integer NOT NULL,
  `name` varchar(255),
  `location` varchar(255),
  `description` text,
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `DEVICE` (
  `id` integer PRIMARY KEY,
  `baglog_id` integer NOT NULL,
  `name` varchar(255),
  `serial_number` varchar(255) UNIQUE,
  `status` device_status,
  `installed_at` timestamp,
  `last_active` timestamp,
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `DATA_SENSOR` (
  `id` bigserial PRIMARY KEY,
  `device_id` integer NOT NULL,
  `recorded_at` timestamp NOT NULL,
  `temperature` float COMMENT 'Suhu udara dalam °C',
  `humidity` float COMMENT 'Kelembapan udara dalam %',
  `light` float COMMENT 'Intensitas cahaya dalam lux',
  `moisture` float COMMENT 'Kelembapan baglog dalam %'
);

CREATE TABLE `ALERTS` (
  `id` integer PRIMARY KEY,
  `id_perangkat` integer NOT NULL,
  `alert_type` varchar(255) COMMENT 'threshold, offline, error',
  `message` text,
  `triggered_at` timestamp,
  `resolved_at` timestamp,
  `status` alert_status
);

CREATE TABLE `MISTING` (
  `id` integer PRIMARY KEY,
  `device_id` integer NOT NULL,
  `pengguna_id` integer NOT NULL,
  `started_at` timestamp,
  `ended_at` timestamp,
  `volume_liters` float
);

CREATE TABLE `PREDIKSI` (
  `id` integer PRIMARY KEY,
  `device_id` integer NOT NULL,
  `prediksi_suhu` float,
  `prediksi_kelembapan` float,
  `prediksi_air` float
);

ALTER TABLE `PENGGUNA` COMMENT = 'Tabel Pengguna';

ALTER TABLE `BAGLOG` COMMENT = 'Tabel Baglog';

ALTER TABLE `DEVICE` COMMENT = 'Tabel perangkat';

ALTER TABLE `DATA_SENSOR` COMMENT = 'Data pembacaan sensor secara berkala';

ALTER TABLE `ALERTS` COMMENT = 'Data ';

ALTER TABLE `MISTING` COMMENT = 'Catatan aktivitas irigasi otomatis';

ALTER TABLE `PREDIKSI` COMMENT = 'Tabel hasil prediksi';

ALTER TABLE `BAGLOG` ADD FOREIGN KEY (`pengguna_id`) REFERENCES `PENGGUNA` (`id`);

ALTER TABLE `DEVICE` ADD FOREIGN KEY (`baglog_id`) REFERENCES `BAGLOG` (`id`);

ALTER TABLE `DATA_SENSOR` ADD FOREIGN KEY (`device_id`) REFERENCES `DEVICE` (`id`);

ALTER TABLE `ALERTS` ADD FOREIGN KEY (`id_perangkat`) REFERENCES `DEVICE` (`id`);

ALTER TABLE `MISTING` ADD FOREIGN KEY (`device_id`) REFERENCES `DEVICE` (`id`);

ALTER TABLE `MISTING` ADD FOREIGN KEY (`pengguna_id`) REFERENCES `PENGGUNA` (`id`);

ALTER TABLE `PREDIKSI` ADD FOREIGN KEY (`device_id`) REFERENCES `DEVICE` (`id`);

ALTER TABLE `ALERTS` ADD FOREIGN KEY (`message`) REFERENCES `ALERTS` (`triggered_at`);

ALTER TABLE `DEVICE` ADD FOREIGN KEY (`serial_number`) REFERENCES `DEVICE` (`baglog_id`);
