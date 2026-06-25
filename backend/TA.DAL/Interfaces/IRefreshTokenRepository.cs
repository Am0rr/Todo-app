using TA.DAL.Entities.Identity;

namespace TA.DAL.Interfaces;

public interface IRefreshTokenRepository
{
    Task<RefreshToken?> GetByTokenAsync(string token, CancellationToken cancellationToken = default);
    void Add(RefreshToken refreshToken);
}