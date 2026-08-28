using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using PrintInvoiceService.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace PrintInvoiceService
{
    public class Program
    {
        public static void Main(string[] args)
        {
            JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

        // 1. Initialize QuestPDF Community License
        QuestPDF.Settings.License = QuestPDF.Infrastructure.LicenseType.Community;

            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers();

            builder.Services.AddScoped<InvoicePdfService>();

            builder.Services.AddHttpContextAccessor();

            // Order Service URL
            var orderServiceUrl =
                builder.Configuration["OrderService:BaseUrl"]
                ?? "http://localhost:9090/";

            builder.Services.AddHttpClient<OrderServiceClient>(client =>
            {
                client.BaseAddress = new Uri(orderServiceUrl);
            });

            // Adding JWT Authentication
            builder.Services.AddAuthentication(
                JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.MapInboundClaims = false;

                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,

                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(
                                builder.Configuration["Jwt:Key"]!
                            )
                        ),

                        RoleClaimType = "role"
                    };

                    options.Events = new JwtBearerEvents
                    {
                        OnAuthenticationFailed = context =>
                        {
                            Console.WriteLine(
                                "JWT AUTHENTICATION FAILED: " +
                                context.Exception.Message
                            );

                            return Task.CompletedTask;
                        },

                        OnTokenValidated = context =>
                        {
                            Console.WriteLine("JWT TOKEN VALIDATED SUCCESSFULLY");

                            foreach (var claim in context.Principal!.Claims)
                            {
                                Console.WriteLine(
                                    $"CLAIM: {claim.Type} = {claim.Value}"
                                );
                            }

                            return Task.CompletedTask;
                        },

                        OnChallenge = context =>
                        {
                            Console.WriteLine(
                                $"JWT CHALLENGE: {context.Error} - {context.ErrorDescription}"
                            );

                            return Task.CompletedTask;
                        },

                        OnForbidden = context =>
                        {
                            Console.WriteLine("JWT FORBIDDEN");

                            return Task.CompletedTask;
                        }
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
