using System.Net.Http.Headers;
using System.Text.Json;
using PrintInvoiceService.Models;

namespace PrintInvoiceService.Services
{
    public class OrderServiceClient
    {
        private readonly HttpClient _httpClient;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public OrderServiceClient(
            HttpClient httpClient,
            IHttpContextAccessor httpContextAccessor)
        {
            _httpClient = httpClient;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<InvoiceRequest?> GetOrderAsync(long orderId)
        {
            var token = _httpContextAccessor.HttpContext?
                .Request.Headers.Authorization.ToString();

            if (string.IsNullOrEmpty(token))
            {
                throw new UnauthorizedAccessException("JWT token is missing.");
            }

            _httpClient.DefaultRequestHeaders.Authorization =
                AuthenticationHeaderValue.Parse(token);
            Console.WriteLine("Calling OrderService...");
            Console.WriteLine($"Authorization header exists: {!string.IsNullOrEmpty(token)}");
            Console.WriteLine($"Authorization header: {token}");

            var response = await _httpClient.GetAsync(
                $"api/orders/{orderId}"
            );

            if (!response.IsSuccessStatusCode)
            {
                throw new HttpRequestException(
                    $"OrderService returned {(int)response.StatusCode}."
                );
            }

            var json = await response.Content.ReadAsStringAsync();

            var order = JsonSerializer.Deserialize<OrderResponse>(
                json,
                new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                }
            );

            if (order == null)
            {
                throw new InvalidOperationException(
                    "Unable to deserialize order response."
                );
            }

            return new InvoiceRequest
            {
                OrderId = order.OrderId,
                CustomerId = order.CustomerId,
                ShippingAddress = order.ShippingAddress,
                TotalAmount = order.TotalAmount,
                PaymentStatus = order.PaymentStatus,
                CreatedAt = order.CreatedAt,

                Items = order.OrderItems.Select(item => new InvoiceItem
                {
                    ProductName = item.ProductName,
                    Sku = item.Sku,
                    Quantity = item.Quantity,
                    Mrp = item.Mrp,
                    RetailerQuotedPrice = item.RetailerQuotedPrice,
                    CommissionPercent = item.CommissionPercent,
                    DiscountPercent = item.DiscountPercent,
                    SellingPrice = item.SellingPrice,
                    Subtotal = item.Subtotal
                }).ToList()
            };
        }
    }
}