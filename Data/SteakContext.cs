using web.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace web.Data;

public class SteakContext : IdentityDbContext<ApplicationUser>
{
    public SteakContext(DbContextOptions<SteakContext> options) : base(options)
    {
    }

    public DbSet<Game> Games { get; set; }
    public DbSet<GameState> GameStates { get; set; }
    public DbSet<Player> Players { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Game>().ToTable("Game");
        modelBuilder.Entity<GameState>().ToTable("GameState");
        modelBuilder.Entity<Player>().ToTable("Player");

        // Relacije med entitetami
        modelBuilder.Entity<GameState>()
            .HasOne(gs => gs.Player)
            .WithMany(u => u.GameStates)
            .HasForeignKey(gs => gs.ID_player)
            .OnDelete(DeleteBehavior.Cascade); // Nastavi kaskadno brisanje

        modelBuilder.Entity<GameState>()
            .HasOne(gs => gs.Game)
            .WithMany(g => g.GameStates)
            .HasForeignKey(gs => gs.ID_game)
            .OnDelete(DeleteBehavior.Cascade); // Nastavi kaskadno brisanje

        modelBuilder.Entity<GameState>()
        .Property(gs => gs.TotalWins)
        .IsRequired(false);

        modelBuilder.Entity<GameState>()
            .Property(gs => gs.TotalLosses)
            .IsRequired(false);

        modelBuilder.Entity<GameState>()
            .Property(gs => gs.TotalProfitLoss)
            .IsRequired(false);
    }
}