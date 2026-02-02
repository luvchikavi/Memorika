// Invoice Generator - Hebrew PDF generation
import { db } from "@/lib/db";

export interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  type: "invoice" | "receipt" | "tax_invoice";
  issueDate: Date;
  dueDate?: Date;

  // Customer
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerTaxId?: string;
  customerAddress?: string;

  // Business
  businessName: string;
  businessTaxId: string;
  businessAddress?: string;
  businessPhone?: string;
  businessEmail?: string;

  // Items
  lineItems: LineItem[];

  // Totals
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;

  // Additional
  notes?: string;
  paymentMethod?: string;
  transactionId?: string;
}

// Generate next invoice number
export async function generateInvoiceNumber(prefix: string = "INV"): Promise<string> {
  const year = new Date().getFullYear();
  const pattern = `${prefix}-${year}-`;

  // Find the last invoice with this prefix
  const lastInvoice = await db.invoice.findFirst({
    where: {
      invoiceNumber: {
        startsWith: pattern,
      },
    },
    orderBy: {
      invoiceNumber: "desc",
    },
  });

  let nextNumber = 1;
  if (lastInvoice) {
    const lastNumber = parseInt(lastInvoice.invoiceNumber.split("-").pop() || "0", 10);
    nextNumber = lastNumber + 1;
  }

  return `${pattern}${nextNumber.toString().padStart(4, "0")}`;
}

// Calculate VAT
export function calculateVAT(subtotal: number, vatRate: number = 17): { vatAmount: number; totalAmount: number } {
  const vatAmount = Math.round((subtotal * vatRate) / 100 * 100) / 100;
  const totalAmount = subtotal + vatAmount;
  return { vatAmount, totalAmount };
}

// Create invoice from payment
export async function createInvoiceFromPayment(
  paymentId: string,
  type: "invoice" | "receipt" | "tax_invoice" = "tax_invoice"
): Promise<any> {
  // Get payment with contact and deal info
  const payment = await db.payment.findUnique({
    where: { id: paymentId },
    include: {
      contact: true,
      deal: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  // Check if invoice already exists
  const existingInvoice = await db.invoice.findUnique({
    where: { paymentId },
  });

  if (existingInvoice) {
    throw new Error("Invoice already exists for this payment");
  }

  // Get gateway settings for VAT and prefixes
  const gatewaySettings = payment.gateway
    ? await db.paymentGatewaySettings.findUnique({
        where: { gateway: payment.gateway },
      })
    : await db.paymentGatewaySettings.findFirst({
        where: { isDefault: true },
      });

  const vatRate = gatewaySettings?.vatRate ?? 17;
  const prefix = type === "receipt"
    ? gatewaySettings?.receiptPrefix || "RCP"
    : gatewaySettings?.invoicePrefix || "INV";

  // Calculate amounts
  // For Israeli tax invoices, the amount typically includes VAT
  // So we need to extract it from the total
  const totalAmount = payment.amount;
  const subtotal = Math.round((totalAmount / (1 + vatRate / 100)) * 100) / 100;
  const vatAmount = Math.round((totalAmount - subtotal) * 100) / 100;

  // Build line items
  const lineItems: LineItem[] = [];
  if (payment.deal) {
    lineItems.push({
      description: payment.deal.product.nameHe || payment.deal.product.name,
      quantity: 1,
      unitPrice: subtotal,
      totalPrice: subtotal,
    });
  } else {
    lineItems.push({
      description: "תשלום",
      quantity: 1,
      unitPrice: subtotal,
      totalPrice: subtotal,
    });
  }

  // Generate invoice number
  const invoiceNumber = await generateInvoiceNumber(prefix);

  // Create invoice
  const invoice = await db.invoice.create({
    data: {
      paymentId,
      contactId: payment.contactId,
      invoiceNumber,
      type,
      subtotal,
      vatRate,
      vatAmount,
      totalAmount,
      lineItems: JSON.stringify(lineItems),
      customerName: `${payment.contact.firstName} ${payment.contact.lastName}`,
      customerEmail: payment.contact.email,
      customerPhone: payment.contact.phone,
      status: "issued",
    },
    include: {
      payment: true,
      contact: true,
    },
  });

  return invoice;
}

// Generate HTML for invoice (for PDF conversion)
export function generateInvoiceHTML(data: InvoiceData): string {
  const typeLabels: Record<string, string> = {
    invoice: "חשבונית",
    receipt: "קבלה",
    tax_invoice: "חשבונית מס",
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("he-IL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("he-IL", {
      style: "currency",
      currency: "ILS",
    }).format(amount);
  };

  return `
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${typeLabels[data.type]} ${data.invoiceNumber}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Heebo', 'Arial Hebrew', Arial, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      color: #1a1a2e;
      background: white;
      padding: 40px;
    }
    .invoice {
      max-width: 800px;
      margin: 0 auto;
      border: 1px solid #e0e0e0;
      padding: 40px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #1a1a2e;
    }
    .header-right {
      text-align: right;
    }
    .header-left {
      text-align: left;
    }
    .invoice-title {
      font-size: 24px;
      font-weight: bold;
      color: #1a1a2e;
      margin-bottom: 8px;
    }
    .invoice-number {
      font-size: 16px;
      color: #666;
    }
    .business-name {
      font-size: 20px;
      font-weight: bold;
      color: #3d84a8;
    }
    .business-details {
      font-size: 12px;
      color: #666;
      margin-top: 8px;
    }
    .details-section {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
    }
    .details-box {
      width: 48%;
      background: #f8f8f8;
      padding: 15px;
      border-radius: 8px;
    }
    .details-title {
      font-size: 12px;
      color: #666;
      margin-bottom: 8px;
      text-transform: uppercase;
    }
    .details-content {
      font-size: 14px;
    }
    .details-content strong {
      display: block;
      font-size: 16px;
      margin-bottom: 4px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    th {
      background: #1a1a2e;
      color: white;
      padding: 12px;
      text-align: right;
      font-weight: 600;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #e0e0e0;
    }
    .text-left {
      text-align: left;
    }
    .totals {
      display: flex;
      justify-content: flex-end;
    }
    .totals-box {
      width: 300px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e0e0e0;
    }
    .totals-row.total {
      font-size: 18px;
      font-weight: bold;
      border-bottom: none;
      border-top: 2px solid #1a1a2e;
      padding-top: 12px;
      margin-top: 8px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
    .notes {
      margin-top: 20px;
      padding: 15px;
      background: #fff8e1;
      border-radius: 8px;
      font-size: 12px;
    }
    .notes-title {
      font-weight: bold;
      margin-bottom: 8px;
    }
  </style>
</head>
<body>
  <div class="invoice">
    <div class="header">
      <div class="header-right">
        <div class="invoice-title">${typeLabels[data.type]}</div>
        <div class="invoice-number">${data.invoiceNumber}</div>
        <div style="margin-top: 8px; font-size: 12px; color: #666;">
          תאריך: ${formatDate(data.issueDate)}
          ${data.dueDate ? `<br>לתשלום עד: ${formatDate(data.dueDate)}` : ""}
        </div>
      </div>
      <div class="header-left">
        <div class="business-name">${data.businessName || "Memorika"}</div>
        <div class="business-details">
          ${data.businessTaxId ? `ח.פ. ${data.businessTaxId}<br>` : ""}
          ${data.businessAddress || ""}<br>
          ${data.businessPhone || ""}<br>
          ${data.businessEmail || ""}
        </div>
      </div>
    </div>

    <div class="details-section">
      <div class="details-box">
        <div class="details-title">פרטי לקוח</div>
        <div class="details-content">
          <strong>${data.customerName}</strong>
          ${data.customerEmail}<br>
          ${data.customerPhone || ""}
          ${data.customerTaxId ? `<br>ח.פ. ${data.customerTaxId}` : ""}
          ${data.customerAddress ? `<br>${data.customerAddress}` : ""}
        </div>
      </div>
      <div class="details-box">
        <div class="details-title">פרטי תשלום</div>
        <div class="details-content">
          ${data.paymentMethod ? `אמצעי תשלום: ${data.paymentMethod}<br>` : ""}
          ${data.transactionId ? `מספר אסמכתא: ${data.transactionId}` : ""}
        </div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>תיאור</th>
          <th class="text-left">כמות</th>
          <th class="text-left">מחיר יחידה</th>
          <th class="text-left">סה"כ</th>
        </tr>
      </thead>
      <tbody>
        ${data.lineItems
          .map(
            (item) => `
          <tr>
            <td>${item.description}</td>
            <td class="text-left">${item.quantity}</td>
            <td class="text-left">${formatPrice(item.unitPrice)}</td>
            <td class="text-left">${formatPrice(item.totalPrice)}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-box">
        <div class="totals-row">
          <span>סכום לפני מע"מ:</span>
          <span>${formatPrice(data.subtotal)}</span>
        </div>
        <div class="totals-row">
          <span>מע"מ (${data.vatRate}%):</span>
          <span>${formatPrice(data.vatAmount)}</span>
        </div>
        <div class="totals-row total">
          <span>סה"כ לתשלום:</span>
          <span>${formatPrice(data.totalAmount)}</span>
        </div>
      </div>
    </div>

    ${
      data.notes
        ? `
    <div class="notes">
      <div class="notes-title">הערות:</div>
      ${data.notes}
    </div>
    `
        : ""
    }

    <div class="footer">
      מסמך זה הופק באופן אוטומטי ואינו דורש חתימה.<br>
      תודה על העסקה!
    </div>
  </div>
</body>
</html>
`;
}

// In a production environment, you would use a library like puppeteer or jsPDF
// to convert the HTML to PDF. For now, we return the HTML and let the browser
// handle printing/PDF export.
export async function generateInvoicePDF(invoiceId: string): Promise<string> {
  const invoice = await db.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      payment: true,
      contact: true,
    },
  });

  if (!invoice) {
    throw new Error("Invoice not found");
  }

  const lineItems = JSON.parse(invoice.lineItems) as LineItem[];

  const paymentMethodLabels: Record<string, string> = {
    credit_card: "כרטיס אשראי",
    bank_transfer: "העברה בנקאית",
    cash: "מזומן",
    bit: "ביט",
    paybox: "PayBox",
  };

  const data: InvoiceData = {
    invoiceNumber: invoice.invoiceNumber,
    type: invoice.type as any,
    issueDate: invoice.issueDate,
    dueDate: invoice.dueDate || undefined,
    customerName: invoice.customerName,
    customerEmail: invoice.customerEmail,
    customerPhone: invoice.customerPhone || undefined,
    customerTaxId: invoice.customerTaxId || undefined,
    businessName: invoice.businessName || "Memorika",
    businessTaxId: invoice.businessTaxId || "",
    lineItems,
    subtotal: invoice.subtotal,
    vatRate: invoice.vatRate,
    vatAmount: invoice.vatAmount,
    totalAmount: invoice.totalAmount,
    paymentMethod: invoice.payment?.paymentMethod
      ? paymentMethodLabels[invoice.payment.paymentMethod] || invoice.payment.paymentMethod
      : undefined,
    transactionId: invoice.payment?.transactionId || undefined,
  };

  return generateInvoiceHTML(data);
}
