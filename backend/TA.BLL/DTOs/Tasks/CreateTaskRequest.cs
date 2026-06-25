namespace TA.BLL.DTOs.Tasks;

public record CreateTaskRequest(
    string Title,
    string? Description,
    Guid? CategoryId,
    string Status
);