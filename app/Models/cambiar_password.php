<?php
// Configuración de CORS más permisiva
header('Access-Control-Allow-Origin: https://gentle-arithmetic-98eb61.netlify.app');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=UTF-8');

// Manejar la solicitud OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('HTTP/1.1 200 OK');
    exit();
}

require_once '../config/database.php';
require_once 'usuario.php';

try {
    // Obtener el contenido de la solicitud
    $json = file_get_contents('php://input');
    $data = json_decode($json);

    // Verificar que los datos necesarios estén presentes
    if (!$data || !isset($data->id) || !isset($data->password_actual) || !isset($data->password_nueva)) {
        throw new Exception("Datos incompletos");
    }

    $database = new Database();
    $db = $database->getConnection();
    $usuario = new Usuario($db);
    
    $usuario->id = $data->id;
    $usuario->password = $data->password_nueva;
    
    if ($usuario->cambiarPassword($data->password_actual)) {
        echo json_encode([
            "status" => "success",
            "message" => "Contraseña actualizada correctamente"
        ]);
    } else {
        throw new Exception("No se pudo actualizar la contraseña");
    }
} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?> 