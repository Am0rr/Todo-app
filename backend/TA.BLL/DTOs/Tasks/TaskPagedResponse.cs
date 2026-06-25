namespace TA.BLL.DTOs.Tasks;

public record TaskPagedResponse(
    IEnumerable<TaskResponse> Items,
    int TotalCount
);