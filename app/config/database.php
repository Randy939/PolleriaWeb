<?php
class Database {
    private $host;
    private $database_name;
    private $username;
    private $password;
    private $port;
    public $conn;

    public function __construct() {
        $this->host = getenv('DB_HOST') ?: 'MYSQL9001.site4now.net';
        $this->database_name = getenv('DB_NAME') ?: 'db_aaeed7_polleri';
        $this->username = getenv('DB_USER') ?: 'aaeed7_polleri';
        $this->password = getenv('DB_PASS') ?: 'TEadoros123k';
        $this->port = getenv('DB_PORT') ?: '3306';
    }

    public function getConnection() {
        try {
            error_log("Intentando conectar a la base de datos...");
            error_log("Host: " . $this->host);
            error_log("Database: " . $this->database_name);
            error_log("Port: " . $this->port);
            
            $dsn = "mysql:host=" . $this->host . 
                   ";dbname=" . $this->database_name . 
                   ";port=" . $this->port;
                   
            error_log("DSN: " . $dsn);
            
            $this->conn = new PDO($dsn, 
                $this->username, 
                $this->password,
                array(
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_TIMEOUT => 5,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"
                )
            );
            
            error_log("Conexión establecida exitosamente");
            return $this->conn;

        } catch(PDOException $exception) {
            error_log("Error de conexión PDO: " . $exception->getMessage());
            throw new Exception("Error de conexión a la base de datos: " . $exception->getMessage());
        }
    }
}
?> 