using TA.DAL.Interfaces;
using TA.DAL.Entities.Identity;
using Microsoft.EntityFrameworkCore;
using TA.DAL.Persistence;

namespace TA.DAL.Repositories;

public class RefreshTokenRepository(AppDbContext context) : IRefreshTokenRepository
{
    private readonly DbSet<RefreshToken> _dbSet = context.Set<RefreshToken>();

    public void Add(RefreshToken refreshToken)
    {
        _dbSet.Add(refreshToken);
    }

    public async Task<RefreshToken?> GetByTokenAsync(string token, CancellationToken cancellationToken)
    {
        return await _dbSet.FirstOrDefaultAsync(rt => rt.Token == token, cancellationToken);
    }
}