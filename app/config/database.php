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
            throw new Exception("Error de conexión: " . $exception->getMessage());
        }
    }

    public function registerLoginAttempt($email, $ip_address, $is_blocked = 0) {
        if (!$this->conn) {
            $this->getConnection();
        }
        try {
            $query = "INSERT INTO login_attempts (email, ip_address, attempt_time, is_blocked) 
                      VALUES (:email, :ip_address, NOW(), :is_blocked)";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":email", $email);
            $stmt->bindParam(":ip_address", $ip_address);
            $stmt->bindParam(":is_blocked", $is_blocked);
            
            return $stmt->execute();
        } catch(PDOException $e) {
            throw new Exception("Error al registrar intento: " . $e->getMessage());
        }
    }

    public function getLoginAttempts($email, $ip_address, $minutes = 30) {
        if (!$this->conn) {
            $this->getConnection();
        }
        try {
            $query = "SELECT COUNT(*) as attempts, MAX(is_blocked) as is_blocked 
                      FROM login_attempts 
                      WHERE (email = :email OR ip_address = :ip_address) 
                      AND attempt_time > DATE_SUB(NOW(), INTERVAL :minutes MINUTE)";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":email", $email);
            $stmt->bindParam(":ip_address", $ip_address);
            $stmt->bindParam(":minutes", $minutes, PDO::PARAM_INT);
            $stmt->execute();
            
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch(PDOException $e) {
            throw new Exception("Error al obtener intentos: " . $e->getMessage());
        }
    }
}
?> 