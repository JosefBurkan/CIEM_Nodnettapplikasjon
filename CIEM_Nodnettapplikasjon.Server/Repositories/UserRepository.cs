using CIEM_Nodnettapplikasjon.Server.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace CIEM_Nodnettapplikasjon.Server.Repositories
{
    public class UserRepository : IUserInterface
    {
        private readonly ApplicationDbContext _context;

        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // Add a new user
        public async Task AddUser(UserModel user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        // Modify user by ID
        public async Task<UserModel> ModifyUser(int userID, UserModel updatedUser)
        {
            var user = await _context.Users.FindAsync(userID);
            if (user == null)
                return null; // Returnerer null hvis ingen bruker er funnet
        

        // Update user properties
        user.name = updatedUser.name;
            user.surname = updatedUser.surname;
            user.email = updatedUser.email;
            // legge til mer?

            await _context.SaveChangesAsync();
        return user;
    }

    // Delete user by ID
    public async Task<bool> DeleteUser(int userID)
        {
            var user = await _context.Users.FindAsync(userID);
            if (user == null)
                return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        // View user by ID
        public async Task<UserModel> ViewUser(int userID)
        {
            return await _context.Users.FindAsync(userID);
        }
    }
}
