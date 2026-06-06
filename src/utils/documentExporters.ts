import { TeacherRecord, DocumentConfig } from '../types';
import { convertToKhmerDigits } from './khmerDateHelper';

// Helper to compile final lunar date string
export function getFullLunarString(config: DocumentConfig): string {
  if (config.useCustomDateText) {
    return config.customLunarDate;
  }
  return `ថ្ងៃ${config.lunarDayOfWeek} ${config.lunarDayNum} ខែ${config.lunarMonth} ឆ្នាំ${config.lunarZodiac} ${config.lunarEra} ព.ស. ${convertToKhmerDigits(config.lunarBE)}`;
}

// Generate HTML structure representing the styled table sheet
// This HTML will be used for both MS Word and Excel exports
function buildDocumentHtml(records: TeacherRecord[], config: DocumentConfig, isExcel: boolean = false): string {
  const lunarDate = getFullLunarString(config);
  const solarDate = config.useCustomDateText ? config.customSolarDate : config.customSolarDate;

  // Compile rows
  const tableRows = records.map((rec) => {
    // Check if we have signature images
    const sigInHtml = rec.signatureIn 
      ? `<img src="${rec.signatureIn}" width="80" height="35" style="display: block; margin: 0 auto; max-height: 35px; object-fit: contain;" />` 
      : '<span style="color: #ccc; font-size: 10px;">(គ្មាន)</span>';
      
    const sigOutHtml = rec.signatureOut 
      ? `<img src="${rec.signatureOut}" width="80" height="35" style="display: block; margin: 0 auto; max-height: 35px; object-fit: contain;" />` 
      : '<span style="color: #ccc; font-size: 10px;">(គ្មាន)</span>';

    return `
      <tr>
        <td style="border: 1px solid #1e293b; padding: 8px; text-align: center; font-family: 'Khmer OS Battambang', 'Battambang', sans-serif;">${convertToKhmerDigits(rec.no)}</td>
        <td style="border: 1px solid #1e293b; padding: 8px; text-align: left; font-weight: bold; font-family: 'Khmer OS Battambang', 'Battambang', sans-serif;">${rec.name}</td>
        <td style="border: 1px solid #1e293b; padding: 8px; text-align: center; font-family: 'Khmer OS Battambang', 'Battambang', sans-serif;">${rec.gender}</td>
        <td style="border: 1px solid #1e293b; padding: 8px; text-align: center; font-family: 'Khmer OS Battambang', 'Battambang', sans-serif;">${rec.timeIn || '-'}</td>
        <td style="border: 1px solid #1e293b; padding: 4px; text-align: center;">${sigInHtml}</td>
        <td style="border: 1px solid #1e293b; padding: 8px; text-align: center; font-family: 'Khmer OS Battambang', 'Battambang', sans-serif;">${rec.timeOut || '-'}</td>
        <td style="border: 1px solid #1e293b; padding: 4px; text-align: center;">${sigOutHtml}</td>
        <td style="border: 1px solid #1e293b; padding: 8px; text-align: left; font-family: 'Khmer OS Battambang', 'Battambang', sans-serif;">${rec.remarks || ''}</td>
      </tr>
    `;
  }).join('');

  // Styles for the document
  const layoutStyles = `
    <style>
      body {
        font-family: 'Khmer OS Battambang', 'Battambang', 'Siemreap', sans-serif;
        color: #0f172a;
        line-height: 1.6;
        margin: 20px;
      }
      .motto-section {
        text-align: center;
        margin-bottom: 25px;
      }
      .motto-kingdom {
        font-family: 'Khmer OS Muol Light', 'Moul', sans-serif;
        font-size: 16px;
        font-weight: bold;
        margin: 0;
        text-transform: uppercase;
      }
      .motto-motto {
        font-family: 'Khmer OS Muol Light', 'Moul', sans-serif;
        font-size: 14px;
        margin: 5px 0 0 0;
      }
      .motto-divider {
        font-size: 11px;
        letter-spacing: 2px;
        margin-top: 2px;
      }
      .school-info {
        text-align: left;
        font-family: 'Khmer OS Battambang', 'Battambang', sans-serif;
        font-size: 13px;
        margin-bottom: 10px;
      }
      .doc-title-container {
        text-align: center;
        margin: 15px 0 25px 0;
      }
      .doc-title {
        font-family: 'Khmer OS Muol Light', 'Moul', sans-serif;
        font-size: 18px;
        font-weight: bold;
        margin: 0;
        color: #1e3a8a;
      }
      .doc-subtitle {
        font-family: 'Khmer OS Battambang', 'Battambang', sans-serif;
        font-size: 13px;
        margin: 5px 0 0 0;
        color: #475569;
      }
      .attendance-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 30px;
      }
      .attendance-table th {
        background-color: #f1f5f9;
        border: 1px solid #1e293b;
        padding: 10px 8px;
        font-family: 'Khmer OS Muol Light', 'Moul', sans-serif;
        font-size: 12px;
        text-align: center;
        color: #0f172a;
      }
      .footer-layout {
        width: 100%;
        margin-top: 40px;
        border: none;
      }
      .footer-layout td {
        border: none;
        vertical-align: top;
        font-family: 'Khmer OS Battambang', 'Battambang', sans-serif;
        font-size: 13px;
      }
      .footer-helper-text {
        color: #64748b;
        font-style: italic;
        font-size: 11px;
        margin-top: 30px;
      }
    </style>
  `;

  // Wrap inside standard HTML page template body
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${config.title}</title>
        ${layoutStyles}
      </head>
      <body>
        <!-- Header -->
        <div class="motto-section">
          <p class="motto-kingdom">${config.mottoLine1}</p>
          <p class="motto-motto">${config.mottoLine2}</p>
          <div class="motto-divider">🔹-🔹-🔹-🔹</div>
        </div>

        <div class="school-info">
          <strong>${config.schoolName || 'សាលារៀន:'}</strong>
        </div>

        <!-- Document Main Title -->
        <div class="doc-title-container">
          <h1 class="doc-title">${config.title}</h1>
          <p class="doc-subtitle">${config.subTitle}</p>
        </div>

        <!-- Main Grid -->
        <table class="attendance-table" style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <thead>
            <tr>
              <th style="width: 6%; border: 1px solid #1e293b; background-color: #f1f5f9; padding: 10px; font-weight: bold;">ល.រ</th>
              <th style="width: 24%; border: 1px solid #1e293b; background-color: #f1f5f9; padding: 10px; font-weight: bold;">គោត្តនាម-នាមខ្លួន</th>
              <th style="width: 10%; border: 1px solid #1e293b; background-color: #f1f5f9; padding: 10px; font-weight: bold;">ភេទ</th>
              <th style="width: 12%; border: 1px solid #1e293b; background-color: #f1f5f9; padding: 10px; font-weight: bold;">ម៉ោងចូល</th>
              <th style="width: 15%; border: 1px solid #1e293b; background-color: #f1f5f9; padding: 10px; font-weight: bold;">ហត្ថលេខាចូល</th>
              <th style="width: 12%; border: 1px solid #1e293b; background-color: #f1f5f9; padding: 10px; font-weight: bold;">ម៉ោងចេញ</th>
              <th style="width: 15%; border: 1px solid #1e293b; background-color: #f1f5f9; padding: 10px; font-weight: bold;">ហត្ថលេខាចេញ</th>
              <th style="width: 16%; border: 1px solid #1e293b; background-color: #f1f5f9; padding: 10px; font-weight: bold;">ផ្សេងៗ</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <!-- Footers - Signature Layout block -->
        <table class="footer-layout" style="width: 100%; border: none; border-collapse: collapse; margin-top: 35px;">
          <tbody>
            <tr>
              <!-- Left: Approver / Director -->
              <td style="width: 45%; border: none; text-align: center; padding: 10px;">
                <p style="margin: 0; font-weight: bold; text-decoration: underline;">${config.approverTitle}</p>
                <p style="margin: 3px 0 0 0; font-weight: 500;">${config.approverSubTitle}</p>
                
                <div style="height: 80px; margin-top: 10px; display: flex; align-items: center; justify-content: center;">
                  <span style="color: #94a3b8; font-size: 11px;">(ហត្ថលេខា និងត្រា)</span>
                </div>
                
                <p style="margin: 10px 0 0 0; font-weight: bold; font-size: 14px;">${config.approverName || '...........................................'}</p>
              </td>

              <!-- Spacer -->
              <td style="width: 10%; border: none;"></td>

              <!-- Right: Maker of the table -->
              <td style="width: 45%; border: none; text-align: center; padding: 10px;">
                <p style="margin: 0; font-size: 13px; font-style: italic; color: #475569;">
                  ${lunarDate}
                </p>
                <p style="margin: 3px 0 10px 0; font-size: 13px; font-style: italic; color: #475569;">
                  ${solarDate}
                </p>
                <p style="margin: 5px 0 0 0; font-weight: bold; text-decoration: underline;">${config.makerTitle}</p>
                
                <div style="height: 80px; margin-top: 10px; display: flex; align-items: center; justify-content: center;">
                  <span style="color: #94a3b8; font-size: 11px;">(ហត្ថលេខា)</span>
                </div>

                <p style="margin: 10px 0 0 0; font-weight: bold; font-size: 14px;">${config.makerName || '...........................................'}</p>
              </td>
            </tr>
          </tbody>
        </table>

      </body>
    </html>
  `;
}

// Export to MS Word (.doc)
export function exportToMsWord(records: TeacherRecord[], config: DocumentConfig) {
  const htmlContent = buildDocumentHtml(records, config, false);
  
  // Format Word-specific container
  const data = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <title>Export</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
    </head>
    <body>
      ${htmlContent}
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + data], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `បញ្ជីវត្តមានគ្រូបង្រៀន_${new Date().toISOString().split('T')[0]}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Export to Excel (.xls)
export function exportToExcel(records: TeacherRecord[], config: DocumentConfig) {
  // Excel can open a cleanly styled HTML table if encapsulated with spreadsheet properties
  const htmlContent = buildDocumentHtml(records, config, true);
  
  const template = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>បញ្ជីវត្តមាន</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <meta charset="utf-8">
    </head>
    <body>
      ${htmlContent}
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + template], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `បញ្ជីវត្តមានគ្រូបង្រៀន_${new Date().toISOString().split('T')[0]}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
