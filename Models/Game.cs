using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;

namespace web.Models
{
    public class Game
    {
        [Key]
        public int ID_game { get; set; }

        [Required]
        public required string Game_name { get; set; }

        [Required]
        public required string Game_description { get; set; }

        // Relacija: ena igra ima več statističnih zapisov
        public ICollection<GameState> GameStates { get; set; }

        public Game()
        {
            GameStates = new HashSet<GameState>();
        }
    }
}




