<?php
class Usuario {
    private $conn;
    private $table_name = "usuarios";

    public $id;
    public $nombre;
    public $apellido;
    public $email;
    public $password;
    public $direccion;
    public $telefono;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function crear() {
        if($this->emailExiste()) {
            throw new Exception("Este correo electrónico ya está registrado");
        }

        $query = "INSERT INTO " . $this->table_name . "
                (nombre, apellido, email, password, direccion, telefono)
                VALUES
                (:nombre, :apellido, :email, :password, :direccion, :telefono)";

        $stmt = $this->conn->prepare($query);

        // Sanitizar
        $this->nombre = htmlspecialchars(strip_tags($this->nombre));
        $this->apellido = htmlspecialchars(strip_tags($this->apellido));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->direccion = htmlspecialchars(strip_tags($this->direccion));
        $this->telefono = htmlspecialchars(strip_tags($this->telefono));

        // Vincular valores
        $stmt->bindParam(":nombre", $this->nombre);
        $stmt->bindParam(":apellido", $this->apellido);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":password", $this->password);
        $stmt->bindParam(":direccion", $this->direccion);
        $stmt->bindParam(":telefono", $this->telefono);

        return $stmt->execute();
    }

    private function emailExiste() {
        $query = "SELECT id FROM " . $this->table_name . " WHERE email = :email LIMIT 1";
        $stmt = $this->conn->prepare($query);
        
        $this->email = htmlspecialchars(strip_tags($this->email));
        $stmt->bindParam(":email", $this->email);
        
        $stmt->execute();
        
        return $stmt->rowCount() > 0;
    }

    public function login() {
        try {
            $query = "SELECT id, nombre, password FROM " . $this->table_name . " 
                     WHERE email = ? LIMIT 0,1";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(1, $this->email);
            $stmt->execute();

            if($stmt->rowCount() > 0) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                if(password_verify($this->password, $row['password'])) {
                    return array(
                        'id' => $row['id'],
                        'nombre' => $row['nombre']
                    );
                }
            }
            return false;
        } catch(PDOException $e) {
            throw new Exception("Error en la consulta de login: " . $e->getMessage());
        }
    }
}
?> 