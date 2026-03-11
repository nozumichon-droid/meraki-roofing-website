// ============================================================
// MERAKI ROOFING - Google Apps Script (Lead Tracker)
// ============================================================
//
// SETUP INSTRUCTIONS:
// 1. Go to https://sheets.google.com - create a new spreadsheet
// 2. Name it "Meraki Roofing - Leads"
// 3. Rename the first sheet tab to "Leads"
// 4. In Row 1, add these headers exactly:
//
//    A1: Timestamp
//    B1: Urgency
//    C1: Source
//    D1: Name
//    E1: Phone
//    F1: Email
//    G1: Address
//    H1: ZIP
//    I1: Roof Size (sqft)
//    J1: Pitch
//    K1: Complexity
//    L1: Material
//    M1: Estimated Cost
//    N1: Service Type
//    O1: Contact Pref
//    P1: Message
//    Q1: Latitude
//    R1: Longitude
//
// 5. (Optional) Bold Row 1 and freeze it: View - Freeze - 1 row
// 6. (Optional) Format column A as Date/Time
// 7. Click Extensions - Apps Script
// 8. Delete the default code and paste EVERYTHING below
// 9. Click Save (Ctrl+S)
// 10. Click Deploy - New deployment
//     Type: "Web app"
//     Execute as: Me
//     Who has access: Anyone
// 11. Click Deploy - Authorize when prompted - Copy the Web App URL
// 12. Paste that URL into BOTH files:
//     index.html  - line ~32: const GOOGLE_SHEET_WEBHOOK_URL = 'YOUR_URL';
//     estimate.html - line ~33: const GOOGLE_SHEET_WEBHOOK_URL = 'YOUR_URL';
//
// LEAD SOURCES THAT LOG HERE:
// Hero Scanner gate (name/phone/email + roof data)
// Homepage Calculator gate (name/phone/email + calculator inputs)
// Homepage Satellite Scanner gate (name/phone/email + roof data)
// Hero Contact Form ("Request a Call" tab)
// Main Contact Form (bottom of page)
// Estimate Page Scanner gate (name/phone/email + roof data)
// Estimate Page Final Results (full estimate details)
//
// UPDATING THE SCRIPT:
// If you change the script later, redeploy:
//   Deploy - Manage deployments - Edit - Version: New version - Deploy
// ============================================================

// SECRET TOKEN - must match the token in your HTML files
// Change this to any random string, then update WEBHOOK_SECRET in index.html, estimate.html, and partners.html
var WEBHOOK_SECRET = 'meraki-2026-secure-lead-token';

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // Validate secret token - reject requests without it
    if (data._token !== WEBHOOK_SECRET) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'error', message: 'Unauthorized' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var ss = SpreadsheetApp.openById('104eRKTGyx58zzWKwrQpoq-98VDaac5cq8LMc_mbzXEo');
    var sheet = ss.getSheetByName('Leads') || ss.getActiveSheet();

    sheet.appendRow([
      new Date().toLocaleString('en-US', { timeZone: 'America/Denver' }),  // A: Timestamp
      data.urgency        || '',   // B: Urgency
      data.source         || '',   // C: Source
      data.name           || '',   // D: Name
      data.phone          || '',   // E: Phone
      data.email          || '',   // F: Email
      data.address        || '',   // G: Address
      data.zip            || '',   // H: ZIP
      data.roofSize       || '',   // I: Roof Size
      data.pitch          || '',   // J: Pitch
      data.complexity     || '',   // K: Complexity
      data.material       || '',   // L: Material
      data.estimatedCost  || '',   // M: Estimated Cost
      data.serviceType    || '',   // N: Service Type
      data.contactPref    || '',   // O: Contact Pref
      data.message        || '',   // P: Message
      data.lat            || '',   // Q: Latitude
      data.lng            || ''    // R: Longitude
    ]);

    // AUTO-HIGHLIGHT ROW BY URGENCY
    var urgency = (data.urgency || '').toLowerCase();
    if (urgency) {
      var lastRow = sheet.getLastRow();
      var rowRange = sheet.getRange(lastRow, 1, 1, 18);

      switch (urgency) {
        case 'emergency':
          rowRange.setBackground('#f4cccc');
          rowRange.setFontWeight('bold');
          break;
        case 'asap':
          rowRange.setBackground('#fce5cd');
          rowRange.setFontWeight('bold');
          break;
        case '2weeks':
          rowRange.setBackground('#fff2cc');
          break;
        case 'flexible':
          rowRange.setBackground('#d9ead3');
          break;
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle GET requests (visit the URL in a browser to verify the script is live)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      message: 'Meraki Roofing lead tracker is running.',
      version: '2.0'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
