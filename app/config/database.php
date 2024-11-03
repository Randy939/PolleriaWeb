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
        $this->host = getenv('DB_HOST');
        $this->database_name = getenv('DB_NAME');
        $this->username = getenv('DB_USER');
        $this->password = getenv('DB_PASS');
        $this->port = getenv('DB_PORT');
    }

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . 
                ";dbname=" . $this->database_name . 
                ";port=" . $this->port,
                $this->username,
                $this->password,
                array(PDO::ATTR_TIMEOUT => 5)
            );
            $this->conn->exec("set names utf8");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $this->conn;
        } catch(PDOException $exception) {
            error_log("Error de conexión: " . $exception->getMessage());
            return null;
        }
    }
}
?> 