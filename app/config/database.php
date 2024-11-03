<?php
class Database {
    private $host;
    private $database_name;
    private $username;
    private $password;
    private $port;
    public $conn;
    private $maxIntentos = 3;
    private $tiempoBloqueo = 900; // 15 minutos en segundos

    public function __construct() {
        // Cargar variables de entorno
        $this->host = getenv('DB_HOST') ?: 'MYSQL9001.site4now.net';
        $this->database_name = getenv('DB_NAME') ?: 'db_aaeed7_polleri';
        $this->username = getenv('DB_USER') ?: 'aaeed7_polleri';
        $this->password = getenv('DB_PASS') ?: 'TEadoros123k';
        $this->port = getenv('DB_PORT') ?: '3306';
    }

    public function getConnection() {
        try {
            // Verificar si está bloqueado
            if ($this->estaBlockeado()) {
                throw new Exception("Demasiados intentos fallidos. Por favor, espere 15 minutos.");
            }

            $this->conn = new PDO(
                "mysql:host=" . $this->host . 
                ";dbname=" . $this->database_name . 
                ";port=" . $this->port,
                $this->username,
                $this->password,
                array(
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_TIMEOUT => 5,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"
                )
            );

            // Si la conexión es exitosa, reiniciar intentos
            $this->reiniciarIntentos();
            return $this->conn;

        } catch(PDOException $exception) {
            // Incrementar contador de intentos fallidos
            $this->incrementarIntentos();
            throw new Exception("Error de conexión a la base de datos: " . $exception->getMessage());
        }
    }

    private function estaBlockeado() {
        if (!isset($_SESSION['intentos_conexion'])) {
            $_SESSION['intentos_conexion'] = 0;
            $_SESSION['tiempo_bloqueo'] = 0;
            return false;
        }

        if ($_SESSION['intentos_conexion'] >= $this->maxIntentos) {
            if (time() < $_SESSION['tiempo_bloqueo']) {
                return true;
            }
            // Si ya pasó el tiempo de bloqueo, reiniciar intentos
            $this->reiniciarIntentos();
        }
        return false;
    }

    private function incrementarIntentos() {
        if (!isset($_SESSION['intentos_conexion'])) {
            $_SESSION['intentos_conexion'] = 0;
        }
        $_SESSION['intentos_conexion']++;
        
        if ($_SESSION['intentos_conexion'] >= $this->maxIntentos) {
            $_SESSION['tiempo_bloqueo'] = time() + $this->tiempoBloqueo;
        }
    }

    private function reiniciarIntentos() {
        $_SESSION['intentos_conexion'] = 0;
        $_SESSION['tiempo_bloqueo'] = 0;
    }
}
?> 