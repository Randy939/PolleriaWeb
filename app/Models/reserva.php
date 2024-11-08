<?php
class Reserva {
    private $conn;
    private $table_name = "reservas";

    public $id;
    public $usuario_id;
    public $fecha_reserva;
    public $hora_reserva;
    public $num_personas;
    public $ocasion;
    public $comentarios;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function crear() {
        try {
            $query = "INSERT INTO " . $this->table_name . "
                    (usuario_id, fecha_reserva, hora_reserva, num_personas, ocasion, comentarios)
                    VALUES
                    (:usuario_id, :fecha_reserva, :hora_reserva, :num_personas, :ocasion, :comentarios)";

            $stmt = $this->conn->prepare($query);

            // Sanitizar datos
            $this->sanitizarDatos();

            // Vincular valores
            $stmt->bindParam(":usuario_id", $this->usuario_id);
            $stmt->bindParam(":fecha_reserva", $this->fecha_reserva);
            $stmt->bindParam(":hora_reserva", $this->hora_reserva);
            $stmt->bindParam(":num_personas", $this->num_personas);
            $stmt->bindParam(":ocasion", $this->ocasion);
            $stmt->bindParam(":comentarios", $this->comentarios);

            if($stmt->execute()) {
                return true;
            }
            return false;
        } catch(PDOException $e) {
            throw new Exception("Error al crear reserva: " . $e->getMessage());
        }
    }

    private function sanitizarDatos() {
        $this->usuario_id = htmlspecialchars(strip_tags($this->usuario_id));
        $this->fecha_reserva = htmlspecialchars(strip_tags($this->fecha_reserva));
        $this->hora_reserva = htmlspecialchars(strip_tags($this->hora_reserva));
        $this->num_personas = htmlspecialchars(strip_tags($this->num_personas));
        $this->ocasion = htmlspecialchars(strip_tags($this->ocasion));
        $this->comentarios = htmlspecialchars(strip_tags($this->comentarios));
    }
}
?> 