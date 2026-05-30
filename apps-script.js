// ============================================================
// ערב היכרות · מובילי חינוך — Google Apps Script
// ============================================================
// הוראות:
// 1. פתחי את הגוגל שיט
// 2. Extensions → Apps Script
// 3. מחקי את כל הקוד הקיים והדבקי את זה
// 4. שמרי (Ctrl+S)
// 5. Deploy → New deployment → Web app
//    - Execute as: Me
//    - Who has access: Anyone
// 6. לחצי Deploy, אשרי הרשאות
// 7. העתיקי את ה-Web App URL והחליפי בקוד ה-HTML
// ============================================================

const SHEET_NAME = "הרשמות";   // שם הגיליון — שנה אם שונה
const SPREADSHEET_ID = "1o-Q39-ZgPch8qMjFXo8u_fnCLLw5SQw75ZaII7dbwyg";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      // כותרות
      sheet.appendRow([
        "תאריך הרשמה",
        "שם מלא",
        "טלפון",
        "אימייל",
        "מספר משתתפים",
        "מאשר עדכונים"
      ]);
      sheet.getRange(1, 1, 1, 6).setFontWeight("bold");
    }

    sheet.appendRow([
      new Date().toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" }),
      data.name    || "",
      data.phone   || "",
      data.email   || "",
      data.count   || "",
      data.consent ? "כן" : "לא"
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// בדיקה ידנית מה-Apps Script editor
function testPost() {
  const mock = {
    postData: {
      contents: JSON.stringify({
        name: "ישראלה ישראלי",
        phone: "050-1234567",
        email: "test@example.com",
        count: "2",
        consent: true
      })
    }
  };
  const result = doPost(mock);
  Logger.log(result.getContent());
}
