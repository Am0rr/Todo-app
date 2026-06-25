using AutoMapper;
using TA.BLL.DTOs.Tasks;
using TA.BLL.Interfaces;
using TA.DAL.Interfaces;
using TA.DAL.Entities.Tasks;
using Microsoft.EntityFrameworkCore;
using TA.DAL.Enums;
using TA.BLL.Exceptions;

namespace TA.BLL.Services;

public class CategoryService : BaseService, ICategoryService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CategoryService(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        IServiceProvider serviceProvider)
        : base(serviceProvider)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<CategoryResponse> CreateAsync(Guid userId, CreateCategoryRequest request, CancellationToken cancellationToken)
    {
        Validate(request);

        if (await _unitOfWork.Categories.Query()
            .AnyAsync(c => c.Name == request.Name && c.UserId == userId, cancellationToken))
            throw new ConflictException($"A category with the name '{request.Name}' already exists.");

        var category = new Category(request.Name, request.Description, userId);

        _unitOfWork.Categories.Add(category);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<CategoryResponse>(category);
    }

    public async Task UpdateAsync(Guid id, Guid userId, string role, UpdateCategoryRequest request, CancellationToken cancellationToken)
    {
        Validate(request);

        var category = await _unitOfWork.Categories.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException($"Category with ID {id} was not found.");

        if (userId != category.UserId && !HasGlobalAccess(role))
            throw new ForbiddenException("You are not allowed to access this category.");

        if (request.Name != null)
        {
            if (await _unitOfWork.Categories.Query().AnyAsync(c => c.Name == request.Name && c.UserId == userId && c.Id == id, cancellationToken))
                throw new ConflictException($"A category with the name '{request.Name}' already exists.");

            category.ChangeName(request.Name);
        }

        if (request.Description != null)
        {
            category.ChangeDescription(request.Description);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Guid id, Guid userId, string role, CancellationToken cancellationToken)
    {
        var category = await _unitOfWork.Categories.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException($"Category with ID {id} was not found.");

        if (userId != category.UserId && !HasGlobalAccess(role))
            throw new ForbiddenException("You are not allowed to access this category.");

        _unitOfWork.Categories.Delete(category);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task<CategoryResponse> GetByIdAsync(Guid id, Guid userId, string role, CancellationToken cancellationToken)
    {
        var category = await _unitOfWork.Categories.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException($"Category with ID {id} was not found.");

        if (userId != category.UserId && !HasGlobalAccess(role))
            throw new ForbiddenException("You are not allowed to access this category.");

        return _mapper.Map<CategoryResponse>(category);
    }

    public async Task<IEnumerable<CategoryResponse>> GetAllAsync(Guid userId, string role, CancellationToken cancellationToken)
    {
        IEnumerable<Category> categories;

        if (HasGlobalAccess(role))
            categories = await _unitOfWork.Categories.GetAllAsync(cancellationToken);
        else
            categories = await _unitOfWork.Categories.Query()
                .Where(c => c.UserId == userId)
                .ToListAsync(cancellationToken);

        return _mapper.Map<IEnumerable<CategoryResponse>>(categories);
    }

    private static bool HasGlobalAccess(string role) =>
    string.Equals(role, nameof(UserRole.Administrator), StringComparison.OrdinalIgnoreCase);
}