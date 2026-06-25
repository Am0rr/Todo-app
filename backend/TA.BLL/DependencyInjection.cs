using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using TA.BLL.Interfaces;
using TA.BLL.Services;
using TA.BLL.Validators.Identity;
using FluentValidation;


namespace TA.BLL;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ICategoryService, CategoryService>();
        services.AddScoped<ITaskService, TaskService>();

        services.AddValidatorsFromAssemblyContaining<CreateUserValidator>();

        services.AddAutoMapper(cfg => cfg.AddMaps(Assembly.GetExecutingAssembly()));

        return services;
    }
}