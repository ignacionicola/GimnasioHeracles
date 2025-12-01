import React from "react";
import { Card, Button } from "react-bootstrap";

export default function BeneficioCard({ beneficio, onEdit, onToggleActive }) {
  const { idBeneficio, nombreBeneficio, descripcionBeneficio, precioPuntos, activo } = beneficio;
  return (
    <Card className="m-2" style={{ width: "18rem" }}>
      <Card.Body>
        <Card.Title>{nombreBeneficio}</Card.Title>
        <Card.Text style={{ minHeight: 60 }}>{descripcionBeneficio}</Card.Text>
        <Card.Text>
          <strong>Puntos:</strong> {precioPuntos}
        </Card.Text>
        <div className="d-flex gap-2">
          <Button variant="primary" size="sm" onClick={() => onEdit(beneficio)}>
            Editar
          </Button>
          <Button
            variant={activo ? "warning" : "success"}
            size="sm"
            onClick={() => onToggleActive(beneficio)}
          >
            {activo ? "Desactivar" : "Activar"}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

