namespace PrintInvoiceService.Models
{
    public class InvoiceRequest
    {
        public long OrderId { get; set; }

        public long CustomerId { get; set; }

        public ShippingAddress ShippingAddress { get; set; } = new();

        public double TotalAmount { get; set; }

        public string PaymentStatus { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        public List<InvoiceItem> Items { get; set; } = new();
    }

    public class InvoiceItem
    {
        public string ProductName { get; set; } = string.Empty;

        public string Sku { get; set; } = string.Empty;

        public int Quantity { get; set; }

        public double Mrp { get; set; }

        public double RetailerQuotedPrice { get; set; }

        public double CommissionPercent { get; set; }

        public double DiscountPercent { get; set; }

        public double SellingPrice { get; set; }

        public double Subtotal { get; set; }
    }

    public class ShippingAddress
    {
        public string? Name { get; set; }

        public string? Mobile { get; set; }

        public string? AddressLine1 { get; set; }

        public string? AddressLine2 { get; set; }

        public string? City { get; set; }

        public string? State { get; set; }

        public string? Country { get; set; }

        public string? Pincode { get; set; }

        public string? AddressType { get; set; }
    }
}