namespace TA.BLL.DTOs.Tasks;

public record UpdateTaskRequest(
    string? Title,
    string? Description,
    Guid? CategoryId,
    Guid? UserId,
    string? Status
);