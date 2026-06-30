using Microsoft.EntityFrameworkCore;
using TA.DAL.Entities.Tasks;
using TA.DAL.Interfaces;
using TA.DAL.Persistence;

namespace TA.DAL.Repositories;

public class CategoryRepository(AppDbContext context)
    : BaseRepository<Category>(context), ICategoryRepository
{

    public override async Task<IEnumerable<Category>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await _dbSet.Include(c => c.Tasks).ToListAsync(cancellationToken);
    }
}