<?php
require_once 'database.php';
require_once 'usuario.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    $usuario = new Usuario($db);
    $usuario->id = $data->id;
    $usuario->password = $data->password_nueva;

    try {
        if ($usuario->cambiarPassword()) {
            echo json_encode(['status' => 'success', 'message' => 'Contraseña actualizada correctamente']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'No se pudo cambiar la contraseña']);
        }
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
}
?> 