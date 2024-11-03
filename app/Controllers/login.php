<?php
// Habilitar el logging de errores
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../../logs/error.log');
error_log("=== Inicio de solicitud de login ===");

// Headers CORS
header('Access-Control-Allow-Origin: https://gentle-arithmetic-98eb61.netlify.app');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // Log de datos recibidos
    $rawInput = file_get_contents("php://input");
    error_log("Datos recibidos: " . $rawInput);
    
    $data = json_decode($rawInput, true);
    if (!$data) {
        throw new Exception("Error decodificando JSON: " . json_last_error_msg());
    }
    
    if (!isset($data['email']) || !isset($data['password'])) {
        throw new Exception("Datos de login incompletos");
    }

    // Verificar la ruta del archivo database.php
    $databasePath = __DIR__ . '/../config/database.php';
    error_log("Ruta a database.php: " . $databasePath);
    
    if (!file_exists($databasePath)) {
        throw new Exception("No se encuentra el archivo database.php en: " . $databasePath);
    }

    require_once $databasePath;
    $database = new Database();
    error_log("Clase Database cargada");

    // Obtener conexión
    $db = $database->getConnection();
    if (!$db) {
        throw new Exception("No se pudo establecer la conexión con la base de datos");
    }
    error_log("Conexión a base de datos establecida");

    // Verificar tabla login_attempts
    try {
        $checkTable = $db->query("SHOW TABLES LIKE 'login_attempts'");
        if ($checkTable->rowCount() == 0) {
            $sql = "CREATE TABLE IF NOT EXISTS login_attempts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL,
                ip_address VARCHAR(45) NOT NULL,
                attempt_time DATETIME NOT NULL,
                is_blocked TINYINT(1) DEFAULT 0
            )";
            $db->exec($sql);
            error_log("Tabla login_attempts creada");
        }
    } catch (PDOException $e) {
        error_log("Error verificando tabla login_attempts: " . $e->getMessage());
    }

    // Obtener IP del cliente
    $ip_address = $_SERVER['REMOTE_ADDR'];
    error_log("IP del cliente: " . $ip_address);

    // Verificar intentos previos
    $attempts = $database->getLoginAttempts($data['email'], $ip_address, 30);
    error_log("Intentos previos: " . print_r($attempts, true));

    // Resto del código de login...

} catch (Exception $e) {
    error_log("Error en login.php: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
    
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Error del servidor: " . $e->getMessage(),
        "debug" => [
            "file" => $e->getFile(),
            "line" => $e->getLine()
        ]
    ]);
    exit;
}
?> 