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

        public InvoiceController(InvoicePdfService invoicePdfService)
        {
            _invoicePdfService = invoicePdfService;
        }

        [Authorize(Roles = "CUSTOMER")]
        [HttpPost("generate")]
        public IActionResult GenerateInvoice(
            [FromBody] InvoiceRequest request)
        {
            byte[] pdf = _invoicePdfService.GenerateInvoice(request);

            return File(
                pdf,
                "application/pdf",
                $"Invoice-{request.OrderId}.pdf"
            );
        }
    }
}