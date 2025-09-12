using System;
using System.Security.Cryptography;
using System.Text;

class Program
{
    static void Main()
    {
        string password = "123456";
        string salt = "somesalt";
        
        string hash = HashPasswordWithSalt(password, salt);
        
        Console.WriteLine($"Password: {password}");
        Console.WriteLine($"Salt: {salt}");
        Console.WriteLine($"Hash: {hash}");
    }
    
    static string HashPasswordWithSalt(string password, string salt)
    {
        using var sha256 = SHA256.Create();
        var saltedPassword = password + salt;
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(saltedPassword));
        return Convert.ToBase64String(hashedBytes);
    }
}
