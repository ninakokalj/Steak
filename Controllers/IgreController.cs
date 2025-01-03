using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using web.Data;
using web.Models;

namespace web.Controllers
{
    public class IgreController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SteakContext _context;

        public IgreController(UserManager<ApplicationUser> userManager, SteakContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        [HttpGet]
        public IActionResult Mines()
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
                //Console.WriteLine($"Player found: {player.Username}, ID_player: {player.ID_player}");
                ViewBag.Balance = player.Balance; // Nastavi Balance za ViewBag
                ViewBag.Username = player.Username; // Nastavi Username za ViewBag
                ViewBag.PlayerId = player.ID_player; // Nastavi PlayerId za ViewBag
            }
            else
            {
                Console.WriteLine("Player not found in Players table!");
                ViewBag.Balance = "N/A"; // Če igralca ni v bazi
                ViewBag.Username = "Unknown"; // Privzeto ime, če igralec ni v bazi
                ViewBag.PlayerId = -1; // Uporabi -1 kot privzeti ID, če igralec ni v bazi
            }

            return View("~/Views/Igre/Mines/Index.cshtml");
        }

        [HttpPost]
        [Route("Igre/InsertGameState")]
        public async Task<IActionResult> InsertGameState([FromBody] GameState gameState)
        {
            if (gameState == null)
            {
                return BadRequest("Invalid data.");
            }

            try
            {
                // Preveri, če zapis za isto igro in igralca že obstaja
                var existingGameState = _context.GameStates
                    .FirstOrDefault(gs => gs.ID_player == gameState.ID_player && gs.ID_game == gameState.ID_game);

                if (existingGameState != null)
                {
                    // Posodobi obstoječi zapis
                    existingGameState.TotalWins = (existingGameState.TotalWins ?? 0) + (gameState.TotalWins ?? 0);
                    existingGameState.TotalLosses = (existingGameState.TotalLosses ?? 0) + (gameState.TotalLosses ?? 0);
                    existingGameState.TotalProfitLoss = existingGameState.TotalWins - existingGameState.TotalLosses;

                    _context.GameStates.Update(existingGameState);
                }
                else
                {
                    // Ustvari nov zapis
                    gameState.TotalProfitLoss = (gameState.TotalWins ?? 0) - (gameState.TotalLosses ?? 0);
                    _context.GameStates.Add(gameState);
                }

                // Shrani spremembe v bazo
                await _context.SaveChangesAsync();

                return Ok(new { message = "GameState processed successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }



        public class UpdateBalanceRequest
        {
            public int IdPlayer { get; set; }
            public decimal SessionProfit { get; set; }
        }
        
        [HttpPost]
        [Route("Igre/PosodobiBalance")]
        public async Task<IActionResult> PosodobiBalance([FromBody] UpdateBalanceRequest request)
        {
            try
            {
                // Poišči igralca na podlagi ID
                var player = _context.Players.FirstOrDefault(p => p.ID_player == request.IdPlayer);

                if (player == null)
                {
                    return NotFound(new { message = "Player not found." });
                }

                // Posodobi Balance
                player.Balance = (player.Balance ?? 0) + request.SessionProfit;

                // Shrani spremembe v bazo
                _context.Players.Update(player);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Balance updated successfully.", newBalance = player.Balance });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }


        


        [HttpGet]
        public IActionResult Plinko()
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
                //Console.WriteLine($"Player found: {player.Username}, ID_player: {player.ID_player}");
                ViewBag.Balance = player.Balance; // Nastavi Balance za ViewBag
                ViewBag.Username = player.Username; // Nastavi Username za ViewBag
                ViewBag.PlayerId = player.ID_player; // Nastavi PlayerId za ViewBag
            }
            else
            {
                Console.WriteLine("Player not found in Players table!");
                ViewBag.Balance = "N/A"; // Če igralca ni v bazi
                ViewBag.Username = "Unknown"; // Privzeto ime, če igralec ni v bazi
                ViewBag.PlayerId = -1; // Uporabi -1 kot privzeti ID, če igralec ni v bazi
            }

            return View("~/Views/Igre/Plinko/Index.cshtml");
        }

        [HttpGet]
        public IActionResult Doors()
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
                //Console.WriteLine($"Player found: {player.Username}, ID_player: {player.ID_player}");
                ViewBag.Balance = player.Balance; // Nastavi Balance za ViewBag
                ViewBag.Username = player.Username; // Nastavi Username za ViewBag
                ViewBag.PlayerId = player.ID_player; // Nastavi PlayerId za ViewBag
            }
            else
            {
                Console.WriteLine("Player not found in Players table!");
                ViewBag.Balance = "N/A"; // Če igralca ni v bazi
                ViewBag.Username = "Unknown"; // Privzeto ime, če igralec ni v bazi
                ViewBag.PlayerId = -1; // Uporabi -1 kot privzeti ID, če igralec ni v bazi
            }

            return View("~/Views/Igre/Doors/Index.cshtml");
        }

        [HttpGet]
        public IActionResult Slot()
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
                //Console.WriteLine($"Player found: {player.Username}, ID_player: {player.ID_player}");
                ViewBag.Balance = player.Balance; // Nastavi Balance za ViewBag
                ViewBag.Username = player.Username; // Nastavi Username za ViewBag
                ViewBag.PlayerId = player.ID_player; // Nastavi PlayerId za ViewBag
            }
            else
            {
                Console.WriteLine("Player not found in Players table!");
                ViewBag.Balance = "N/A"; // Če igralca ni v bazi
                ViewBag.Username = "Unknown"; // Privzeto ime, če igralec ni v bazi
                ViewBag.PlayerId = -1; // Uporabi -1 kot privzeti ID, če igralec ni v bazi
            }

            return View("~/Views/Igre/Slot/Index.cshtml");
        }

        [HttpGet]
        public IActionResult HigherLower()
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
                //Console.WriteLine($"Player found: {player.Username}, ID_player: {player.ID_player}");
                ViewBag.Balance = player.Balance; // Nastavi Balance za ViewBag
                ViewBag.Username = player.Username; // Nastavi Username za ViewBag
                ViewBag.PlayerId = player.ID_player; // Nastavi PlayerId za ViewBag
            }
            else
            {
                Console.WriteLine("Player not found in Players table!");
                ViewBag.Balance = "N/A"; // Če igralca ni v bazi
                ViewBag.Username = "Unknown"; // Privzeto ime, če igralec ni v bazi
                ViewBag.PlayerId = -1; // Uporabi -1 kot privzeti ID, če igralec ni v bazi
            }

            return View("~/Views/Igre/HigherLower/Index.cshtml");
        }

        [HttpGet]
        public IActionResult ChickenCross()
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
                //Console.WriteLine($"Player found: {player.Username}, ID_player: {player.ID_player}");
                ViewBag.Balance = player.Balance; // Nastavi Balance za ViewBag
                ViewBag.Username = player.Username; // Nastavi Username za ViewBag
                ViewBag.PlayerId = player.ID_player; // Nastavi PlayerId za ViewBag
            }
            else
            {
                Console.WriteLine("Player not found in Players table!");
                ViewBag.Balance = "N/A"; // Če igralca ni v bazi
                ViewBag.Username = "Unknown"; // Privzeto ime, če igralec ni v bazi
                ViewBag.PlayerId = -1; // Uporabi -1 kot privzeti ID, če igralec ni v bazi
            }

            return View("~/Views/Igre/ChickenCross/Index.cshtml");
        }







    }
}
