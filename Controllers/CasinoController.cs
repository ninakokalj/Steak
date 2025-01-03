using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using web.Data;
using web.Models;

namespace web.Controllers
{
    public class CasinoController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SteakContext _context;

        public CasinoController(UserManager<ApplicationUser> userManager, SteakContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        public IActionResult Index()
        {
            // Pridobi trenutno prijavljenega uporabnika
            var userId = _userManager.GetUserId(User); // Pridobi UserId (GUID)
            var user = _userManager.FindByIdAsync(userId).Result; // Poišči ApplicationUser po ID

            if (user == null)
            {
                Console.WriteLine("User not found in Identity!");
                return NotFound("User not found.");
            }

            // Pridobi Email iz ApplicationUser
            var userEmail = user.Email;
            Console.WriteLine($"User Email: {userEmail}");

            // Poišči igralca po Email-u
            var player = _context.Players.FirstOrDefault(p => p.Email == userEmail);

            if (player != null)
            {
                //Console.WriteLine($"Player found: {player.Username}, Balance: {player.Balance}");
                ViewBag.Balance = player.Balance; // Nastavi Balance za ViewBag
            }
            else
            {
                //Console.WriteLine("Player not found in Players table!");
                ViewBag.Balance = "N/A"; // Če igralca ni v bazi
            }

            return View();
        }



        [HttpPost]
        public IActionResult Loan()
        {
            // Pridobi trenutno prijavljenega uporabnika
            var userId = _userManager.GetUserId(User); // Pridobi UserId (GUID)
            var user = _userManager.FindByIdAsync(userId).Result; // Poišči ApplicationUser po ID

            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Poišči igralca po Email-u
            var player = _context.Players.FirstOrDefault(p => p.Email == user.Email);

            if (player != null)
            {
                if (player.Balance < 1)
                {
                    player.Balance += 1000; // Dodaj 1000 k trenutnemu stanju
                    _context.SaveChanges(); // Shrani spremembe v bazo
                    return Ok(new { newBalance = player.Balance });
                }
                return BadRequest("Player has sufficient balance.");
            }

            return NotFound("Player not found in database.");
        }




    }
}