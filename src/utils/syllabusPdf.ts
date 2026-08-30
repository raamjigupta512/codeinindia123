import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CURRICULUM_WEEKS, BUILD_CARDS } from '../types';

export function generateCurriculumPDF(): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Primary Colors
  const peacockColor: [number, number, number] = [13, 90, 80]; // Deep teal #0D5A50
  const marigoldColor: [number, number, number] = [217, 119, 6]; // Warm amber/marigold #D97706
  const charcoalColor: [number, number, number] = [24, 24, 27]; // Dark text #18181B
  const grayColor: [number, number, number] = [100, 116, 139]; // Muted text #64748B
  const lightBg: [number, number, number] = [248, 250, 252];

  // ===== Header Background Banner =====
  doc.setFillColor(...peacockColor);
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Decorative Accent Line
  doc.setFillColor(...marigoldColor);
  doc.rect(0, 42, pageWidth, 2.5, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('CodeInIndia', 14, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(220, 245, 240);
  doc.text('4-Week Live Full-Stack & AI Builder Cohort — Complete Syllabus & Shipping Roadmap', 14, 26);
  doc.text('Language: Hindi + English (Hinglish)  |  Schedule: Live Evening Sessions + 24/7 Mentor Support', 14, 33);

  // ===== Overview Section =====
  let currentY = 54;

  doc.setTextColor(...charcoalColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Cohort Philosophy: "The Curriculum is a Shipping Schedule"', 14, currentY);

  currentY += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...grayColor);
  const introText = 
    'Unlike traditional theory-heavy bootcamps, CodeInIndia is structured around shipping 4 real, production-ready products across 28 days. Every single week begins with conceptual foundations and ends with a verifiable live deploy on a custom domain.';
  const splitIntro = doc.splitTextToSize(introText, pageWidth - 28);
  doc.text(splitIntro, 14, currentY);

  currentY += splitIntro.length * 5 + 4;

  // ===== Curriculum Table (Weeks 1 to 4) =====
  const tableRows = CURRICULUM_WEEKS.map(week => [
    `Week ${week.weekNo}\n(${week.phase})`,
    `${week.title}\nLevel: ${week.skillLevel}`,
    week.description,
    week.shipProject
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['Week / Phase', 'Core Module', 'What You Will Master & Build', 'Deliverable Shipped']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: peacockColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9.5,
      halign: 'left',
      cellPadding: 3.5
    },
    columnStyles: {
      0: { cellWidth: 26, fontStyle: 'bold', fontSize: 8.5, textColor: peacockColor },
      1: { cellWidth: 42, fontStyle: 'bold', fontSize: 8.5, textColor: charcoalColor },
      2: { cellWidth: 74, fontSize: 8, textColor: [51, 65, 85] },
      3: { cellWidth: 44, fontSize: 8, fontStyle: 'bold', textColor: [180, 83, 9] }
    },
    styles: {
      font: 'helvetica',
      overflow: 'linebreak',
      cellPadding: 3,
      lineColor: [226, 232, 240],
      lineWidth: 0.2
    },
    alternateRowStyles: {
      fillColor: lightBg
    },
    margin: { left: 14, right: 14 }
  });

  // Get position after table
  const finalY = (doc as any).lastAutoTable?.finalY || 160;
  let nextY = finalY + 10;

  // ===== Production Tracks & Deliverables =====
  doc.setTextColor(...charcoalColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('3 Core Production Tracks You Will Master:', 14, nextY);

  nextY += 6;
  const boxWidth = (pageWidth - 28 - 8) / 3;
  const boxHeight = 44;

  BUILD_CARDS.forEach((card, i) => {
    const boxX = 14 + i * (boxWidth + 4);

    // Box background
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(boxX, nextY, boxWidth, boxHeight, 2, 2, 'FD');

    // Accent header inside box
    const accentColor: [number, number, number] = i === 0 ? peacockColor : i === 1 ? marigoldColor : [59, 130, 246];
    doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.rect(boxX, nextY, boxWidth, 2, 'F');

    // Title
    doc.setTextColor(...charcoalColor);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(card.title, boxX + 4, nextY + 7);

    // Stack tags
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...grayColor);
    const stackNames = card.techStack.map(t => t.name).slice(0, 3).join(', ');
    doc.text(`Stack: ${stackNames}`, boxX + 4, nextY + 13);

    // Deliverable
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(7.5);
    const delivLines = doc.splitTextToSize(`Outcome: ${card.deliverables}`, boxWidth - 8);
    doc.text(delivLines, boxX + 4, nextY + 19);
  });

  nextY += boxHeight + 8;

  // ===== Included Perks / Cohort Support =====
  doc.setFillColor(240, 253, 250); // Light teal tint
  doc.setDrawColor(153, 246, 228);
  doc.roundedRect(14, nextY, pageWidth - 28, 20, 2, 2, 'FD');

  doc.setTextColor(...peacockColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('Every Enrolled Student Receives:', 18, nextY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  doc.text('• Lifetime Access to Class Recordings & AI Prompt Templates', 18, nextY + 12);
  doc.text('• 1-on-1 Code Review & GitHub PR Approval Sessions', 18, nextY + 16);
  doc.text('• Verified Certificate of Completion with Sharable Credential URL', 110, nextY + 12);
  doc.text('• Freelance Acquisition Kit (Proposal Templates & Invoicing)', 110, nextY + 16);

  // ===== Footer =====
  doc.setFillColor(...peacockColor);
  doc.rect(0, pageHeight - 12, pageWidth, 12, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('CodeInIndia (codeinindia.in)  |  WhatsApp Admissions: +91 98765 43210  |  Email: admissions@codeinindia.in', 14, pageHeight - 5);

  const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  doc.text(`Generated: ${dateStr}`, pageWidth - 45, pageHeight - 5);

  // Trigger browser download
  doc.save('CodeInIndia-4-Week-Curriculum-Syllabus.pdf');
}
