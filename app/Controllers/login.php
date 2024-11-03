<?php
header('Access-Control-Allow-Origin: https://gentle-arithmetic-98eb61.netlify.app');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Accept, Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    // Verificar si hay datos POST
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data || !isset($data['email']) || !isset($data['password'])) {
        throw new Exception("Datos de login incompletos");
    }

    // Crear conexión a la base de datos
    require_once '../config/database.php';
    require_once '../Models/usuario.php';

    $database = new Database();
    $db = $database->getConnection();

    // Crear objeto usuario
    $usuario = new Usuario($db);
    $usuario->email = $data['email'];
    $usuario->password = $data['password'];

    // Intentar login
    $resultado = $usuario->login();
    
    if ($resultado) {
        echo json_encode([
            "status" => "success",
            "message" => "Login exitoso",
            "data" => $resultado
        ]);
    } else {
        http_response_code(401);
        echo json_encode([
            "status" => "error",
            "message" => "Email o contraseña incorrectos. Intentos restantes: " . 
                        $usuario->getRemainingAttempts($data['email'])
        ]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?> 