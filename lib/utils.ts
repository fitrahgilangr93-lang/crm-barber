import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Customer, Transaction, RFMScore, RFMSegment } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString?: string | null): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function formatDateTime(dateString?: string | null): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function getDaysDifference(dateString?: string | null): number {
  if (!dateString) return 999;
  const target = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - target.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Quantitative RFM Segmentation calculation (1 to 5 scale)
 */
export function computeRFMScores(
  customers: Customer[],
  transactions: Transaction[]
): RFMScore[] {
  return customers.map((c) => {
    // 1. Recency
    const customerTx = transactions.filter((t) => t.customerId === c.id);
    const sortedTx = [...customerTx].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const lastTxDate = sortedTx.length > 0 ? sortedTx[0].createdAt : c.lastVisitAt;
    const recencyDays = getDaysDifference(lastTxDate);

    let recencyScore = 1;
    if (recencyDays <= 14) recencyScore = 5;
    else if (recencyDays <= 30) recencyScore = 4;
    else if (recencyDays <= 60) recencyScore = 3;
    else if (recencyDays <= 90) recencyScore = 2;
    else recencyScore = 1;

    // 2. Frequency
    const frequencyCount = Math.max(customerTx.length, c.totalVisits || 1);
    let frequencyScore = 1;
    if (frequencyCount >= 8) frequencyScore = 5;
    else if (frequencyCount >= 5) frequencyScore = 4;
    else if (frequencyCount >= 3) frequencyScore = 3;
    else if (frequencyCount >= 2) frequencyScore = 2;
    else frequencyScore = 1;

    // 3. Monetary
    const txTotal = customerTx.reduce((sum, t) => sum + t.totalAmount, 0);
    const monetaryAmount = Math.max(txTotal, c.totalSpend || 50000);
      
    let monetaryScore = 1;
    if (monetaryAmount >= 1500000) monetaryScore = 5;
    else if (monetaryAmount >= 800000) monetaryScore = 4;
    else if (monetaryAmount >= 400000) monetaryScore = 3;
    else if (monetaryAmount >= 150000) monetaryScore = 2;
    else monetaryScore = 1;

    // Segment Classification
    let segment: RFMSegment = 'Promising';
    let actionRecommendation = 'Berikan reward loyalitas dan penawaran bundling layanan.';

    if (recencyScore >= 4 && frequencyScore >= 4 && monetaryScore >= 4) {
      segment = 'Champions';
      actionRecommendation = 'Hadiahkan VIP priority booking, free merchandise, dan minta review publik.';
    } else if (recencyScore >= 3 && frequencyScore >= 3 && monetaryScore >= 3) {
      segment = 'Loyal Customers';
      actionRecommendation = 'Tawarkan upgrade membership Platinum dan rekomendasikan produk perawatan rambut premium.';
    } else if (recencyScore >= 4 && frequencyScore <= 3 && monetaryScore <= 3) {
      segment = 'Potential Loyalists';
      actionRecommendation = 'Tawarkan voucher diskon 15% untuk reservasi kunjungan kedua dalam 14 hari.';
    } else if (recencyScore >= 4 && frequencyScore === 1) {
      segment = 'New Customers';
      actionRecommendation = 'Kirim WhatsApp ucapan terima kasih + panduan styling model rambut yang baru dipotong.';
    } else if (recencyScore === 3 && frequencyScore >= 3) {
      segment = 'At Risk';
      actionRecommendation = 'Kirim reminder jadwal potong rambut dengan diskon ' + formatRupiah(25000) + ' via WhatsApp.';
    } else if (recencyScore <= 2 && frequencyScore >= 3) {
      segment = 'Hibernating';
      actionRecommendation = 'Kampanye "We Miss You!" dengan penawaran free hair wash + styling.';
    } else if (recencyScore <= 2 && frequencyScore <= 2 && monetaryScore <= 2) {
      segment = 'Lost Customers';
      actionRecommendation = 'Kirim survei kepuasan singkat dan voucher diskon reaktivasi spesial 30%.';
    } else {
      segment = 'Promising';
      actionRecommendation = 'Tawarkan paket bundling potong rambut + cuci rambut dengan harga hemat.';
    }

    return {
      customerId: c.id,
      customerName: c.fullName,
      whatsapp: c.whatsapp,
      tier: c.membershipTier,
      recencyDays,
      recencyScore,
      frequencyCount,
      frequencyScore,
      monetaryAmount,
      monetaryScore,
      overallScore: `${recencyScore}${frequencyScore}${monetaryScore}`,
      segment,
      actionRecommendation,
    };
  });
}

/**
 * Export data to standard CSV with UTF-8 BOM
 */
export function exportToCSV(filename: string, rows: Record<string, any>[], headers?: { key: string; label: string }[]) {
  if (!rows || !rows.length) return;
  
  const colKeys = headers ? headers.map(h => h.key) : Object.keys(rows[0]);
  const colLabels = headers ? headers.map(h => h.label) : colKeys;

  const csvRows: string[] = [];
  csvRows.push(colLabels.map(l => `"${String(l).replace(/"/g, '""')}"`).join(','));

  for (const row of rows) {
    const values = colKeys.map(k => {
      const val = row[k];
      const strVal = val === null || val === undefined ? '' : String(val);
      return `"${strVal.replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvContent = '\uFEFF' + csvRows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export to XLSX using SheetJS
 */
export async function exportToExcel(filename: string, sheetName: string, data: Record<string, any>[]) {
  try {
    const XLSX = await import('xlsx');
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  } catch (err) {
    console.error('Failed to export Excel, falling back to CSV', err);
    exportToCSV(filename, data);
  }
}

/**
 * Export to PDF using jsPDF and jspdf-autotable
 */
export async function exportToPDF(
  filename: string,
  title: string,
  headers: string[],
  rows: (string | number | undefined | null)[][]
) {
  try {
    const { default: jsPDF } = await import('jspdf');
    await import('jspdf-autotable');
    const doc = new jsPDF();

    const sanitizedRows = rows.map(r => r.map(c => (c === null || c === undefined ? '-' : c)));

    // Brand header
    doc.setFontSize(16);
    doc.setTextColor(212, 175, 55); // Gold
    doc.text(`BARBER CRM - ${title}`, 14, 18);

    doc.setFontSize(9);
    doc.setTextColor(120, 130, 145);
    doc.text(
      `The Royal Cut Barbershop Management • Tanggal Unduh: ${new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })}`,
      14,
      25
    );

    (doc as any).autoTable({
      head: [headers],
      body: sanitizedRows,
      startY: 30,
      theme: 'grid',
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [245, 208, 54],
        fontStyle: 'bold',
        fontSize: 8,
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [30, 41, 59],
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      styles: {
        overflow: 'linebreak',
        cellPadding: 2.5,
      },
    });

    doc.save(`${filename}.pdf`);
  } catch (err) {
    console.error('Failed to generate PDF, opening print preview', err);
    if (typeof window !== 'undefined') {
      window.print();
    }
  }
}
