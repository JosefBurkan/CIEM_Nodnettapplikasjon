using CIEM_Nodnettapplikasjon.Server.Models;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace CIEM_Nodnettapplikasjon.Server.Repositories
{
    public class UserRepository : IUserRepository
    {

        private readonly ApplicationDbContext _context;

        public UserRepository(ApplicationDbContext context) {

            _context = context;
        }

        public async Task<UserModel> GetUsers()
        {
            return await _context.Users.FirstOrDefaultAsync();
        }
    }
}
