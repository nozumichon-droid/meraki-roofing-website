// ============================================================
// MERAKI ROOFING — Google Apps Script (Lead Tracker)
// ============================================================
//
// SETUP INSTRUCTIONS:
// ───────────────────
// 1. Go to https://sheets.google.com → create a new spreadsheet
// 2. Name it "Meraki Roofing — Leads"
// 3. Rename the first sheet tab to "Leads"
// 4. In Row 1, add these headers exactly:
//
//    A1: Timestamp
//    B1: Source
//    C1: Name
//    D1: Phone
//    E1: Email
//    F1: Address
//    G1: ZIP
//    H1: Roof Size (sqft)
//    I1: Pitch
//    J1: Complexity
//    K1: Material
//    L1: Estimated Cost
//    M1: Service Type
//    N1: Urgency
//    O1: Contact Pref
//    P1: Message
//    Q1: Latitude
//    R1: Longitude
//
// 5. (Optional) Bold Row 1 and freeze it: View → Freeze → 1 row
// 6. (Optional) Format column A as Date/Time
// 7. Click Extensions → Apps Script
// 8. Delete the default code and paste EVERYTHING below
// 9. Click 💾 Save (Ctrl+S)
// 10. Click Deploy → New deployment
//     • Type: "Web app"
//     • Execute as: Me
//     • Who has access: Anyone
// 11. Click Deploy → Authorize when prompted → Copy the Web App URL
// 12. Paste that URL into BOTH files:
//     • index.html  → line ~32: const GOOGLE_SHEET_WEBHOOK_URL = 'YOUR_URL';
//     • estimate.html → line ~33: const GOOGLE_SHEET_WEBHOOK_URL = 'YOUR_URL';
//
// LEAD SOURCES THAT LOG HERE:
// • Hero Scanner gate (name/phone/email + roof data)
// • Homepage Calculator gate (name/phone/email + calculator inputs)
// • Homepage Satellite Scanner gate (name/phone/email + roof data)
// • Hero Contact Form ("Request a Call" tab)
// • Main Contact Form (bottom of page)
// • Estimate Page Scanner gate (name/phone/email + roof data)
// • Estimate Page Final Results (full estimate details)
//
// UPDATING THE SCRIPT:
// If you change the script later, redeploy:
//   Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy
// ============================================================

function doPost(e) {
  try {
    var ss = SpreadsheetApp.openById('104eRKTGyx58zzWKwrQpoq-98VDaac5cq8LMc_mbzXEo');
    var sheet = ss.getSheetByName('Leads') || ss.getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date().toLocaleString('en-US', { timeZone: 'America/Denver' }),  // A: Timestamp
      data.source         || '',   // B: Source
      data.name           || '',   // C: Name
      data.phone          || '',   // D: Phone
      data.email          || '',   // E: Email
      data.address        || '',   // F: Address
      data.zip            || '',   // G: ZIP
      data.roofSize       || '',   // H: Roof Size
      data.pitch          || '',   // I: Pitch
      data.complexity     || '',   // J: Complexity
      data.material       || '',   // K: Material
      data.estimatedCost  || '',   // L: Estimated Cost
      data.serviceType    || '',   // M: Service Type
      data.urgency        || '',   // N: Urgency
      data.contactPref    || '',   // O: Contact Pref
      data.message        || '',   // P: Message
      data.lat            || '',   // Q: Latitude
      data.lng            || ''    // R: Longitude
    ]);

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
