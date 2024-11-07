<?php
header('Access-Control-Allow-Origin: https://gentle-arithmetic-98eb61.netlify.app');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'database.php';
require_once 'usuario.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    $usuario = new Usuario($db);
    $usuario->id = $data->id;
    $usuario->nombre = $data->nombre;
    $usuario->apellido = $data->apellido;
    $usuario->email = $data->email;
    $usuario->telefono = $data->telefono;
    $usuario->direccion = $data->direccion;

    try {
        if ($usuario->actualizar()) {
            echo json_encode(['status' => 'success', 'message' => 'Datos actualizados correctamente']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'No se pudo actualizar los datos']);
        }
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
}
?> 