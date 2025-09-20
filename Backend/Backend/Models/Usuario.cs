using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Usuario
    {
        [Key]
        public int usuario_id { get; set; }
        public string? nombre_usuario { get; set; }
        public string? contrasena_hash { get; set; }
        public string? rol { get; set; } // "Administrador" or "Doctor"
        public bool activo { get; set; }
    }
}
