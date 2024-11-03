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

    public $max_attempts = 3; // Máximo número de intentos
    private $lockout_time = 900; // Tiempo de bloqueo en segundos (15 minutos)

    public function __construct($db) {
        $this->conn = $db;
    }

    public function crear() {
        // Verificar si el email ya existe
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

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    private function emailExiste() {
        $query = "SELECT id FROM " . $this->table_name . " WHERE email = :email LIMIT 1";
        $stmt = $this->conn->prepare($query);
        
        $this->email = htmlspecialchars(strip_tags($this->email));
        $stmt->bindParam(":email", $this->email);
        
        $stmt->execute();
        
        return $stmt->rowCount() > 0;
    }

    private function checkLoginAttempts($email, $ip) {
        try {
            // Limpiar intentos antiguos (más de 24 horas)
            $query = "DELETE FROM login_attempts WHERE last_attempt < DATE_SUB(NOW(), INTERVAL 24 HOUR)";
            $this->conn->exec($query);

            // Verificar si existe un bloqueo activo
            $query = "SELECT attempts, locked_until FROM login_attempts 
                     WHERE email = ? AND ip_address = ?";
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$email, $ip]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($result) {
                if ($result['locked_until'] !== null) {
                    // Calcular tiempo restante de bloqueo
                    $now = new DateTime();
                    $lockUntil = new DateTime($result['locked_until']);
                    if ($lockUntil > $now) {
                        $timeLeft = $now->diff($lockUntil);
                        throw new Exception("Cuenta bloqueada. Intente nuevamente en " . 
                            $timeLeft->format('%i minutos %s segundos'));
                    } else {
                        // Si el bloqueo expiró, eliminar el registro
                        $query = "DELETE FROM login_attempts WHERE email = ? AND ip_address = ?";
                        $stmt = $this->conn->prepare($query);
                        $stmt->execute([$email, $ip]);
                    }
                }
                
                if ($result['attempts'] >= $this->max_attempts) {
                    // Bloquear la cuenta
                    $query = "UPDATE login_attempts SET 
                             locked_until = DATE_ADD(NOW(), INTERVAL ? SECOND),
                             last_attempt = NOW()
                             WHERE email = ? AND ip_address = ?";
                    $stmt = $this->conn->prepare($query);
                    $stmt->execute([$this->lockout_time, $email, $ip]);
                    
                    throw new Exception("Demasiados intentos fallidos. Cuenta bloqueada por 15 minutos.");
                }
            }
        } catch (PDOException $e) {
            throw new Exception("Error al verificar intentos de login: " . $e->getMessage());
        }
    }

    private function updateLoginAttempts($email, $ip, $success = false) {
        try {
            if ($success) {
                // Si el login fue exitoso, eliminar los intentos
                $query = "DELETE FROM login_attempts WHERE email = ? AND ip_address = ?";
                $stmt = $this->conn->prepare($query);
                $stmt->execute([$email, $ip]);
            } else {
                // Incrementar contador de intentos
                $query = "INSERT INTO login_attempts (email, ip_address) 
                         VALUES (?, ?) 
                         ON DUPLICATE KEY UPDATE 
                         attempts = attempts + 1,
                         last_attempt = CURRENT_TIMESTAMP";
                $stmt = $this->conn->prepare($query);
                $stmt->execute([$email, $ip]);
            }
        } catch (PDOException $e) {
            throw new Exception("Error al actualizar intentos de login: " . $e->getMessage());
        }
    }

    public function login() {
        if (!$this->conn) {
            throw new Exception("No hay conexión a la base de datos");
        }

        try {
            $ip = $_SERVER['REMOTE_ADDR'];
            
            // Verificar intentos de login
            $this->checkLoginAttempts($this->email, $ip);

            $query = "SELECT id, nombre, password FROM " . $this->table_name . " 
                     WHERE email = ? LIMIT 0,1";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(1, $this->email);
            $stmt->execute();

            if($stmt->rowCount() > 0) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                if(password_verify($this->password, $row['password'])) {
                    // Login exitoso, limpiar intentos
                    $this->updateLoginAttempts($this->email, $ip, true);
                    return array(
                        'id' => $row['id'],
                        'nombre' => $row['nombre']
                    );
                }
            }
            
            // Login fallido, registrar intento
            $this->updateLoginAttempts($this->email, $ip, false);
            return false;
            
        } catch(PDOException $e) {
            throw new Exception("Error en la consulta de login: " . $e->getMessage());
        }
    }

    public function getRemainingAttempts($email) {
        try {
            $ip = $_SERVER['REMOTE_ADDR'];
            
            // Verificar si la cuenta está bloqueada
            $query = "SELECT attempts, locked_until FROM login_attempts 
                     WHERE email = ? AND ip_address = ?";
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$email, $ip]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($result && $result['locked_until'] !== null) {
                $now = new DateTime();
                $lockUntil = new DateTime($result['locked_until']);
                if ($lockUntil > $now) {
                    $timeLeft = $now->diff($lockUntil);
                    throw new Exception("Cuenta bloqueada. Intente nuevamente en " . 
                        $timeLeft->format('%i minutos %s segundos'));
                }
            }
            
            return $this->max_attempts - ($result ? $result['attempts'] : 0);
        } catch (PDOException $e) {
            throw new Exception("Error al obtener intentos restantes: " . $e->getMessage());
        }
    }
}
?> 