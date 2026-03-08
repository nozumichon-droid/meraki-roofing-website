// ============================================================
// MERAKI ROOFING — Google Apps Script (Free Lead Tracker)
// ============================================================
//
// SETUP INSTRUCTIONS:
// 1. Go to https://sheets.google.com and create a new spreadsheet
// 2. Name it "Meraki Roofing — Address Leads"
// 3. In Row 1, add these headers:
//    A1: Timestamp | B1: Address | C1: Latitude | D1: Longitude
//    E1: Roof Size (sqft) | F1: Pitch | G1: Complexity | H1: Source Page
//    I1: Estimated Cost | J1: City | K1: State | L1: Name | M1: Phone | N1: Email
//
// 4. Click Extensions → Apps Script
// 5. Delete the default code and paste EVERYTHING below
// 6. Click Deploy → New deployment
// 7. Select type: "Web app"
// 8. Set "Execute as": Me
// 9. Set "Who has access": Anyone
// 10. Click Deploy and copy the Web App URL
// 11. Paste that URL into your website code where it says GOOGLE_SHEET_WEBHOOK_URL
//
// That's it! Every address entry will auto-append as a new row.
// ============================================================

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Append a new row with the lead data
    sheet.appendRow([
      new Date().toLocaleString('en-US', { timeZone: 'America/Denver' }), // Timestamp (Mountain Time)
      data.address || '',
      data.lat || '',
      data.lng || '',
      data.roofSize || '',
      data.pitch || '',
      data.complexity || '',
      data.source || '',
      data.estimatedCost || '',
      data.city || '',
      data.state || '',
      data.name || '',
      data.phone || '',
      data.email || ''
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

// Handle GET requests (for testing — visit the URL in your browser to verify it's live)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Meraki Roofing lead tracker is running.' }))
    .setMimeType(ContentService.MimeType.JSON);
}
