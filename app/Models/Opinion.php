<?php
class Opinion {
    private $conn;
    private $table_name = "opiniones";

    public $id;
    public $usuario_id;
    public $producto_id;
    public $calificacion;
    public $comentario;
    public $fecha;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function crear() {
        $query = "INSERT INTO " . $this->table_name . " SET usuario_id=:usuario_id, producto_id=:producto_id, calificacion=:calificacion, comentario=:comentario, fecha=NOW()";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":usuario_id", $this->usuario_id);
        $stmt->bindParam(":producto_id", $this->producto_id);
        $stmt->bindParam(":calificacion", $this->calificacion);
        $stmt->bindParam(":comentario", $this->comentario);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }
}
?>