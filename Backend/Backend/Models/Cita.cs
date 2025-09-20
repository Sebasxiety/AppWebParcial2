using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Cita
    {
        [Key]
        public int cita_id { get; set; }

        public int paciente_id { get; set; }
        [ForeignKey("paciente_id")]
        public Paciente? Paciente { get; set; }

        public int doctor_id { get; set; }
        [ForeignKey("doctor_id")]
        public Doctor? Doctor { get; set; }

        public DateTime fecha_hora_cita { get; set; }
        public string? motivo_consulta { get; set; }
        public string? estado { get; set; } // e.g., "Programada", "Cancelada", "Completada"
    }
}
