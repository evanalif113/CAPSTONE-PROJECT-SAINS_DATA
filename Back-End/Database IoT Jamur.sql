CREATE TABLE "pengguna" (
  "id" integer PRIMARY KEY,
  "username" varchar UNIQUE,
  "password" varchar,
  "role" varchar,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "baglog" (
  "id" integer PRIMARY KEY,
  "pengguna_id" integer NOT NULL,
  "name" varchar,
  "location" varchar,
  "description" text,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "sensor" (
  "id" integer PRIMARY KEY,
  "baglog_id" integer NOT NULL,
  "name" varchar,
  "serial_number" varchar UNIQUE,
  "status" device_status,
  "last_active" timestamp,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "data_sensor" (
  "id" bigserial PRIMARY KEY,
  "sensor_id" integer NOT NULL,
  "created_at" timestamp NOT NULL,
  "temperature" float,
  "humidity" float,
  "light" float,
  "moisture" float
);

CREATE TABLE "aktuator" (
  "id" integer PRIMARY KEY,
  "device_id" integer NOT NULL,
  "pengguna_id" integer NOT NULL,
  "baglog_id" integer NOT NULL,
  "started_at" timestamp,
  "ended_at" timestamp,
  "volume_liters" float
);

COMMENT ON TABLE "pengguna" IS 'Tabel Pengguna';

COMMENT ON COLUMN "pengguna"."role" IS 'admin, petani, teknisi';

COMMENT ON TABLE "baglog" IS 'Tabel Baglog';

COMMENT ON TABLE "sensor" IS 'Tabel perangkat';

COMMENT ON TABLE "data_sensor" IS 'Data pembacaan sensor secara berkala';

COMMENT ON COLUMN "data_sensor"."temperature" IS 'Suhu udara dalam °C';

COMMENT ON COLUMN "data_sensor"."humidity" IS 'Kelembapan udara dalam %';

COMMENT ON COLUMN "data_sensor"."light" IS 'Intensitas cahaya dalam lux';

COMMENT ON COLUMN "data_sensor"."moisture" IS 'Kelembapan baglog dalam %';

COMMENT ON TABLE "aktuator" IS 'Catatan aktivitas humidifier otomatis';

ALTER TABLE "baglog" ADD FOREIGN KEY ("pengguna_id") REFERENCES "pengguna" ("id");

ALTER TABLE "sensor" ADD FOREIGN KEY ("baglog_id") REFERENCES "baglog" ("id");

ALTER TABLE "data_sensor" ADD FOREIGN KEY ("sensor_id") REFERENCES "sensor" ("id");

ALTER TABLE "aktuator" ADD FOREIGN KEY ("device_id") REFERENCES "sensor" ("id");

ALTER TABLE "aktuator" ADD FOREIGN KEY ("pengguna_id") REFERENCES "pengguna" ("id");

ALTER TABLE "aktuator" ADD FOREIGN KEY ("baglog_id") REFERENCES "baglog" ("id");
