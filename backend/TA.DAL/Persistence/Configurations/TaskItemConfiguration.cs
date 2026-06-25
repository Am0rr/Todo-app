using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TA.DAL.Entities.Identity;
using TA.DAL.Entities.Tasks;

namespace TA.DAL.Persistence.Configurations;

public class TaskItemConfiguration : IEntityTypeConfiguration<TaskItem>
{
    public void Configure(EntityTypeBuilder<TaskItem> builder)
    {
        builder.ToTable("TaskItems");

        builder.HasKey(ti => ti.Id);

        builder.Property(ti => ti.Title).IsRequired().HasMaxLength(200);
        builder.Property(ti => ti.Description)
            .IsRequired(false)
            .HasMaxLength(500);

        builder.Property(ti => ti.UpdatedAt).IsRequired();
        builder.Property(ti => ti.Status)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.HasIndex(ti => ti.Status);

        builder.HasOne<Category>()
            .WithMany()
            .IsRequired(false)
            .HasForeignKey(ti => ti.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<User>()
            .WithMany()
            .IsRequired()
            .HasForeignKey(ti => ti.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}