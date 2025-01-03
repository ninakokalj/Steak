using Microsoft.AspNetCore.Mvc;
using web.Data;
using web.Models;
using System.Linq;

namespace web.Controllers
{
    public class StatisticsController : Controller
    {
        private readonly SteakContext _context;

        public StatisticsController(SteakContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            var statistics = _context.GameStates
                .GroupBy(gs => gs.ID_game)
                .Select(g => new
                {
                    Game = _context.Games.FirstOrDefault(game => game.ID_game == g.Key),
                    TotalWins = g.Sum(gs => gs.TotalWins) ?? 0,
                    TotalLosses = g.Sum(gs => gs.TotalLosses) ?? 0,
                    TotalProfitLoss = g.Sum(gs => gs.TotalProfitLoss) ?? 0
                })
                .ToList();

            return View(statistics);
        }
    }
}
