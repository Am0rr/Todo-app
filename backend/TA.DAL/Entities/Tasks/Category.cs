namespace TA.DAL.Entities.Tasks;

public class Category : BaseEntity
{
    public string Name { get; private set; } = null!;
    public string? Description { get; private set; }
    public Guid UserId { get; private set; }

    protected Category() { }

    public Category(string name, string? description, Guid userId)
    {
        Name = name;
        Description = description;
        UserId = userId;
    }

    public void ChangeName(string name) => Name = name;
    public void ChangeDescription(string description) => Description = description;
}