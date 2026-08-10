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
            // 1.Initialize QuestPDF Community License
            QuestPDF.Settings.License = QuestPDF.Infrastructure.LicenseType.Community;

            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers();

            builder.Services.AddScoped<InvoicePdfService>();

            builder.Services.AddHttpContextAccessor();

            builder.Services.AddHttpClient<OrderServiceClient>(client =>
            {
                client.BaseAddress = new Uri("http://localhost:9090/");
            });

            // Adding JWT Authentication
            builder.Services.AddAuthentication(
                JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    // JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear() above
                    // only affects the legacy handler and does nothing here — the JWT
                    // Bearer middleware actually uses a newer internal token handler
                    // that silently remaps short claim names ("role", "sub") to long
                    // Microsoft/XML-SOAP claim URIs regardless of that call. This flag
                    // is what actually disables that remapping, so RoleClaimType =
                    // "role" below matches the claim as it's literally named in the
                    // token (which is how the Java services issue it).
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