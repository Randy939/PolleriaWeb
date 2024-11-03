<?php
header('Access-Control-Allow-Origin: https://gentle-arithmetic-98eb61.netlify.app');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Accept, Content-Type');

// Manejar preflight CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    // Obtener y decodificar el JSON recibido
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data) {
        throw new Exception("Datos inválidos");
    }

    $database = new Database();
    $conn = $database->getConnection();
    
    if (!$conn) {
        throw new Exception("Error de conexión a la base de datos");
    }

    // Tu lógica de login aquí
    // ...

    // Respuesta exitosa
    echo json_encode([
        "status" => "success",
        "message" => "Login exitoso",
        "data" => [
            "email" => $data['email']
            // Otros datos del usuario...
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?> 