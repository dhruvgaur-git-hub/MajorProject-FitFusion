namespace PrintInvoiceService.Models
{
    public class OrderResponse
    {
        public long OrderId { get; set; }

        public long CustomerId { get; set; }

        public ShippingAddress ShippingAddress { get; set; } = new();

        public double TotalAmount { get; set; }

        public string PaymentStatus { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        public List<OrderItemResponse> OrderItems { get; set; } = new();
    }

    public class OrderItemResponse
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
}