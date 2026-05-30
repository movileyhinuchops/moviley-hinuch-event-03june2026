const SHEET_NAME = "הרשמות";
const SPREADSHEET_ID = "1o-Q39-ZgPch8qMjFXo8u_fnCLLw5SQw75ZaII7dbwyg";

function doPost(e) {
  try {
    const data = e.parameter;
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(["תאריך הרשמה","שם מלא","טלפון","אימייל","מספר משתתפים","מאשר עדכונים"]);
      sheet.getRange(1, 1, 1, 6).setFontWeight("bold");
    }

    sheet.appendRow([
      new Date().toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" }),
      data.name    || "",
      data.phone   || "",
      data.email   || "",
      data.count   || "",
      data.consent === "true" ? "כן" : "לא"
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

function testPost() {
  const mock = { parameter: { name: "ישראלה ישראלי", phone: "050-1234567", email: "test@example.com", count: "2", consent: "true" } };
  const result = doPost(mock);
  Logger.log(result.getContent());
}
