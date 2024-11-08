<?php
header('Access-Control-Allow-Origin: https://gentle-arithmetic-98eb61.netlify.app');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar la solicitud OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('HTTP/1.1 200 OK');
    exit();
}

include_once '../config/database.php';
include_once '../Models/Usuario.php';

$database = new Database();
$db = $database->getConnection();
$usuario = new Usuario($db);

// Obtener los datos enviados
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validar datos requeridos
    if(
        !empty($_POST['nombre']) &&
        !empty($_POST['apellido']) &&
        !empty($_POST['email']) &&
        !empty($_POST['password'])
    ) {
        // Asignar valores
        $usuario->nombre = htmlspecialchars(strip_tags($_POST['nombre']));
        $usuario->apellido = htmlspecialchars(strip_tags($_POST['apellido']));
        $usuario->email = htmlspecialchars(strip_tags($_POST['email']));
        
        // Guardar la contraseña sin hashear para el login posterior
        $password_original = $_POST['password'];
        // Hashear la contraseña para el almacenamiento
        $usuario->password = password_hash($password_original, PASSWORD_DEFAULT);
        
        $usuario->direccion = !empty($_POST['direccion']) ? htmlspecialchars(strip_tags($_POST['direccion'])) : "";
        $usuario->telefono = !empty($_POST['telefono']) ? htmlspecialchars(strip_tags($_POST['telefono'])) : "";

        try {
            if($usuario->crear()) {
                // Intentar hacer login inmediatamente
                $query = "SELECT id, nombre, email, password FROM usuarios WHERE email = :email LIMIT 1";
                $stmt = $db->prepare($query);
                $stmt->bindParam(":email", $usuario->email);
                $stmt->execute();
                
                if($stmt->rowCount() > 0) {
                    $user = $stmt->fetch(PDO::FETCH_ASSOC);
                    if (password_verify($password_original, $user['password'])) {
                        echo json_encode(array(
                            "status" => "success",
                            "message" => "Usuario creado exitosamente",
                            "data" => array(
                                "id" => $user['id'],
                                "nombre" => $user['nombre'],
                                "email" => $user['email']
                            )
                        ));
                    } else {
                        throw new Exception("Error en la verificación de la contraseña");
                    }
                } else {
                    throw new Exception("Error al recuperar el usuario creado");
                }
            } else {
                throw new Exception("No se pudo crear el usuario");
            }
        } catch(Exception $e) {
            error_log("Error en registro.php: " . $e->getMessage());
            echo json_encode(array(
                "status" => "error",
                "message" => $e->getMessage()
            ));
        }
    } else {
        echo json_encode(array(
            "status" => "error",
            "message" => "No se pueden dejar campos vacíos"
        ));
    }
} else {
    echo json_encode(array(
        "status" => "error",
        "message" => "Método no permitido"
    ));
}
?> 