namespace TA.DAL.Interfaces;

public interface IUnitOfWork
{
    IUserRepository userRepository { get; }
    IRefreshTokenRepository refreshTokenRepository { get; }
    ICategoryRepository categoryRepository { get; }
    ITaskRepository taskRepository { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}