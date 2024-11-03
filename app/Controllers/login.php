<?php
// Reportar todos los errores como JSON en lugar de HTML
error_reporting(E_ALL);
ini_set('display_errors', 0);

function handleError($errno, $errstr, $errfile, $errline) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Error del servidor: " . $errstr
    ]);
    exit;
}
set_error_handler("handleError");

// Manejar errores fatales
register_shutdown_function(function() {
    $error = error_get_last();
    if ($error !== NULL && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => "Error fatal del servidor: " . $error['message']
        ]);
    }
});

// Configuración de sesión y headers CORS (mantener esta parte)
ini_set('session.cookie_samesite', 'None');
ini_set('session.cookie_secure', 'true');
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'domain' => '.qtempurl.com',
    'secure' => true,
    'httponly' => true,
    'samesite' => 'None'
]);
session_start();

header('Access-Control-Allow-Origin: https://gentle-arithmetic-98eb61.netlify.app');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Accept, Content-Type, Authorization');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Al inicio del archivo, después de las configuraciones de error
error_log("Iniciando proceso de login");

try {
    // Verificar datos POST
    $rawInput = file_get_contents("php://input");
    error_log("Datos recibidos: " . $rawInput);
    
    $data = json_decode($rawInput, true);
    if (!$data || !isset($data['email']) || !isset($data['password'])) {
        throw new Exception("Datos de login incompletos");
    }

    require_once '../config/database.php';
    $database = new Database();
    
    // Obtener IP del cliente
    $ip_address = $_SERVER['REMOTE_ADDR'];
    error_log("IP del cliente: " . $ip_address);
    
    // Establecer conexión
    $db = $database->getConnection();
    if (!$db) {
        throw new Exception("No se pudo establecer la conexión con la base de datos");
    }
    
    // Verificar intentos previos
    $attempts = $database->getLoginAttempts($data['email'], $ip_address, 30);
    error_log("Intentos previos: " . print_r($attempts, true));
    
    // Verificar si está bloqueado
    if ($attempts['is_blocked'] == 1) {
        throw new Exception("Tu cuenta está temporalmente bloqueada. Por favor, intenta más tarde.");
    }
    
    // Verificar número de intentos
    if ($attempts['attempts'] >= 5) { // 5 intentos máximos
        // Registrar bloqueo
        $database->registerLoginAttempt($data['email'], $ip_address, 1);
        throw new Exception("Demasiados intentos fallidos. Tu cuenta ha sido bloqueada por 30 minutos.");
    }

    // Intentar login
    $stmt = $db->prepare("SELECT * FROM usuarios WHERE email = :email");
    $stmt->bindParam(":email", $data['email']);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($data['password'], $user['password'])) {
        // Login exitoso
        echo json_encode([
            "status" => "success",
            "message" => "Login exitoso",
            "data" => $user
        ]);
    } else {
        // Registrar intento fallido
        $database->registerLoginAttempt($data['email'], $ip_address);
        
        $remainingAttempts = 5 - ($attempts['attempts'] + 1);
        http_response_code(401);
        echo json_encode([
            "status" => "error",
            "message" => "Credenciales inválidas. Te quedan {$remainingAttempts} intentos."
        ]);
    }

} catch (Exception $e) {
    error_log("Error en login.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?> 