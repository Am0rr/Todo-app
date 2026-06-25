namespace TA.BLL.DTOs.Tasks;

public record UpdateCategoryRequest(
    string? Name,
    string? Description,
    string? UserId
);