/**
 * Cherry Coaching Survey — Google Apps Script
 *
 * Setup:
 *   1. Open the Google Sheet where you want responses stored.
 *   2. Extensions → Apps Script → paste this entire file.
 *   3. Deploy → New deployment → Web app.
 *      - Execute as: Me
 *      - Who has access: Anyone
 *   4. Copy the deployment URL and paste it into your .env file:
 *        VITE_APPS_SCRIPT_URL=<your deployment URL>
 *   5. On every code change you must create a NEW deployment version —
 *      editing the script alone does NOT update the live URL.
 *
 * The first submission creates the header row automatically.
 * Subsequent submissions match against the existing headers so columns
 * stay aligned even if the survey changes over time.
 */

var SHEET_NAME = "Responses";

var SCALE_LABELS = ["Not useful", "Nice to have", "Useful", "Essential"];

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    var data = JSON.parse(e.postData.contents);
    var name = data.name || "";
    var answers = data.answers || {};
    var submittedAt = data.submittedAt || new Date().toISOString();

    // Flatten nested answer structures into a single key→string map
    var flat = flattenAnswers(answers);

    var isFirstRow = sheet.getLastRow() === 0;

    if (isFirstRow) {
      // Build headers from this first submission
      var headers = ["submitted_at", "name"].concat(Object.keys(flat));
      sheet.appendRow(headers);
    }

    // Read existing headers (row 1) and map to values
    var existingHeaders = sheet
      .getRange(1, 1, 1, sheet.getLastColumn())
      .getValues()[0];

    var row = existingHeaders.map(function (h) {
      if (h === "submitted_at") return submittedAt;
      if (h === "name") return name;
      return flat[h] !== undefined ? flat[h] : "";
    });

    // Append any new keys not yet in the header row
    var newKeys = Object.keys(flat).filter(function (k) {
      return existingHeaders.indexOf(k) === -1;
    });
    if (newKeys.length > 0) {
      var lastCol = sheet.getLastColumn();
      newKeys.forEach(function (k, i) {
        sheet.getRange(1, lastCol + i + 1).setValue(k);
        row.push(flat[k]);
      });
    }

    sheet.appendRow(row);

    return ContentService.createTextOutput(
      JSON.stringify({ success: true })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: err.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function flattenAnswers(answers) {
  var flat = {};

  Object.keys(answers).forEach(function (key) {
    var val = answers[key];

    if (val === null || val === undefined) {
      flat[key] = "";
    } else if (Array.isArray(val)) {
      // Multi-select: join with pipe
      flat[key] = val.join(" | ");
    } else if (typeof val === "object" && val.__other !== undefined) {
      // Single-select "other" fill-in
      flat[key] = "Other: " + (val.__other || "");
    } else if (typeof val === "object") {
      // Importance grid: expand each sub-item as its own column
      Object.keys(val).forEach(function (subKey) {
        var idx = val[subKey];
        flat[subKey] = typeof idx === "number" ? SCALE_LABELS[idx] || idx : idx;
      });
    } else {
      flat[key] = val;
    }
  });

  return flat;
}

// Allows testing the script manually in the Apps Script editor
function testDoPost() {
  var mockEvent = {
    postData: {
      contents: JSON.stringify({
        name: "Test User",
        submittedAt: new Date().toISOString(),
        answers: {
          programming_structure: "Monthly programming with workouts assigned to specific days",
          program_delivery: ["Google Sheets or spreadsheet"],
          reference_during: "Phone — I keep it open on screen",
          hardest_part: "Finding last week's session",
          feature_value: {
            fi_program_view: 3,
            fi_log: 2,
            fi_history: 1,
          },
        },
      }),
    },
  };
  var result = doPost(mockEvent);
  Logger.log(result.getContent());
}
