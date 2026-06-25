namespace TA.BLL.DTOs.Tasks;

public record CreateCategoryRequest(
    string Name,
    string? Description
);