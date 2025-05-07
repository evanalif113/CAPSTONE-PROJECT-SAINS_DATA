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
  `created_at` timestamp NOT NULL,
  `temperature` float COMMENT 'Suhu udara dalam °C',
  `humidity` float COMMENT 'Kelembapan udara dalam %',
  `light` float COMMENT 'Intensitas cahaya dalam lux',
  `moisture` float COMMENT 'Kelembapan baglog dalam %'
);

CREATE TABLE `HUMIDIFIER` (
  `id` integer PRIMARY KEY,
  `device_id` integer NOT NULL,
  `pengguna_id` integer NOT NULL,
  `started_at` timestamp,
  `ended_at` timestamp,
  `volume_liters` float
);

CREATE TABLE `AKTUATOR` (
  `id` integer PRIMARY KEY,
  `actuator_id` intger NOT NULL
);

ALTER TABLE `PENGGUNA` COMMENT = 'Tabel Pengguna';

ALTER TABLE `BAGLOG` COMMENT = 'Tabel Baglog';

ALTER TABLE `DEVICE` COMMENT = 'Tabel perangkat';

ALTER TABLE `DATA_SENSOR` COMMENT = 'Data pembacaan sensor secara berkala';

ALTER TABLE `HUMIDIFIER` COMMENT = 'Catatan aktivitas humidifier otomatis';

ALTER TABLE `BAGLOG` ADD FOREIGN KEY (`pengguna_id`) REFERENCES `PENGGUNA` (`id`);

ALTER TABLE `DEVICE` ADD FOREIGN KEY (`baglog_id`) REFERENCES `BAGLOG` (`id`);

ALTER TABLE `DATA_SENSOR` ADD FOREIGN KEY (`device_id`) REFERENCES `DEVICE` (`id`);

ALTER TABLE `HUMIDIFIER` ADD FOREIGN KEY (`device_id`) REFERENCES `DEVICE` (`id`);

ALTER TABLE `HUMIDIFIER` ADD FOREIGN KEY (`pengguna_id`) REFERENCES `PENGGUNA` (`id`);

ALTER TABLE `AKTUATOR` ADD FOREIGN KEY (`actuator_id`) REFERENCES `DEVICE` (`id`);

ALTER TABLE `DEVICE` ADD FOREIGN KEY (`serial_number`) REFERENCES `DEVICE` (`baglog_id`);
