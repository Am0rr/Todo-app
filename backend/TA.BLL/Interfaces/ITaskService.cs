using TA.BLL.DTOs.Tasks;

namespace TA.BLL.Interfaces;

public interface ITaskService
{
    Task<TaskResponse> CreateAsync(Guid id, Guid userId, CreateTaskRequest request, CancellationToken cancellationToken = default);
    Task UpdateAsync(Guid id, UpdateTaskRequest request, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
    Task<TaskResponse> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<TaskResponse>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<TaskPagedResponse>
}