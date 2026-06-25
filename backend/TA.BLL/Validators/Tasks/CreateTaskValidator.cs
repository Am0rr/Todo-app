using System.Data;
using FluentValidation;
using TA.BLL.DTOs.Tasks;
using TA.DAL.Enums;

namespace TA.BLL.Validators.Tasks;

public class CreateTaskValidator : AbstractValidator<CreateTaskRequest>
{
    public CreateTaskValidator()
    {
        RuleFor(t => t.Title)
            .NotEmpty().WithMessage("Task title cannot be empty.")
            .MaximumLength(200).WithMessage("Task title must not exceed 200 characters.");

        RuleFor(t => t.Description)
            .NotEmpty().WithMessage("Task description cannot be empty.")
            .MaximumLength(500).WithMessage("Task description must not exceed 500 characters.")
            .When(t => t.Description != null);

        RuleFor(t => t.CategoryId)
            .NotEmpty().WithMessage("Category ID cannot be empty.")
            .When(t => t.CategoryId != null);

        RuleFor(t => t.Status)
            .NotEmpty().WithMessage("Status cannot be empty.")
            .IsEnumName(typeof(TaskItemStatus), caseSensitive: false)
            .WithMessage("Selected status is invalid. Allowed values are: Todo, InProgress, etc.");
    }
}