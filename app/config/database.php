<?php
class Database {
    private $host = "MYSQL9001.site4now.net";
    private $database_name = "db_aaeed7_polleri";
    private $username = "aaeed7_polleri";
    private $password = "TEadoros123k";
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->database_name . ";port=3306",
                $this->username,
                $this->password,
                array(PDO::ATTR_TIMEOUT => 5)
            );
            $this->conn->exec("set names utf8");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $this->conn;
        } catch(PDOException $exception) {
            echo "Error de conexión: " . $exception->getMessage();
            return null;
        }
    }
}
?> 