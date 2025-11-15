-- Script SQL - AgroTrack V02
--  Creación de la Base de Datos y de la tabla "contactos"
--  Autor: Alejandra Judith Labra - Programación Web II (Volumen II)

-- Crear la base de datos (si no existe)
CREATE DATABASE IF NOT EXISTS agrotrack
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- Seleccionar la base de datos
USE agrotrack;

-- Crear tabla de contactos
CREATE TABLE IF NOT EXISTS contactos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- (Opcional) Crear índice por fecha para ordenamiento
CREATE INDEX idx_contactos_fecha ON contactos (fecha);
