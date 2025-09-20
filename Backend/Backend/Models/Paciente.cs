using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Paciente
    {
        [Key]
        public int paciente_id { get; set; }
        public string? nombre { get; set; }
        public string? apellido { get; set; }
        public DateTime fecha_nacimiento { get; set; }
        public string? telefono { get; set; }
    }
}
