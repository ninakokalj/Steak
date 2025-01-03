using web.Models;
using System;
using System.Linq;
using Microsoft.AspNetCore.Identity;

namespace web.Data
{
    public static class DbInitializer
    {
        public static void Initialize(SteakContext context)
        {
            context.Database.EnsureCreated();


            // Nastivi Role "Administrator" in ga daj v bazo
            var roles = new IdentityRole[] {
                new IdentityRole{Id="1", Name="Administrator"}
            };

            foreach (IdentityRole r in roles)
            {
                context.Roles.Add(r);
            }
            //

            // Ustvari uporabnika Tomas Kostanjevec
            var user = new ApplicationUser
            {
                FirstName = "Tomas",
                LastName = "Kostanjevec",
                City = "Ljubljana",
                Email = "tomas.kostanjevec@gmail.com",
                NormalizedEmail = "XXXX@EXAMPLE.come",
                UserName = "tomas.kostanjevec@gmail.com",
                NormalizedUserName = "tomas.kostanjevec@gmail.com",
                PhoneNumber = "070 771 966",
                EmailConfirmed = true,
                PhoneNumberConfirmed = true,
                SecurityStamp = Guid.NewGuid().ToString("D")
            };
            

            if (!context.Users.Any(u => u.UserName == user.UserName))
            {
                // Hashiraj geslo
                var passwordHasher = new PasswordHasher<ApplicationUser>();
                var hashedPassword = passwordHasher.HashPassword(user, "Tomas2002.");
                user.PasswordHash = hashedPassword;

                // Preveri, če je hashiranje delovalo pravilno
                var verificationResult = passwordHasher.VerifyHashedPassword(user, hashedPassword, "Tomas2002.");
                if (verificationResult == PasswordVerificationResult.Success)
                {
                    Console.WriteLine("Geslo je pravilno hashirano.");
                }
                else
                {
                    Console.WriteLine("Geslo ni pravilno.");
                }

                context.Users.Add(user);
            }
            context.SaveChanges();

            var UserRoles = new IdentityUserRole<string>[]
            {
                new IdentityUserRole<string>{RoleId = roles[0].Id, UserId=user.Id}
            };

            foreach (IdentityUserRole<string> r in UserRoles)
            {
                context.UserRoles.Add(r);
            }
            context.SaveChanges();
            //


            // Dodaj igralca "Tomkke"
            if (!context.Players.Any(p => p.Email == "tomas.kostanjevec@gmail.com"))
            {
                var passwordHasher = new PasswordHasher<Player>();

                var player = new Player
                {
                    Username = "Tomkke",
                    Email = "tomas.kostanjevec@gmail.com",
                    Password = passwordHasher.HashPassword(null, "Tomas2002."), // Hashirano geslo
                    Balance = 20000 // Privzeta začetna bilanca
                };

                context.Players.Add(player);
                context.SaveChanges();
            }
            

            // Dodaj igre
            if (context.Games.Any()) {
                return ;
            }

            var game = new Game[]
            {
                new Game{Game_name="Classic Slot", Game_description="Experience the timeless charm of slot machines."},
                new Game{Game_name="Higher or Lower", Game_description="Test your intuition in this thrilling card game."},
                new Game{Game_name="Chicken Cross", Game_description="A fun and unique game full of surprises."},
                new Game{Game_name="Doors", Game_description="Take your chances and pick the right door to win big."},
                new Game{Game_name="Plinko", Game_description="Drop the puck and watch it bounce its way to victory."},
                new Game{Game_name="Mines", Game_description="Strategize and uncover hidden treasures while avoiding the mines."},
            };

            foreach (Game k in game)
            {
                context.Games.Add(k);
            }
            context.SaveChanges();

        }
    }
}
