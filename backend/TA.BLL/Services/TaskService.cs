using AutoMapper;
using TA.BLL.DTOs.Tasks;
using TA.BLL.Interfaces;
using TA.DAL.Entities.Identity;
using TA.DAL.Entities.Tasks;
using TA.DAL.Enums;
using TA.DAL.Interfaces;

namespace TA.BLL.Services;

public class TaskService : BaseService, ITaskService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public TaskService(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        IServiceProvider serviceProvider)
        : base(serviceProvider)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<TaskResponse> CreateAsync(Guid userId, CreateTaskRequest request, CancellationToken cancellationToken = default)
    {
        Validate(request);

        var task = new TaskItem(request.Title, request.Description, request.CategoryId, userId, request.Status);
    }

    private bool HasGlobalAccess(string role) =>
        string.Equals(role, nameof(UserRole.Administrator), StringComparison.OrdinalIgnoreCase);
}