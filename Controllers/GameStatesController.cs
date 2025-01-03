 using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using web.Data;
using web.Models;

namespace web.Controllers
{
    public class GameStatesController : Controller
    {
        private readonly SteakContext _context;

        public GameStatesController(SteakContext context)
        {
            _context = context;
        }

        // GET: GameStates
        public async Task<IActionResult> Index()
        {
            var steakContext = _context.GameStates.Include(g => g.Game).Include(g => g.Player);
            return View(await steakContext.ToListAsync());
        }

        // GET: GameStates/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var gameState = await _context.GameStates
                .Include(g => g.Game)
                .Include(g => g.Player)
                .FirstOrDefaultAsync(m => m.ID_stats == id);
            if (gameState == null)
            {
                return NotFound();
            }

            return View(gameState);
        }

        // GET: GameStates/Create
        public IActionResult Create()
        {
            ViewData["ID_game"] = new SelectList(_context.Games, "ID_game", "Game_name");
            ViewData["ID_player"] = new SelectList(_context.Players, "ID_player", "Email");
            return View();
        }

        // POST: GameStates/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ID_stats,TotalWins,TotalLosses,TotalProfitLoss,ID_player,ID_game")] GameState gameState)
        {
            if (ModelState.IsValid)
            {
                // Izračun TotalProfitLoss
                gameState.TotalProfitLoss = (gameState.TotalWins ?? 0) - (gameState.TotalLosses ?? 0);

                _context.Add(gameState);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["ID_game"] = new SelectList(_context.Games, "ID_game", "Game_name", gameState.ID_game);
            ViewData["ID_player"] = new SelectList(_context.Players, "ID_player", "Email", gameState.ID_player);
            return View(gameState);
        }

        // GET: GameStates/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var gameState = await _context.GameStates.FindAsync(id);
            if (gameState == null)
            {
                return NotFound();
            }
            ViewData["ID_game"] = new SelectList(_context.Games, "ID_game", "Game_name", gameState.ID_game);
            ViewData["ID_player"] = new SelectList(_context.Players, "ID_player", "Email", gameState.ID_player);
            return View(gameState);
        }

        // POST: GameStates/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("ID_stats,TotalWins,TotalLosses,TotalProfitLoss,ID_player,ID_game")] GameState gameState)
        {
            if (id != gameState.ID_stats)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    // Izračun TotalProfitLoss
                    gameState.TotalProfitLoss = (gameState.TotalWins ?? 0) - (gameState.TotalLosses ?? 0);

                    _context.Update(gameState);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!GameStateExists(gameState.ID_stats))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            ViewData["ID_game"] = new SelectList(_context.Games, "ID_game", "Game_name", gameState.ID_game);
            ViewData["ID_player"] = new SelectList(_context.Players, "ID_player", "Email", gameState.ID_player);
            return View(gameState);
        }

        // GET: GameStates/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var gameState = await _context.GameStates
                .Include(g => g.Game)
                .Include(g => g.Player)
                .FirstOrDefaultAsync(m => m.ID_stats == id);
            if (gameState == null)
            {
                return NotFound();
            }

            return View(gameState);
        }

        // POST: GameStates/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var gameState = await _context.GameStates.FindAsync(id);
            if (gameState != null)
            {
                _context.GameStates.Remove(gameState);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool GameStateExists(int id)
        {
            return _context.GameStates.Any(e => e.ID_stats == id);
        }
    }
}
