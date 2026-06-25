using AutoMapper;
using TA.BLL.Interfaces;
using TA.DAL.Interfaces;
using TA.BLL.DTOs.Identity;
using TA.DAL.Entities.Identity;
using TA.DAL.Enums;
using Microsoft.EntityFrameworkCore;
using TA.BLL.Exceptions;

namespace TA.BLL.Services;

public class UserService : BaseService, IUserService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public UserService(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        IServiceProvider serviceProvider) : base(serviceProvider)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<UserResponse> CreateAsync(CreateUserRequest request, CancellationToken cancellationToken)
    {
        Validate(request);

        if (await _unitOfWork.Users.Query().AnyAsync(u => u.Username == request.Username, cancellationToken))
            throw new ConflictException("This username is already taken.");

        if (await _unitOfWork.Users.Query().AnyAsync(u => u.Email == request.Email, cancellationToken))
            throw new ConflictException("Account with this email address already exists.");

        string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        var user = new User(
            request.Username,
            request.Email,
            passwordHash,
            UserRole.User
        );

        _unitOfWork.Users.Add(user);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<UserResponse>(user);
    }

    public async Task UpdateAsync(Guid id, UpdateUserRequest request, CancellationToken cancellationToken)
    {
        Validate(request);
        var user = await _unitOfWork.Users.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException($"User with Id {id} not found");

        if (request.Username != null)
        {
            if (await _unitOfWork.Users.Query()
                .AnyAsync(u => u.Username == request.Username && u.Id != id, cancellationToken))
                throw new ConflictException("This username is already taken.");

            user.ChangeUsername(request.Username);
        }

        if (request.Email != null)
        {
            if (await _unitOfWork.Users.Query().AnyAsync(u => u.Email == request.Email, cancellationToken))
                throw new ConflictException("Account with this email address already exists.");

            user.ChangeEmail(request.Email);
        }

        if (request.Role != null)
        {
            var role = Enum.Parse<UserRole>(request.Role, ignoreCase: true);
            user.ChangeRole(role);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException($"User with Id {id} not found");

        _unitOfWork.Users.Delete(user);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task<UserResponse> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException($"User with ID {id} not found.");

        return _mapper.Map<UserResponse>(user);
    }

    public async Task<UserResponse> GetByEmailAsync(string email, CancellationToken cancellationToken)
    {
        var user = await _unitOfWork.Users.GetByEmailAsync(email, cancellationToken)
            ?? throw new NotFoundException($"User with email {email} not found.");

        return _mapper.Map<UserResponse>(user);
    }

    public async Task<IEnumerable<UserResponse>> GetAllAsync(CancellationToken cancellationToken)
    {
        var users = await _unitOfWork.Users.GetAllAsync(cancellationToken);

        return _mapper.Map<IEnumerable<UserResponse>>(users);
    }
}