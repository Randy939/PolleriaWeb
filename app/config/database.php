<?php
class Database {
    private $host = "sql313.infinityfree.com";
    private $database_name = "if0_37640185_bdpolleria";
    private $username = "if0_37640185";
    private $password = "43rwcc2pVksS";
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