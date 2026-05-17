const { google } = require('googleapis');

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAME = '4q_data';
const DATA_KEYS = ['clubs','admins','customMembers','pendingMembers','pendingClubReqs','approvalLog','appPeriod'];

function getAuth() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

const HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: HEADERS, body: '' };
  }

  if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON || !SPREADSHEET_ID) {
    return {
      statusCode: 503,
      headers: HEADERS,
      body: JSON.stringify({ error: '환경 변수가 설정되지 않았습니다.' }),
    };
  }

  try {
    const auth = getAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    if (event.httpMethod === 'GET') {
      let rows = [];
      try {
        const res = await sheets.spreadsheets.values.get({
          spreadsheetId: SPREADSHEET_ID,
          range: `${SHEET_NAME}!A1:B${DATA_KEYS.length}`,
        });
        rows = res.data.values || [];
      } catch (e) {
        // 시트가 없으면 빈 데이터 반환
        if (e.message && e.message.includes('Unable to parse range')) {
          return { statusCode: 200, headers: HEADERS, body: JSON.stringify({}) };
        }
        throw e;
      }

      const data = {};
      rows.forEach(row => {
        if (row[0] && row[1] !== undefined) {
          try { data[row[0]] = JSON.parse(row[1]); } catch {}
        }
      });
      return { statusCode: 200, headers: HEADERS, body: JSON.stringify(data) };
    }

    if (event.httpMethod === 'POST') {
      const { key, value } = JSON.parse(event.body || '{}');
      const rowIdx = DATA_KEYS.indexOf(key);
      if (rowIdx === -1) {
        return { statusCode: 400, headers: HEADERS, body: JSON.stringify({ error: 'Invalid key' }) };
      }
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A${rowIdx + 1}:B${rowIdx + 1}`,
        valueInputOption: 'RAW',
        requestBody: { values: [[key, JSON.stringify(value)]] },
      });
      return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ ok: true }) };
    }

    return { statusCode: 405, headers: HEADERS, body: JSON.stringify({ error: 'Method not allowed' }) };
  } catch (err) {
    console.error('Function error:', err);
    return { statusCode: 500, headers: HEADERS, body: JSON.stringify({ error: err.message }) };
  }
};
