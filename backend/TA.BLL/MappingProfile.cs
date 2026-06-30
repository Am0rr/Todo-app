using AutoMapper;
using TA.BLL.DTOs.Identity;
using TA.BLL.DTOs.Tasks;
using TA.DAL.Entities.Identity;
using TA.DAL.Entities.Tasks;
using TA.DAL.Models;

namespace TA.BLL;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<User, UserResponse>()
            .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.ToString()));

        CreateMap<Category, CategoryResponse>()
            .ForMember(dest => dest.TaskCount, opt => opt.MapFrom(src => src.Tasks.Count()));

        CreateMap<TaskItem, TaskResponse>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));

        CreateMap<TaskPagedResult, TaskPagedResponse>();
    }
}