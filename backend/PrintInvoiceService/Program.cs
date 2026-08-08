using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace PrintInvoiceService
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // 1. Initialize QuestPDF Community License
            QuestPDF.Settings.License = QuestPDF.Infrastructure.LicenseType.Community;

            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers();

            // Adding JWT Authentication
            builder.Services.AddAuthentication(
                JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,

                        IssuerSigningKey = new SymmetricSecurityKey(
        Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
                    };
                });

            builder.Services.AddAuthorization();

            var app = builder.Build();

            // Authentication
            app.UseAuthentication();

            // Authorization
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}