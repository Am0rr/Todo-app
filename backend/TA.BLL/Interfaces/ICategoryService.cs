using TA.BLL.DTOs.Tasks;

namespace TA.BLL.Interfaces;

public interface ICategoryService
{
    Task<CategoryResponse> CreateAsync(Guid userId, CreateCategoryRequest request, CancellationToken cancellationToken = default);
    Task UpdateAsync(Guid id, Guid userId, string role, UpdateCategoryRequest request, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, Guid userId, string role, CancellationToken cancellationToken = default);
    Task<CategoryResponse> GetByIdAsync(Guid id, Guid userId, string role, CancellationToken cancellationToken = default);
    Task<IEnumerable<CategoryResponse>> GetAllAsync(Guid userId, string role, CancellationToken cancellationToken = default);
}