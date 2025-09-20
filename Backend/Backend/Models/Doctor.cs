using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Doctor
    {
        [Key]
        public int doctor_id { get; set; }

        public int usuario_id { get; set; }
        [ForeignKey("usuario_id")]
        public Usuario? Usuario { get; set; }

        public string? nombre { get; set; }
        public string? apellido { get; set; }
        public string? especialidad { get; set; }
        public string? telefono { get; set; }
    }
}
