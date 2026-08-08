using Microsoft.AspNetCore.Mvc;

namespace PrintInvoiceService.Controllers
{
    [ApiController]
    [Route("api/invoices")]
    public class InvoiceController : ControllerBase
    {
        //[Authorize]
        [HttpPost("generate")]
        public IActionResult Index()
        {

            return Ok(new
            {
                status = "Success",
                message = "Token validated and request received successfully!"
            });
        }
    }
}
