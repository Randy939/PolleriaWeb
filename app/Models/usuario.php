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

        // Hash de la contraseña
        $password_hash = password_hash($this->password, PASSWORD_BCRYPT);

        // Vincular valores
        $stmt->bindParam(":nombre", $this->nombre);
        $stmt->bindParam(":apellido", $this->apellido);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":password", $password_hash);
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

    public function actualizar() {
        $query = "UPDATE " . $this->table_name . "
                SET nombre = :nombre,
                    apellido = :apellido,
                    email = :email,
                    telefono = :telefono,
                    direccion = :direccion
                WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Sanitizar
        $this->nombre = htmlspecialchars(strip_tags($this->nombre));
        $this->apellido = htmlspecialchars(strip_tags($this->apellido));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->telefono = htmlspecialchars(strip_tags($this->telefono));
        $this->direccion = htmlspecialchars(strip_tags($this->direccion));

        // Vincular valores
        $stmt->bindParam(":nombre", $this->nombre);
        $stmt->bindParam(":apellido", $this->apellido);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":telefono", $this->telefono);
        $stmt->bindParam(":direccion", $this->direccion);
        $stmt->bindParam(":id", $this->id);

        return $stmt->execute();
    }

    public function cambiarPassword($password_actual) {
        // Verificar la contraseña actual
        $query = "SELECT password FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $this->id);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!password_verify($password_actual, $row['password'])) {
                throw new Exception("La contraseña actual es incorrecta");
            }
        } else {
            throw new Exception("Usuario no encontrado");
        }

        // Actualizar la contraseña
        $query = "UPDATE " . $this->table_name . "
                SET password = :password
                WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        
        // Hash de la nueva contraseña
        $password_hash = password_hash($this->password, PASSWORD_BCRYPT);
        
        $stmt->bindParam(":password", $password_hash);
        $stmt->bindParam(":id", $this->id);

        return $stmt->execute();
    }

    public function obtenerDirecciones() {
        $query = "SELECT * FROM direcciones WHERE usuario_id = :usuario_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":usuario_id", $this->id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function agregarDireccion($direccion) {
        $query = "INSERT INTO direcciones 
                (usuario_id, direccion, referencia)
                VALUES (:usuario_id, :direccion, :referencia)";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(":usuario_id", $this->id);
        $stmt->bindParam(":direccion", $direccion['direccion']);
        $stmt->bindParam(":referencia", $direccion['referencia']);
        
        return $stmt->execute();
    }
}
?> 