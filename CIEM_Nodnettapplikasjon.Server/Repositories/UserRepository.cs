using CIEM_Nodnettapplikasjon.Server.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace CIEM_Nodnettapplikasjon.Server.Repositories
{
    public class UserRepository : IUserRepository
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
        public async Task<UserModel> ModifyUser(int brukerID, UserModel updatedUser)
        {
            var user = await _context.Users.FindAsync(brukerID);
            if (user == null)
                return null; // Returnerer null hvis ingen bruker er funnet
        

        // Update user properties
        user.FirstName = updatedUser.FirstName;
            user.LastName = updatedUser.LastName;
            user.Email = updatedUser.Email;
            // legge til mer?

            await _context.SaveChangesAsync();
        return user;
    }

    // Delete user by ID
    public async Task<bool> DeleteUser(int brukerID)
        {
            var user = await _context.Users.FindAsync(brukerID);
            if (user == null)
                return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        // View user by ID
        public async Task<UserModel> ViewUser(int brukerID)
        {
            return await _context.Users.FindAsync(brukerID);
        }
    }
}
