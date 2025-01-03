using Microsoft.AspNetCore.Mvc;
using System.Linq;
using web.Data;
using web.Models;

namespace web.Controllers
{
    public class LeaderboardController : Controller
    {
        private readonly SteakContext _context;

        public LeaderboardController(SteakContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Index()
        {
            // Pridobivanje igralcev in razvrščanje po Balance (padajoče)
            var players = _context.Players
                .OrderByDescending(p => p.Balance ?? 0) // Če Balance ni nastavljen, se uporabi 0
                .ToList();

            return View(players);
        }
    }
}
