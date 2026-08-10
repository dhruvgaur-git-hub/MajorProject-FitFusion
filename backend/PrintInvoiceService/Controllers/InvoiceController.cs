using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PrintInvoiceService.Models;
using PrintInvoiceService.Services;

namespace PrintInvoiceService.Controllers
{
    [ApiController]
    [Route("api/invoices")]
    public class InvoiceController : ControllerBase
    {
        private readonly InvoicePdfService _invoicePdfService;
        private readonly OrderServiceClient _orderServiceClient;

        public InvoiceController(
            InvoicePdfService invoicePdfService,
            OrderServiceClient orderServiceClient)
        {
            _invoicePdfService = invoicePdfService;
            _orderServiceClient = orderServiceClient;
        }

        [Authorize(Roles = "CUSTOMER, ADMIN")]
        [HttpPost("generate/{orderId}")]
        public async Task<IActionResult> GenerateInvoice(long orderId)
        {
            InvoiceRequest? request =
                await _orderServiceClient.GetOrderAsync(orderId);

            if (request == null)
            {
                return NotFound("Order not found.");
            }

            byte[] pdf =
                _invoicePdfService.GenerateInvoice(request);

            return File(
                pdf,
                "application/pdf",
                $"Invoice-{request.OrderId}.pdf"
            );
        }
    }
}