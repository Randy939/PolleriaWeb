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
        if (!isset($_SESSION['login_attempts'])) {
            $_SESSION['login_attempts'] = [
                'count' => 0,
                'locked_until' => null
            ];
        }

        // Verificar si está bloqueado
        if ($_SESSION['login_attempts']['locked_until'] !== null) {
            $now = time();
            if ($now < $_SESSION['login_attempts']['locked_until']) {
                $timeLeft = $_SESSION['login_attempts']['locked_until'] - $now;
                $minutes = floor($timeLeft / 60);
                $seconds = $timeLeft % 60;
                throw new Exception("Cuenta bloqueada. Intente nuevamente en {$minutes}m {$seconds}s");
            } else {
                // Si el bloqueo expiró, reiniciar intentos
                $_SESSION['login_attempts'] = [
                    'count' => 0,
                    'locked_until' => null
                ];
            }
        }

        // Verificar número de intentos
        if ($_SESSION['login_attempts']['count'] >= $this->max_attempts) {
            $_SESSION['login_attempts']['locked_until'] = time() + $this->lockout_time;
            throw new Exception("Demasiados intentos fallidos. Cuenta bloqueada por 15 minutos.");
        }
    }

    private function updateLoginAttempts($email, $ip, $success = false) {
        if ($success) {
            // Reiniciar intentos si el login fue exitoso
            $_SESSION['login_attempts'] = [
                'count' => 0,
                'locked_until' => null
            ];
        } else {
            // Incrementar contador de intentos
            if (!isset($_SESSION['login_attempts'])) {
                $_SESSION['login_attempts'] = [
                    'count' => 0,
                    'locked_until' => null
                ];
            }
            $_SESSION['login_attempts']['count']++;
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
        if (!isset($_SESSION['login_attempts'])) {
            return $this->max_attempts;
        }

        if ($_SESSION['login_attempts']['locked_until'] !== null) {
            $now = time();
            if ($now < $_SESSION['login_attempts']['locked_until']) {
                $timeLeft = $_SESSION['login_attempts']['locked_until'] - $now;
                $minutes = floor($timeLeft / 60);
                $seconds = $timeLeft % 60;
                throw new Exception("Cuenta bloqueada. Intente nuevamente en {$minutes}m {$seconds}s");
            }
        }

        return $this->max_attempts - $_SESSION['login_attempts']['count'];
    }
}
?> 