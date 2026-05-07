-- ============================================================
-- E11 - Script DDL
-- Plataforma de voluntariado
-- Modulo Tomas Urrego: Usuarios y Comunicaciones
-- Modulo Albert Higuita: Campanas y Actividades
-- DDL alineado al documento de diseno entregado.
-- ============================================================

CREATE DATABASE IF NOT EXISTS voluntariado
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE voluntariado;

-- ------------------------------------------------------------
-- Tablas independientes (sin FK externas)
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS ROL (
  id_rol      INT PRIMARY KEY AUTO_INCREMENT,
  nombre_rol  VARCHAR(50) NOT NULL UNIQUE COMMENT 'Administrador, Voluntario, Organizacion'
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS CIUDAD (
  id_ciudad     INT PRIMARY KEY AUTO_INCREMENT,
  nombre_ciudad VARCHAR(100) NOT NULL,
  departamento  VARCHAR(100)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS CATEGORIA (
  id_categoria     INT PRIMARY KEY AUTO_INCREMENT,
  nombre_categoria VARCHAR(50) NOT NULL UNIQUE,
  descripcion      VARCHAR(255)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Entidad central de autenticacion
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS USUARIO (
  id_usuario          INT PRIMARY KEY AUTO_INCREMENT,
  correo_electronico  VARCHAR(100) NOT NULL UNIQUE,
  contrasena          VARCHAR(255) NOT NULL,
  fecha_registro      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_rol              INT NOT NULL,
  id_ciudad           INT,
  CONSTRAINT fk_usuario_rol    FOREIGN KEY (id_rol)    REFERENCES ROL(id_rol),
  CONSTRAINT fk_usuario_ciudad FOREIGN KEY (id_ciudad) REFERENCES CIUDAD(id_ciudad)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Perfiles especializados (1:1 con USUARIO)
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS PERFIL_VOLUNTARIO (
  id_voluntario INT PRIMARY KEY AUTO_INCREMENT,
  nombre        VARCHAR(100) NOT NULL,
  apellido      VARCHAR(100) NOT NULL,
  telefono      VARCHAR(20),
  intereses     TEXT,
  id_usuario    INT NOT NULL UNIQUE,
  CONSTRAINT fk_pv_usuario FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS PERFIL_ORGANIZACION (
  id_organizacion    INT PRIMARY KEY AUTO_INCREMENT,
  nombre_institucion VARCHAR(150) NOT NULL,
  nit_registro       VARCHAR(50) NOT NULL UNIQUE,
  telefono           VARCHAR(20),
  descripcion_org    TEXT,
  estado_activo      BOOLEAN NOT NULL DEFAULT TRUE,
  estado_verificacion VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE' COMMENT 'PENDIENTE, VERIFICADA, SUSPENDIDA',
  id_usuario         INT NOT NULL UNIQUE,
  CONSTRAINT fk_po_usuario FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS PERFIL_ADMIN (
  id_admin      INT PRIMARY KEY AUTO_INCREMENT,
  nombre        VARCHAR(100) NOT NULL,
  apellido      VARCHAR(100) NOT NULL,
  nivel_acceso  VARCHAR(50) NOT NULL DEFAULT 'GENERAL',
  id_usuario    INT NOT NULL UNIQUE,
  CONSTRAINT fk_pa_usuario FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Actividades publicadas por organizaciones
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS ACTIVIDAD (
  id_actividad      INT PRIMARY KEY AUTO_INCREMENT,
  titulo            VARCHAR(150) NOT NULL,
  descripcion       TEXT,
  fecha_evento      DATETIME NOT NULL,
  direccion         VARCHAR(200),
  cupos_totales     INT NOT NULL DEFAULT 0,
  cupos_disponibles INT NOT NULL DEFAULT 0,
  estado_actividad  VARCHAR(20) NOT NULL DEFAULT 'PUBLICADA' COMMENT 'BORRADOR, PUBLICADA, EN_CURSO, FINALIZADA, CANCELADA',
  imagen_url        LONGTEXT,
  id_organizacion   INT NOT NULL,
  id_categoria      INT NOT NULL,
  id_ciudad         INT NOT NULL,
  CONSTRAINT fk_act_org    FOREIGN KEY (id_organizacion) REFERENCES PERFIL_ORGANIZACION(id_organizacion) ON DELETE CASCADE,
  CONSTRAINT fk_act_cat    FOREIGN KEY (id_categoria)    REFERENCES CATEGORIA(id_categoria),
  CONSTRAINT fk_act_ciudad FOREIGN KEY (id_ciudad)       REFERENCES CIUDAD(id_ciudad)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Inscripciones (voluntario - actividad)
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS INSCRIPCION (
  id_inscripcion     INT PRIMARY KEY AUTO_INCREMENT,
  fecha_inscripcion  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  estado_solicitud   VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE' COMMENT 'PENDIENTE, APROBADA, RECHAZADA, ASISTIO, NO_ASISTIO',
  horas_acreditadas  INT NOT NULL DEFAULT 0,
  id_voluntario      INT NOT NULL,
  id_actividad       INT NOT NULL,
  CONSTRAINT fk_ins_vol UNIQUE (id_voluntario, id_actividad),
  CONSTRAINT fk_ins_voluntario FOREIGN KEY (id_voluntario) REFERENCES PERFIL_VOLUNTARIO(id_voluntario) ON DELETE CASCADE,
  CONSTRAINT fk_ins_actividad  FOREIGN KEY (id_actividad)  REFERENCES ACTIVIDAD(id_actividad) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Resena (1:1 con INSCRIPCION)
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS RESENA (
  id_resena      INT PRIMARY KEY AUTO_INCREMENT,
  calificacion   INT NOT NULL,
  comentario     TEXT,
  fecha_resena   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_inscripcion INT NOT NULL,
  CONSTRAINT fk_res_ins FOREIGN KEY (id_inscripcion) REFERENCES INSCRIPCION(id_inscripcion) ON DELETE CASCADE,
  CONSTRAINT chk_res_calif CHECK (calificacion BETWEEN 1 AND 5)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Mensajeria entre usuarios (con contexto de actividad opcional)
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS MENSAJE (
  id_mensaje              INT PRIMARY KEY AUTO_INCREMENT,
  contenido               TEXT NOT NULL,
  fecha_envio             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  leido                   BOOLEAN NOT NULL DEFAULT FALSE,
  id_usuario_remitente    INT NOT NULL,
  id_usuario_destinatario INT NOT NULL,
  id_actividad            INT NULL,
  CONSTRAINT fk_msg_remitente    FOREIGN KEY (id_usuario_remitente)    REFERENCES USUARIO(id_usuario) ON DELETE CASCADE,
  CONSTRAINT fk_msg_destinatario FOREIGN KEY (id_usuario_destinatario) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE,
  CONSTRAINT fk_msg_actividad    FOREIGN KEY (id_actividad)            REFERENCES ACTIVIDAD(id_actividad) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Notificaciones por usuario
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS NOTIFICACION (
  id_notificacion INT PRIMARY KEY AUTO_INCREMENT,
  titulo          VARCHAR(150) NOT NULL,
  mensaje         VARCHAR(500) NOT NULL,
  tipo            VARCHAR(40)  NOT NULL DEFAULT 'GENERAL' COMMENT 'INSCRIPCION_APROBADA, INSCRIPCION_RECHAZADA, NUEVA_ACTIVIDAD, ORG_VERIFICADA, MENSAJE_NUEVO',
  fecha_creacion  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  leido           BOOLEAN NOT NULL DEFAULT FALSE,
  id_usuario      INT NOT NULL,
  CONSTRAINT fk_noti_usuario FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;
