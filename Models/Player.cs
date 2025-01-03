using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;

namespace web.Models
{
    public class Player
    {
        [Key]
        public int ID_player { get; set; }

        [Required]
        public required string Username { get; set; }

        [Required]
        public required string Email { get; set; }

        [Required]
        public required string Password { get; set; }

        // Neobvezen atribut za valuto
        public decimal? Balance { get; set; }

        // Relacija: en uporabnik ima več statističnih zapisov
        public ICollection<GameState> GameStates { get; set; }

        public Player()
        {
            GameStates = new HashSet<GameState>();
        }
    }
}


