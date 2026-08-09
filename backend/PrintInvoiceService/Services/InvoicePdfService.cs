using PrintInvoiceService.Models;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace PrintInvoiceService.Services
{
    public class InvoicePdfService
    {
        // FitFusion brand colors
        private static readonly string Navy = "#111827";
        private static readonly string Black = "#000000";
        private static readonly string LightGray = "#F3F4F6";
        private static readonly string MediumGray = "#6B7280";
        private static readonly string BorderGray = "#E5E7EB";
        private static readonly string Green = "#16A34A";
        private static readonly string Orange = "#FF6B35"; // matches "Fit" across the site (navbars, headings)

        // Same dumbbell logo used across the frontend (Navbar, sidebars, etc.),
        // loaded once and reused for every invoice.
        private static readonly byte[] LogoBytes =
            File.ReadAllBytes(Path.Combine(AppContext.BaseDirectory, "Assets", "dumbbell.png"));

        public byte[] GenerateInvoice(InvoiceRequest request)
        {
            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.MarginHorizontal(45);
                    page.MarginVertical(35);

                    page.DefaultTextStyle(x =>
                        x.FontSize(9)
                         .FontColor(Navy));

                    // =====================================================
                    // HEADER
                    // =====================================================

                    page.Header()
    .Column(header =>
    {
        header.Item()
            .Row(row =>
            {
                row.RelativeItem()
                    .Column(column =>
                    {
                        column.Item()
                            .Row(logoRow =>
                            {
                                logoRow.AutoItem()
                                    .Height(26)
                                    .Width(26)
                                    .Image(LogoBytes)
                                    .FitArea();

                                logoRow.AutoItem()
                                    .PaddingLeft(8)
                                    .Text(text =>
                                    {
                                        text.Span("FIT")
                                            .Bold()
                                            .FontSize(25)
                                            .FontColor(Orange);

                                        text.Span("FUSION")
                                            .Bold()
                                            .FontSize(25)
                                            .FontColor(Navy);
                                    });
                            });

                        column.Item()
                            .PaddingTop(3)
                            .Text("Fitness. Nutrition. Lifestyle.")
                            .FontSize(9)
                            .FontColor(MediumGray);
                    });

                row.AutoItem()
                    .AlignRight()
                    .Column(column =>
                    {
                        column.Item()
                            .Text("INVOICE")
                            .Bold()
                            .FontSize(22)
                            .FontColor(Black);

                        column.Item()
                            .PaddingTop(3)
                            .Text($"#{request.OrderId}")
                            .FontSize(10)
                            .FontColor(MediumGray);
                    });
            });

        // Orange separator
        header.Item()
            .PaddingTop(15)
            .LineHorizontal(2)
            .LineColor(Black);
    });

                    // =====================================================
                    // CONTENT
                    // =====================================================

                    page.Content()
                        .PaddingTop(25)
                        .Column(column =>
                        {
                            // -------------------------------------------------
                            // ORDER INFORMATION
                            // -------------------------------------------------

                            column.Item()
                                .Row(row =>
                                {
                                    // Bill To
                                    row.RelativeItem()
                                        .Background(LightGray)
                                        .Padding(12)
                                        .Column(info =>
                                        {
                                            info.Item()
                                                .Text("BILL TO")
                                                .Bold()
                                                .FontSize(8)
                                                .FontColor(MediumGray);

                                            info.Item()
                                                .PaddingTop(5)
                                                .Text($"Customer #{request.CustomerId}")
                                                .Bold()
                                                .FontSize(11);

                                            info.Item()
                                                .PaddingTop(3)
                                                .Text(
                                                    $"{request.ShippingAddress.AddressLine1}\n" +
                                                    $"{request.ShippingAddress.City}, " +
                                                    $"{request.ShippingAddress.State}\n" +
                                                    $"{request.ShippingAddress.Pincode}"
                                                )
                                                .FontSize(9);
                                        });

                                    row.ConstantItem(15);

                                    // Order information
                                    row.RelativeItem()
                                        .Background(LightGray)
                                        .Padding(12)
                                        .Column(info =>
                                        {
                                            info.Item()
                                                .Text("ORDER INFORMATION")
                                                .Bold()
                                                .FontSize(8)
                                                .FontColor(MediumGray);

                                            info.Item()
                                                .PaddingTop(5)
                                                .Row(r =>
                                                {
                                                    r.RelativeItem()
                                                        .Text("Order Date")
                                                        .FontColor(MediumGray);

                                                    r.RelativeItem()
                                                        .AlignRight()
                                                        .Text(
                                                            request.CreatedAt
                                                                .ToString("dd MMM yyyy"))
                                                        .Bold();
                                                });

                                            info.Item()
                                                .PaddingTop(5)
                                                .Row(r =>
                                                {
                                                    r.RelativeItem()
                                                        .Text("Payment")
                                                        .FontColor(MediumGray);

                                                    r.RelativeItem()
                                                        .AlignRight()
                                                        .Text(request.PaymentStatus)
                                                        .Bold()
                                                        .FontColor(Green);
                                                });
                                        });
                                });

                            column.Item()
                                .PaddingTop(25);

                            // -------------------------------------------------
                            // ITEMS TITLE
                            // -------------------------------------------------

                            column.Item()
                                .Text("ORDER ITEMS")
                                .Bold()
                                .FontSize(11)
                                .FontColor(Navy);

                            column.Item()
                                .PaddingTop(8);

                            // -------------------------------------------------
                            // ITEMS TABLE
                            // -------------------------------------------------

                            column.Item()
                                .Table(table =>
                                {
                                    table.ColumnsDefinition(columns =>
                                    {
                                        columns.ConstantColumn(25);   // #
                                        columns.RelativeColumn(3.5f); // Product
                                        columns.RelativeColumn(1);   // Qty
                                        columns.RelativeColumn(1.2f); // MRP
                                        columns.RelativeColumn(1);   // Disc.
                                        columns.RelativeColumn(1.4f); // Subtotal
                                    });

                                    table.Header(header =>
                                    {
                                        header.Cell()
                                            .Element(HeaderCellStyle)
                                            .Text("#");

                                        header.Cell()
                                            .Element(HeaderCellStyle)
                                            .Text("PRODUCT");

                                        header.Cell()
                                            .Element(HeaderCellStyle)
                                            .AlignCenter()
                                            .Text("QTY");

                                        header.Cell()
                                            .Element(HeaderCellStyle)
                                            .AlignRight()
                                            .Text("MRP");

                                        header.Cell()
                                            .Element(HeaderCellStyle)
                                            .AlignCenter()
                                            .Text("DISCOUNT");

                                        header.Cell()
                                            .Element(HeaderCellStyle)
                                            .AlignRight()
                                            .Text("AMOUNT");
                                    });

                                    int index = 1;

                                    foreach (var item in request.Items)
                                    {
                                        table.Cell()
                                            .Element(ItemCellStyle)
                                            .Text(index.ToString());

                                        table.Cell()
                                            .Element(ItemCellStyle)
                                            .Column(product =>
                                            {
                                                product.Item()
                                                    .Text(item.ProductName)
                                                    .Bold()
                                                    .FontSize(9);

                                                product.Item()
                                                    .PaddingTop(2)
                                                    .Text($"SKU: {item.Sku}")
                                                    .FontSize(7)
                                                    .FontColor(MediumGray);
                                            });

                                        table.Cell()
                                            .Element(ItemCellStyle)
                                            .AlignCenter()
                                            .Text(item.Quantity.ToString());

                                        table.Cell()
                                            .Element(ItemCellStyle)
                                            .AlignRight()
                                            .Text($"₹{item.Mrp:N2}");

                                        table.Cell()
                                            .Element(ItemCellStyle)
                                            .AlignCenter()
                                            .Text($"{item.DiscountPercent:N1}%")
                                            .FontColor(Green)
                                            .Bold();

                                        table.Cell()
                                            .Element(ItemCellStyle)
                                            .AlignRight()
                                            .Text($"₹{item.Subtotal:N2}")
                                            .Bold();

                                        index++;
                                    }
                                });

                            // -------------------------------------------------
                            // SUMMARY
                            // -------------------------------------------------

                            column.Item()
                                .PaddingTop(20)
                                .AlignRight()
                                .Width(250)
                                .Column(summary =>
                                {
                                    summary.Item()
                                        .Row(row =>
                                        {
                                            row.RelativeItem()
                                                .Text("Total Items")
                                                .FontColor(MediumGray);

                                            row.AutoItem()
                                                .Text(request.Items.Sum(x => x.Quantity).ToString())
                                                .Bold();
                                        });

                                    summary.Item()
                                        .PaddingTop(8)
                                        .LineHorizontal(1)
                                        .LineColor(BorderGray);

                                    summary.Item()
                                        .PaddingTop(10)
                                        .Background(Navy)
                                        .Padding(12)
                                        .Row(row =>
                                        {
                                            row.RelativeItem()
                                                .Text("TOTAL")
                                                .Bold()
                                                .FontSize(12)
                                                .FontColor(Colors.White);

                                            row.AutoItem()
                                                .Text($"₹{request.TotalAmount:N2}")
                                                .Bold()
                                                .FontSize(14)
                                                .FontColor(Colors.White);
                                        });
                                });

                            // -------------------------------------------------
                            // THANK YOU
                            // -------------------------------------------------

                            column.Item()
                                .PaddingTop(35)
                                .AlignCenter()
                                .Column(message =>
                                {
                                    message.Item()
                                        .Text("Thank you for choosing FitFusion!")
                                        .Bold()
                                        .FontSize(12)
                                        .FontColor(Navy);

                                    message.Item()
                                        .PaddingTop(4)
                                        .Text("Stay strong. Stay consistent. Stay Fit.")
                                        .FontSize(9)
                                        .FontColor(MediumGray);
                                });
                        });

                    // =====================================================
                    // FOOTER
                    // =====================================================

                    page.Footer()
                        .PaddingTop(15)
                        .BorderTop(1)
                        .BorderColor(BorderGray)
                        .Row(row =>
                        {
                            row.RelativeItem()
                                .Text("FitFusion • Fitness E-Commerce Marketplace")
                                .FontSize(7)
                                .FontColor(MediumGray);

                            row.AutoItem()
                                .Text($"Invoice #{request.OrderId}")
                                .FontSize(7)
                                .FontColor(MediumGray);
                        });
                });
            });

            return document.GeneratePdf();
        }

        // =============================================================
        // TABLE STYLES
        // =============================================================

        private static IContainer HeaderCellStyle(IContainer container)
        {
            return container
                .Background(Navy)
                .PaddingVertical(8)
                .PaddingHorizontal(6)
                .DefaultTextStyle(x =>
                    x.FontColor(Colors.White)
                     .Bold()
                     .FontSize(8));
        }

        private static IContainer ItemCellStyle(IContainer container)
        {
            return container
                .BorderBottom(1)
                .BorderColor(BorderGray)
                .PaddingVertical(9)
                .PaddingHorizontal(6);
        }
    }
}