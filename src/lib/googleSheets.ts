import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User,
  signOut
} from 'firebase/auth';
import type { TeacherRecord } from '../types';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Configure Google Auth Provider with Scopes
export const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/spreadsheets');
provider.addScope('https://www.googleapis.com/auth/drive.file');

let cachedAccessToken: string | null = null;
let isSigningIn = false;

// Initialize auth state listener
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else {
        // Since Firebase SDK v9+ onAuthStateChanged triggers on fresh load, if token isn't cached yet,
        // we might not have the access token unless the user signs in with popup,
        // but we can try to retrieve it if stored or signal for login
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Sign in via Google Popup
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Google Auth');
    }
    cachedAccessToken = credential.accessToken;
    // Store temporarily in sessionStorage for seamless tab-restore (cleared on logout)
    sessionStorage.setItem('GS_OAUTH_TOKEN', cachedAccessToken);
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Core Google Sign-in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

// Retrieve Token (check cache first, then sessionStorage fallback)
export const getAccessToken = async (): Promise<string | null> => {
  if (!cachedAccessToken) {
    cachedAccessToken = sessionStorage.getItem('GS_OAUTH_TOKEN');
  }
  return cachedAccessToken;
};

// Google Account Logout
export const logoutGoogle = async () => {
  await signOut(auth);
  cachedAccessToken = null;
  sessionStorage.removeItem('GS_OAUTH_TOKEN');
};

/**
 * Lists the Google Sheets spreadsheets from Google Drive
 */
export async function listSpreadsheets(accessToken: string): Promise<{ id: string; name: string }[]> {
  try {
    const q = encodeURIComponent("mimeType='application/vnd.google-apps.spreadsheet' and trashed=false");
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${q}&orderBy=modifiedTime desc&pageSize=15`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        }
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to list spreadsheets: ${response.statusText} (${errorText})`);
    }
    
    const resPayload = await response.json();
    return (resPayload.files || []).map((f: any) => ({
      id: f.id,
      name: f.name
    }));
  } catch (err) {
    console.error('Error listing spreadsheets:', err);
    throw err;
  }
}

/**
 * Creates a brand new Google Spreadsheet with default styled headers for Teacher records
 */
export async function createTeacherSpreadsheet(accessToken: string, titleName: string): Promise<string> {
  try {
    // 1. Create Spreadsheet
    const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          title: titleName,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to create spreadsheet: ${response.statusText}`);
    }

    const sheetInfo = await response.json();
    const spreadsheetId = sheetInfo.spreadsheetId;
    if (!spreadsheetId) {
      throw new Error('Spreadsheet ID missing from creation response');
    }

    // 2. Write headers immediately
    await writeTeachersToSheet(accessToken, spreadsheetId, []);
    return spreadsheetId;
  } catch (err) {
    console.error('Error creating spreadsheet:', err);
    throw err;
  }
}

/**
 * Writes the whole list of Teacher Records into the specified Spreadsheet
 */
export async function writeTeachersToSheet(
  accessToken: string, 
  spreadsheetId: string, 
  teachers: TeacherRecord[]
): Promise<void> {
  try {
    // Build Cambodian date time for tracking inside spreadsheet
    const formattedNow = new Date().toLocaleString('kh-KH', { timeZone: 'Asia/Phnom_Penh' });
    
    const headerRow = [
      "ល.រ (No)",
      "ឈ្មោះគ្រូ (Teacher Name)",
      "ភេទ (Gender)",
      "ស្ថានភាព AM (AM Status)",
      "ម៉ោងចូល AM (Time-In AM)",
      "ទីតាំង AM (Location AM)",
      "ហត្ថលេខា AM (AM Signature)",
      "ម៉ោងចេញ AM (Time-Out AM)",
      "ហត្ថលេខាចេញ AM (AM End-Signature)",
      "ស្ថានភាព PM (PM Status)",
      "ម៉ោងចូល PM (Time-In PM)",
      "ទីតាំង PM (Location PM)",
      "ហត្ថលេខា PM (PM Signature)",
      "ម៉ោងចេញ PM (Time-Out PM)",
      "ហត្ថលេខាចេញ PM (PM End-Signature)",
      "សម្គាល់ (Remarks)"
    ];

    const dataRows = teachers.map(t => [
      t.no,
      t.name,
      t.gender,
      t.statusAM || t.status || "វត្តមាន",
      t.timeInAM || t.timeIn || "",
      t.locationInAM || "",
      t.signatureInAM ? "✓ មានស្នាមមេដៃ/ហត្ថលេខា" : "-",
      t.timeOutAM || t.timeOut || "",
      t.signatureOutAM ? "✓ មានស្នាមមេដៃ/ហត្ថលេខា" : "-",
      t.statusPM || "",
      t.timeInPM || "",
      t.locationInPM || "",
      t.signatureInPM ? "✓ មានស្នាមមេដៃ/ហត្ថលេខា" : "-",
      t.timeOutPM || "",
      t.signatureOutPM ? "✓ មានស្នាមមេដៃ/ហត្ថលេខា" : "-",
      t.remarks || ""
    ]);

    const titleRows = [
      ["របាយការណ៍បូកសរុបវត្តមានលោកគ្រូអ្នកគ្រូប្រចាំថ្ងៃ"],
      [`ធ្វើបច្ចុប្បន្នភាពចុងក្រោយ៖ ${formattedNow}`],
      [], // Empty row separator
    ];

    const finalValues = [
      ...titleRows,
      headerRow,
      ...dataRows
    ];

    // Clear the existing content first
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:P1000:clear`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }
    });

    // Write all new values
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          range: 'Sheet1!A1',
          majorDimension: 'ROWS',
          values: finalValues,
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Failed to write values: ${response.statusText} (${errText})`);
    }

    // Format headers to look highly professional
    await formatSpreadsheetStyle(accessToken, spreadsheetId, finalValues.length);
  } catch (err) {
    console.error('Error writing values to Sheet:', err);
    throw err;
  }
}

/**
 * Apply beautiful visual styling to the Google Sheet structure dynamically
 */
async function formatSpreadsheetStyle(
  accessToken: string, 
  spreadsheetId: string, 
  totalRows: number
): Promise<void> {
  try {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          // Resize row and columns
          {
            updateSheetProperties: {
              properties: {
                sheetId: 0,
                gridProperties: {
                  frozenRowCount: 4,
                  frozenColumnCount: 2,
                }
              },
              fields: 'gridProperties.frozenRowCount,gridProperties.frozenColumnCount'
            }
          },
          // Merge Title row
          {
            mergeCells: {
              range: {
                sheetId: 0,
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 0,
                endColumnIndex: 11
              },
              mergeType: 'MERGE_ALL'
            }
          },
          // Format Title TextStyle
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 0,
                endColumnIndex: 11
              },
              cell: {
                userEnteredFormat: {
                  horizontalAlignment: 'CENTER',
                  verticalAlignment: 'MIDDLE',
                  textFormat: {
                    fontSize: 16,
                    bold: true,
                    foregroundColor: { red: 0.1, green: 0.15, blue: 0.3 }
                  }
                }
              },
              fields: 'userEnteredFormat(horizontalAlignment,verticalAlignment,textFormat)'
            }
          },
          // Format Timestamp
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startRowIndex: 1,
                endRowIndex: 2,
                startColumnIndex: 0,
                endColumnIndex: 11
              },
              cell: {
                userEnteredFormat: {
                  horizontalAlignment: 'CENTER',
                  textFormat: {
                    fontSize: 10,
                    italic: true,
                    foregroundColor: { red: 0.4, green: 0.4, blue: 0.4 }
                  }
                }
              },
              fields: 'userEnteredFormat(horizontalAlignment,textFormat)'
            }
          },
          // Format Column Headers (Blue-indigo theme)
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startRowIndex: 3,
                endRowIndex: 4,
                startColumnIndex: 0,
                endColumnIndex: 16
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 0.9, green: 0.93, blue: 0.98 },
                  horizontalAlignment: 'CENTER',
                  verticalAlignment: 'MIDDLE',
                  textFormat: {
                    fontSize: 11,
                    bold: true,
                    foregroundColor: { red: 0.05, green: 0.15, blue: 0.35 }
                  },
                  borders: {
                    bottom: { style: 'DOUBLE', width: 2, color: { red: 0.2, green: 0.3, blue: 0.6 } },
                    top: { style: 'SOLID', width: 1, color: { red: 0.8, green: 0.8, blue: 0.8 } }
                  }
                }
              },
              fields: 'userEnteredFormat(backgroundColor,horizontalAlignment,verticalAlignment,textFormat,borders)'
            }
          },
          // Format Data Cells (Borders and text alignment)
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startRowIndex: 4,
                endRowIndex: totalRows + 1,
                startColumnIndex: 0,
                endColumnIndex: 16
              },
              cell: {
                userEnteredFormat: {
                  verticalAlignment: 'MIDDLE',
                  textFormat: {
                    fontSize: 10,
                  },
                  borders: {
                    bottom: { style: 'SOLID', width: 1, color: { red: 0.9, green: 0.9, blue: 0.9 } },
                    left: { style: 'SOLID', width: 1, color: { red: 0.95, green: 0.95, blue: 0.95 } },
                    right: { style: 'SOLID', width: 1, color: { red: 0.95, green: 0.95, blue: 0.95 } }
                  }
                }
              },
              fields: 'userEnteredFormat(verticalAlignment,textFormat,borders)'
            }
          }
        ]
      })
    });
    
    if (!response.ok) {
      console.warn('Styling update request unsuccessful:', response.statusText);
    }
  } catch (err) {
    console.error('Error applying layout styles to spreadsheet:', err);
  }
}
