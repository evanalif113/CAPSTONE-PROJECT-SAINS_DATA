-- 1. Buat database
CREATE DATABASE IF NOT EXISTS DB_JAMUR;
USE DB_JAMUR;

-- 2. Tabel Pengguna
CREATE TABLE IF NOT EXISTS PENGGUNA (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'petani', 'teknisi') DEFAULT 'petani',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Tabel Kumbung (ruang budidaya jamur)
CREATE TABLE IF NOT EXISTS KUMBUNG (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pengguna_id INT NOT NULL,
    nama VARCHAR(100) NOT NULL,
    lokasi VARCHAR(255),
    deskripsi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pengguna_id) REFERENCES PENGGUNA(id) ON DELETE CASCADE
);

-- 4. Tabel Sensor
CREATE TABLE IF NOT EXISTS SENSOR (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kumbung_id INT NOT NULL,
    nama VARCHAR(100) NOT NULL,
    jenis ENUM('suhu', 'kelembapan', 'cahaya', 'moisture', 'lainnya'),
    nomor_seri VARCHAR(100) UNIQUE NOT NULL,
    status ENUM('active', 'inactive', 'error') DEFAULT 'active',
    tanggal_registrasi DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (kumbung_id) REFERENCES KUMBUNG(id) ON DELETE CASCADE
);

-- 5. Tabel Data Sensor
CREATE TABLE IF NOT EXISTS DATA_SENSOR (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sensor_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    temperature FLOAT,
    humidity FLOAT,
    light FLOAT,
    moisture FLOAT,
    FOREIGN KEY (sensor_id) REFERENCES SENSOR(id) ON DELETE CASCADE
);

-- 6. Tabel Aktuator (kendali perangkat via relay)
CREATE TABLE IF NOT EXISTS AKTUATOR (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kumbung_id INT NOT NULL,
    nama VARCHAR(100) NOT NULL,
    jenis ENUM('kipas', 'humidifier', 'lampu', 'lainnya') NOT NULL,
    nomor_relay INT NOT NULL,
    status ENUM('aktif', 'non-aktif') DEFAULT 'aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (kumbung_id) REFERENCES KUMBUNG(id) ON DELETE CASCADE
);

-- 7. Tabel Log Aktuator (aktivitas perangkat)
CREATE TABLE IF NOT EXISTS LOG_AKTUATOR (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    aktuator_id INT NOT NULL,
    aksi ENUM('ON', 'OFF') NOT NULL,
    keterangan TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (aktuator_id) REFERENCES AKTUATOR(id) ON DELETE CASCADE
);

-- 8. Tabel Kalibrasi Sensor
CREATE TABLE IF NOT EXISTS KALIBRASI_SENSOR (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sensor_id INT NOT NULL,
    calibration_date DATE NOT NULL,
    calibration_value FLOAT,
    notes TEXT,
    FOREIGN KEY (sensor_id) REFERENCES SENSOR(id) ON DELETE CASCADE
);

-- 9. Tabel Pengaturan Threshold
CREATE TABLE IF NOT EXISTS THRESHOLD (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kumbung_id INT NOT NULL,
    
    suhu_min FLOAT NOT NULL,
    suhu_max FLOAT NOT NULL,
    
    kelembapan_min FLOAT NOT NULL,
    kelembapan_max FLOAT NOT NULL,
    
    moisture_min FLOAT,
    moisture_max FLOAT,
    
    light_min FLOAT,
    light_max FLOAT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (kumbung_id) REFERENCES KUMBUNG(id) ON DELETE CASCADE
);

-- 10. Tabel Notifikasi
CREATE TABLE IF NOT EXISTS NOTIFIKASI (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pengguna_id INT NOT NULL,
    message TEXT NOT NULL,
    status ENUM('terbaca', 'belum_terbaca') DEFAULT 'belum_terbaca',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pengguna_id) REFERENCES PENGGUNA(id) ON DELETE CASCADE
);
