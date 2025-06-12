-- 1. Buat database
CREATE DATABASE IF NOT EXISTS DB_JAMUR;
USE DB_JAMUR;

-- 2. Tabel Pengguna
CREATE TABLE IF NOT EXISTS PENGGUNA (
    id_pengguna INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'petani', 'teknisi') DEFAULT 'petani',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Tabel Kumbung (ruang budidaya jamur)
CREATE TABLE IF NOT EXISTS KUMBUNG (
    id_kumbung INT AUTO_INCREMENT PRIMARY KEY,
    id_pengguna INT NOT NULL,
    nama VARCHAR(100) NOT NULL,
    lokasi VARCHAR(255),
    deskripsi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pengguna) REFERENCES PENGGUNA(id_pengguna) ON DELETE CASCADE
);

-- 4. Tabel Sensor
CREATE TABLE IF NOT EXISTS SENSOR (
    id_sensor INT AUTO_INCREMENT PRIMARY KEY,
    id_kumbung INT NOT NULL,
    nama VARCHAR(100) NOT NULL,
    nomor_seri VARCHAR(100) UNIQUE NOT NULL,
    status ENUM('active', 'inactive', 'error') DEFAULT 'active',
    tanggal_registrasi DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_kumbung) REFERENCES KUMBUNG(id_kumbung) ON DELETE CASCADE
);

-- 5. Tabel Data Sensor
CREATE TABLE IF NOT EXISTS DATA_SENSOR (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_sensor INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    temperature FLOAT,
    humidity FLOAT,
    light FLOAT,
    moisture FLOAT,
    FOREIGN KEY (id_sensor) REFERENCES SENSOR(id_sensor) ON DELETE CASCADE
);

-- 6. Tabel Aktuator (kendali perangkat via relay)
CREATE TABLE IF NOT EXISTS AKTUATOR (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_kumbung INT NOT NULL,
    nama VARCHAR(100) NOT NULL,
    jenis ENUM('kipas', 'humidifier', 'lampu', 'lainnya') NOT NULL,
    nomor_relay INT NOT NULL,
    status ENUM('aktif', 'non-aktif') DEFAULT 'aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_kumbung) REFERENCES KUMBUNG(id_kumbung) ON DELETE CASCADE
);
