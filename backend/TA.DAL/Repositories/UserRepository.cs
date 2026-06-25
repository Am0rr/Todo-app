using Microsoft.EntityFrameworkCore;
using TA.DAL.Entities.Identity;
using TA.DAL.Interfaces;
using TA.DAL.Persistence;

namespace TA.DAL.Repositories;

public class UserRepository(AppDbContext context)
    : BaseRepository<User>(context), IUserRepository
{
    public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken)
    {
        return await _dbSet.FirstOrDefaultAsync(u => u.Email == email, cancellationToken);
    }
}