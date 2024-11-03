<?php
class Database {
    private $host;
    private $database_name;
    private $username;
    private $password;
    private $port;
    public $conn;

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
            return $this->conn;
        } catch(PDOException $exception) {
            throw new Exception("Error de conexión a la base de datos: " . $exception->getMessage());
        }
    }
}
?> 