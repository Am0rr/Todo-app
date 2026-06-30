using Microsoft.EntityFrameworkCore;
using TA.DAL.Entities;
using TA.DAL.Interfaces;
using TA.DAL.Persistence;

namespace TA.DAL.Repositories;

public class BaseRepository<T>(AppDbContext context) : IBaseRepository<T> where T : BaseEntity
{
    protected readonly DbSet<T> _dbSet = context.Set<T>();

    public async Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _dbSet.FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
    }

    public virtual async Task<IEnumerable<T>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await _dbSet.AsNoTracking().ToListAsync(cancellationToken);
    }

    public void Add(T item)
    {
        _dbSet.Add(item);
    }

    public void Update(T item)
    {
        _dbSet.Update(item);
    }

    public void Delete(T item)
    {
        _dbSet.Remove(item);
    }

    public IQueryable<T> Query()
    {
        return _dbSet.AsQueryable();
    }
}