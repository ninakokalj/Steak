using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;

namespace web.Models
{
    public class GameState
{
    [Key]
    public int ID_stats { get; set; }


   public decimal? TotalWins { get; set; } = 0;

    public decimal? TotalLosses { get; set; } = 0;

    public decimal? TotalProfitLoss { get; set; } = 0;

    // Tuje ključe za povezavo z Player in Game
    public int ID_player { get; set; }
    public int ID_game { get; set; }

    // Navigacijske lastnosti za relacije
    public Player? Player { get; set; }
    public Game? Game { get; set; }

    public GameState()
    {
        TotalWins = 0;
        TotalLosses = 0;
        TotalProfitLoss = 0;
    }
}

}
