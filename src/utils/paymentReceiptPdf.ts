import { jsPDF } from 'jspdf';

export interface PaymentReceiptInfo {
  paymentId: string;
  orderId: string;
  amount: number; // in Rupees
  currency?: string;
  planName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  verifiedAt: string;
  signature?: string;
}

export function generatePaymentReceiptPDF(info: PaymentReceiptInfo): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Color Palette
  const peacockColor: [number, number, number] = [13, 90, 80]; // Deep teal #0D5A50
  const emeraldColor: [number, number, number] = [16, 185, 129]; // Emerald #10B981
  const darkInk: [number, number, number] = [24, 24, 27]; // #18181B
  const slateMuted: [number, number, number] = [100, 116, 139]; // #64748B
  const cardBg: [number, number, number] = [248, 250, 252]; // #F8FAFC
  const borderCol: [number, number, number] = [226, 232, 240]; // #E2E8F0

  // ===== Header Banner =====
  doc.setFillColor(...peacockColor);
  doc.rect(0, 0, pageWidth, 38, 'F');

  // Decorative Accent Strip
  doc.setFillColor(...emeraldColor);
  doc.rect(0, 38, pageWidth, 2.5, 'F');

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('CodeInIndia', 16, 18);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(220, 245, 240);
  doc.text('Official Payment Receipt & Enrollment Confirmation', 16, 26);
  doc.text('Authorized Razorpay Verified Transaction', 16, 32);

  // Status Badge on Right of Header
  doc.setFillColor(16, 185, 129);
  doc.roundedRect(pageWidth - 60, 12, 44, 12, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('PAYMENT VERIFIED', pageWidth - 57, 19.5);

  let currentY = 52;

  // ===== Student & Receipt Info Grid =====
  doc.setFillColor(...cardBg);
  doc.roundedRect(14, currentY, pageWidth - 28, 46, 3, 3, 'F');
  doc.setDrawColor(...borderCol);
  doc.roundedRect(14, currentY, pageWidth - 28, 46, 3, 3, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...peacockColor);
  doc.text('Student & Transaction Details', 20, currentY + 9);

  // Column 1: Student Details
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...slateMuted);
  doc.text('Student Name:', 20, currentY + 18);
  doc.text('Email Address:', 20, currentY + 26);
  doc.text('Mobile Number:', 20, currentY + 34);
  doc.text('Enrollment Track:', 20, currentY + 42);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkInk);
  doc.text(info.customerName || 'N/A', 52, currentY + 18);
  doc.text(info.customerEmail || 'N/A', 52, currentY + 26);
  doc.text(info.customerPhone || 'N/A', 52, currentY + 34);
  doc.text(info.planName || 'Live Full-Stack Cohort', 52, currentY + 42);

  // Column 2: Transaction Identifiers
  const col2X = 118;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slateMuted);
  doc.text('Payment ID:', col2X, currentY + 18);
  doc.text('Order ID:', col2X, currentY + 26);
  doc.text('Date & Time:', col2X, currentY + 34);
  doc.text('Gateway Mode:', col2X, currentY + 42);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkInk);
  doc.text(info.paymentId || 'pay_test', col2X + 28, currentY + 18);
  doc.text(info.orderId || 'order_test', col2X + 28, currentY + 26);
  const formattedDate = new Date(info.verifiedAt).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.text(formattedDate, col2X + 28, currentY + 34);
  doc.text('Razorpay Standard (HMAC Validated)', col2X + 28, currentY + 42);

  currentY += 56;

  // ===== Itemized Fee Table =====
  doc.setFillColor(...peacockColor);
  doc.rect(14, currentY, pageWidth - 28, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Description', 20, currentY + 5.5);
  doc.text('Amount (INR)', pageWidth - 42, currentY + 5.5);

  currentY += 8;

  // Table Row
  doc.setFillColor(255, 255, 255);
  doc.rect(14, currentY, pageWidth - 28, 14, 'F');
  doc.setDrawColor(...borderCol);
  doc.line(14, currentY + 14, pageWidth - 14, currentY + 14);

  doc.setTextColor(...darkInk);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text(info.planName, 20, currentY + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...slateMuted);
  doc.text('Live hands-on cohort sessions, project mentor reviews & certification access', 20, currentY + 11);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...darkInk);
  doc.text(`₹${info.amount.toLocaleString('en-IN')}`, pageWidth - 42, currentY + 8);

  currentY += 14;

  // Total Summary
  doc.setFillColor(...cardBg);
  doc.rect(14, currentY, pageWidth - 28, 12, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...darkInk);
  doc.text('Total Amount Paid (Inclusive of Taxes):', pageWidth - 110, currentY + 8);
  doc.setTextColor(...peacockColor);
  doc.setFontSize(12);
  doc.text(`₹${info.amount.toLocaleString('en-IN')}`, pageWidth - 36, currentY + 8);

  currentY += 22;

  // ===== Verification & Security Notice Box =====
  doc.setFillColor(236, 253, 245); // Emerald-50
  doc.roundedRect(14, currentY, pageWidth - 28, 28, 2.5, 2.5, 'F');
  doc.setDrawColor(167, 243, 208); // Emerald-200
  doc.roundedRect(14, currentY, pageWidth - 28, 28, 2.5, 2.5, 'S');

  doc.setTextColor(6, 95, 70); // Emerald-800
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('Cryptographic Verification Certificate (HMAC-SHA256)', 20, currentY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(4, 120, 87);
  doc.text('This receipt was cryptographically verified on our backend using Razorpay webhook/HMAC secret matching.', 20, currentY + 14);
  doc.text(`Signature Algorithm: HMAC-SHA256(order_id + "|" + payment_id, SECRET) → Match Confirmed.`, 20, currentY + 19);
  doc.text(`Server Timestamp: ${info.verifiedAt}`, 20, currentY + 24);

  currentY += 36;

  // ===== Next Steps =====
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...darkInk);
  doc.text('Next Steps for Enrolled Students:', 14, currentY);

  currentY += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...slateMuted);
  const steps = [
    '1. Join the private student WhatsApp group using the invite link on your confirmation screen.',
    '2. You will receive an onboarding email with Discord community access and repository templates.',
    '3. Live classes are hosted on Google Meet / Zoom with interactive Q&A.'
  ];
  steps.forEach((step, idx) => {
    doc.text(step, 16, currentY + (idx * 5.5));
  });

  // ===== Footer =====
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...slateMuted);
  doc.text('CodeInIndia EdTech Private Limited · support@codeinindia.in · https://codeinindia.in', 14, pageHeight - 12);
  doc.text(`Generated on ${new Date().toLocaleDateString('en-IN')}`, pageWidth - 50, pageHeight - 12);

  // Save the PDF
  const safeName = (info.customerName || 'Student').replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`CodeInIndia_Receipt_${info.paymentId}_${safeName}.pdf`);
}
