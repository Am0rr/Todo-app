namespace TA.DAL.Entities.Identity;

public class RefreshToken : BaseEntity
{
    public string Token { get; private set; } = null!;
    public DateTime ExpiresAt { get; private set; }
    public bool IsRevoked { get; private set; }
    public Guid UserId { get; private set; }

    protected RefreshToken() { }

    public RefreshToken(string token, DateTime expiresAt, Guid userId)
    {
        Token = token;
        ExpiresAt = expiresAt;
        IsRevoked = false;
        UserId = userId;
    }

    public void Revoke() => IsRevoked = true;
}