namespace TA.BLL.DTOs.Tasks;

public record CreateTaskRequest(
    string Title,
    string? Description,
    Guid? CategoryId,
    Guid UserId,
    string Status
);