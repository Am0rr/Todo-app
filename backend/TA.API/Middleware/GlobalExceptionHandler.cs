using FluentValidation;
using System.Net;
using System.Text.Json;
using TA.BLL.Exceptions;

namespace TA.API.Middleware;

public class GlobalExceptionHandler
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(RequestDelegate next, ILogger<GlobalExceptionHandler> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        var statusCode = exception switch
        {
            ArgumentException => (int)HttpStatusCode.BadRequest,
            InvalidOperationException => (int)HttpStatusCode.BadRequest,
            KeyNotFoundException => (int)HttpStatusCode.NotFound,
            UnauthorizedAccessException => (int)HttpStatusCode.Unauthorized,
            ValidationException => (int)HttpStatusCode.BadRequest,
            ForbiddenException => (int)HttpStatusCode.Forbidden,
            NotFoundException => (int)HttpStatusCode.NotFound,
            ConflictException => (int)HttpStatusCode.Conflict,
            _ => (int)HttpStatusCode.InternalServerError
        };

        object response;

        if (exception is ValidationException validationException)
        {
            response = new
            {
                status = statusCode,
                error = "Bad Request",
                errors = validationException.Errors.Select(e => e.ErrorMessage)
            };
        }
        else
        {
            response = new
            {
                status = statusCode,
                error = GetTitle(statusCode),
                message = exception.Message
            };

        }

        return context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }

    public static string GetTitle(int statusCode) => statusCode switch
    {
        400 => "Bad Request",
        404 => "Not Found",
        500 => "Internal Server Error",
        401 => "Unauthorized",
        403 => "Forbidden",
        409 => "Conflict",
        _ => "An Error Occurred"
    };
}