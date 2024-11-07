<?php
class Usuario {
    private $conn;
    private $table_name = "usuarios";
    private $table_direcciones = "direcciones";

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
        try {
            if($this->emailExiste()) {
                throw new Exception("Este correo electrónico ya está registrado");
            }

            $query = "INSERT INTO " . $this->table_name . "
                    (nombre, apellido, email, password, direccion, telefono)
                    VALUES
                    (:nombre, :apellido, :email, :password, :direccion, :telefono)";

            $stmt = $this->conn->prepare($query);

            // Sanitizar datos
            $this->sanitizarDatos();

            // Hash de la contraseña
            $password_hash = password_hash($this->password, PASSWORD_BCRYPT);

            // Vincular valores
            $stmt->bindParam(":nombre", $this->nombre);
            $stmt->bindParam(":apellido", $this->apellido);
            $stmt->bindParam(":email", $this->email);
            $stmt->bindParam(":password", $password_hash);
            $stmt->bindParam(":direccion", $this->direccion);
            $stmt->bindParam(":telefono", $this->telefono);

            if($stmt->execute()) {
                $this->id = $this->conn->lastInsertId();
                return true;
            }
            return false;
        } catch(PDOException $e) {
            throw new Exception("Error en el registro: " . $e->getMessage());
        }
    }

    public function login() {
        try {
            $query = "SELECT id, nombre, apellido, email, password 
                     FROM " . $this->table_name . " 
                     WHERE email = :email 
                     LIMIT 1";

            $stmt = $this->conn->prepare($query);
            
            $this->email = htmlspecialchars(strip_tags($this->email));
            $stmt->bindParam(":email", $this->email);
            $stmt->execute();

            if($stmt->rowCount() > 0) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                if(password_verify($this->password, $row['password'])) {
                    return array(
                        'id' => $row['id'],
                        'nombre' => $row['nombre'],
                        'apellido' => $row['apellido'],
                        'email' => $row['email']
                    );
                }
            }
            return false;
        } catch(PDOException $e) {
            throw new Exception("Error en el login: " . $e->getMessage());
        }
    }

    public function actualizar() {
        try {
            if($this->emailExisteOtroUsuario()) {
                throw new Exception("Este correo electrónico ya está registrado por otro usuario");
            }

            $query = "UPDATE " . $this->table_name . "
                    SET nombre = :nombre,
                        apellido = :apellido,
                        email = :email,
                        telefono = :telefono,
                        direccion = :direccion
                    WHERE id = :id";

            $stmt = $this->conn->prepare($query);

            // Sanitizar datos
            $this->sanitizarDatos();

            // Vincular valores
            $stmt->bindParam(":nombre", $this->nombre);
            $stmt->bindParam(":apellido", $this->apellido);
            $stmt->bindParam(":email", $this->email);
            $stmt->bindParam(":telefono", $this->telefono);
            $stmt->bindParam(":direccion", $this->direccion);
            $stmt->bindParam(":id", $this->id);

            return $stmt->execute();
        } catch(PDOException $e) {
            throw new Exception("Error al actualizar usuario: " . $e->getMessage());
        }
    }

    public function cambiarPassword($password_actual) {
        try {
            // Verificar contraseña actual
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

            // Actualizar contraseña
            $query = "UPDATE " . $this->table_name . "
                    SET password = :password
                    WHERE id = :id";

            $stmt = $this->conn->prepare($query);
            
            $password_hash = password_hash($this->password, PASSWORD_BCRYPT);
            
            $stmt->bindParam(":password", $password_hash);
            $stmt->bindParam(":id", $this->id);

            return $stmt->execute();
        } catch(PDOException $e) {
            throw new Exception("Error al cambiar contraseña: " . $e->getMessage());
        }
    }

    public function obtenerDirecciones() {
        try {
            $query = "SELECT id, direccion, referencia 
                     FROM " . $this->table_direcciones . " 
                     WHERE usuario_id = :usuario_id 
                     ORDER BY id DESC";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":usuario_id", $this->id);
            $stmt->execute();
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch(PDOException $e) {
            throw new Exception("Error al obtener direcciones: " . $e->getMessage());
        }
    }

    public function agregarDireccion($direccion) {
        try {
            // Verificar si el usuario existe y tiene permisos
            $query = "SELECT id FROM " . $this->table_name . " WHERE id = :id LIMIT 1";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":id", $this->id);
            $stmt->execute();
            
            if($stmt->rowCount() === 0) {
                throw new Exception("Usuario no encontrado o sin permisos");
            }

            $query = "INSERT INTO " . $this->table_direcciones . "
                    (usuario_id, direccion, referencia)
                    VALUES (:usuario_id, :direccion, :referencia)";
            
            $stmt = $this->conn->prepare($query);
            
            // Sanitizar datos
            $direccion['direccion'] = htmlspecialchars(strip_tags($direccion['direccion']));
            $direccion['referencia'] = htmlspecialchars(strip_tags($direccion['referencia']));
            
            $stmt->bindParam(":usuario_id", $this->id);
            $stmt->bindParam(":direccion", $direccion['direccion']);
            $stmt->bindParam(":referencia", $direccion['referencia']);
            
            if(!$stmt->execute()) {
                $error = $stmt->errorInfo();
                throw new Exception("Error al ejecutar la consulta: " . $error[2]);
            }
            
            return true;
        } catch(PDOException $e) {
            error_log("Error en agregarDireccion: " . $e->getMessage());
            throw new Exception("Error al agregar dirección: " . $e->getMessage());
        }
    }

    private function emailExiste() {
        $query = "SELECT id FROM " . $this->table_name . " WHERE email = :email LIMIT 1";
        $stmt = $this->conn->prepare($query);
        
        $this->email = htmlspecialchars(strip_tags($this->email));
        $stmt->bindParam(":email", $this->email);
        $stmt->execute();
        
        return $stmt->rowCount() > 0;
    }

    private function emailExisteOtroUsuario() {
        $query = "SELECT id FROM " . $this->table_name . " 
                 WHERE email = :email AND id != :id 
                 LIMIT 1";
        
        $stmt = $this->conn->prepare($query);
        
        $this->email = htmlspecialchars(strip_tags($this->email));
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":id", $this->id);
        $stmt->execute();
        
        return $stmt->rowCount() > 0;
    }

    private function sanitizarDatos() {
        $this->nombre = htmlspecialchars(strip_tags($this->nombre));
        $this->apellido = htmlspecialchars(strip_tags($this->apellido));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->direccion = htmlspecialchars(strip_tags($this->direccion));
        $this->telefono = htmlspecialchars(strip_tags($this->telefono));
    }
}
?> 