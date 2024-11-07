<?php
require_once 'database.php';
require_once 'usuario.php';

header('Content-Type: application/json');

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
    $usuario = new Usuario($db);
    $usuario->id = $_GET['id'];

    try {
        $query = "SELECT id, nombre, apellido, email, telefono, direccion 
                 FROM usuarios WHERE id = :id LIMIT 1";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $usuario->id);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $userData = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode([
                'status' => 'success',
                'usuario' => $userData
            ]);
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'Usuario no encontrado'
            ]);
        }
    } catch (Exception $e) {
        echo json_encode([
            'status' => 'error',
            'message' => $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Método no permitido o ID no proporcionado'
    ]);
}
?> 