<?php
header("Access-Control-Allow-Origin: https://gentle-arithmetic-98eb61.netlify.app");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'database.php';
require_once 'usuario.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    if(isset($_GET['id'])) {
        $query = "SELECT id, nombre, apellido, email, telefono, direccion 
                 FROM usuarios 
                 WHERE id = :id 
                 LIMIT 1";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $_GET['id']);
        $stmt->execute();
        
        if($stmt->rowCount() > 0) {
            $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
            http_response_code(200);
            echo json_encode(array(
                "status" => "success",
                "usuario" => $usuario
            ));
        } else {
            http_response_code(404);
            echo json_encode(array("status" => "error", "message" => "Usuario no encontrado."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("status" => "error", "message" => "ID no proporcionado."));
    }
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(array("status" => "error", "message" => $e->getMessage()));
}
?> 