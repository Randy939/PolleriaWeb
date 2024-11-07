<?php
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