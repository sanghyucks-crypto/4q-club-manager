import { google } from "googleapis";
import { readFileSync } from "fs";

const SPREADSHEET_ID = "1x3DnrKD37bHLOfbkUyiSoUaD2JyGwzbIferynS51ivk";
const SHEET_NAME = "4q_data";
const CRED_PATH = "/Users/jeongsanghyeog/Downloads/drive-mcp-projectmy-project-4410f777f757.json";

const credentials = JSON.parse(readFileSync(CRED_PATH, "utf8"));
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const DEFAULT_CLUBS = [
  {status:'active',name:'AI 배우기',icon:'💻',color:'#4F6EFF',bg:'#EEF2FF',leader:'권용구',purpose:'초보부터 앱 만들기까지',location:'미정',schedule:'일요일 16:00',frequency:'격주',note:'임시 동아리장',manager:'',members:['권용구','김대철','김숙영','박혜주','양윤정','우희경','윤혜진','이시화']},
  {status:'active',name:'분당우리밴드',icon:'🎸',color:'#7C3AED',bg:'#F5F3FF',leader:'이지원',purpose:'악기 레슨, 음악회, 재능기부',location:'미정',schedule:'토요일 13:00',frequency:'격주',note:'기타(Guitar) 동아리 통합',manager:'',members:['이지원','김대철','김숙영','이지혜']},
  {status:'active',name:'산으로 가는 믿음',icon:'⛰️',color:'#059669',bg:'#ECFDF5',leader:'채정호',purpose:'등산으로 체력증진',location:'국내산',schedule:'토요일',frequency:'월 1회',note:'임시 동아리장',manager:'',members:['채정호','권용구','김지연','신기현','양윤정','윤혜진','우희경','이은주','정민협','홍영민']},
  {status:'active',name:'선한 손길',icon:'🤝',color:'#DB2777',bg:'#FDF2F8',leader:'채정호',purpose:'봉사 및 선한 영향력 퍼뜨리기',location:'드림센터 1층',schedule:'토요일 오전',frequency:'월 1회',note:'콩알 동아리 통합',manager:'',members:['채정호','배경진','홍영민']},
  {status:'active',name:'액티풀 라이프',icon:'⚡',color:'#D97706',bg:'#FFFBEB',leader:'홍영민',purpose:'체력증진과 스트레스 해소',location:'드림센터 1층',schedule:'둘째주 토요일 14:00',frequency:'월 1회',note:'빛과 이야기, 은혜스매시 등 다수 통합',manager:'',members:['홍영민','구희원','김대철','김숙영','김원태','김정훈','박혜주','손혜성','양윤정','연규민','우희경','윤일묵','이민아','이시화','이은빈','이종환','정삼용','최명진','최지원','채정호','황인영']},
  {status:'active',name:'카/공/차/밥',icon:'☕',color:'#92400E',bg:'#FEF3C7',leader:'윤일묵',purpose:'공부·독서·작업 후 같이 식사',location:'서현 카페',schedule:'토요일 13:00~17:30',frequency:'월 1~2회',note:'',manager:'',members:['윤일묵','김대철','배주원','조용민']},
  {status:'active',name:'큐티&말씀암송',icon:'📖',color:'#B45309',bg:'#FFFBEB',leader:'이민아',purpose:'묵상 나눔과 교제로 말씀 암송',location:'드림센터 1층',schedule:'토요일 10:00',frequency:'격주',note:'동아리 통합',manager:'',members:['이민아','박수경','박영인']},
  {status:'active',name:'런포티',icon:'🏃',color:'#DC2626',bg:'#FEF2F2',leader:'미정',purpose:'초보 러닝, 5km 마라톤 도전',location:'분당',schedule:'평일 저녁 19:00 이후',frequency:'주 2회 이상',note:'확인 필요',manager:'',members:['김정훈']},
  {status:'active',name:'에어워커 (농구)',icon:'🏀',color:'#0284C7',bg:'#F0F9FF',leader:'미정',purpose:'1청~4청 연합 동아리',location:'동천동 실내체육관',schedule:'마지막주 토요일 20:00',frequency:'월 1회',note:'연합 동아리 인계',manager:'',members:['박영인']},
  {status:'active',name:'독서모임',icon:'📚',color:'#0F766E',bg:'#F0FDFA',leader:'정상혁',purpose:'독서를 통한 교제',location:'미정',schedule:'미정',frequency:'미정',note:'',manager:'',members:['김지연','홍지윤','강선배','김민주','김신영','장시연','표명석','채정호','김상미','김신애','서미라','손혜성','윤주혜','김미진','허진선','조은교','신기현','우희경','이민아','최주영','전소현']},
  {status:'preparing',name:'카페인과 은혜 사이',icon:'☕',color:'#C2410C',bg:'#FFF7ED',leader:'미정',purpose:'카페 탐방 및 교제',location:'미정',schedule:'미정',frequency:'미정',note:'',manager:'',members:[]},
  {status:'preparing',name:'은혜로운 식탁',icon:'🍜',color:'#D97706',bg:'#FFFBEB',leader:'미정',purpose:'맛집 탐방 및 교제',location:'미정',schedule:'미정',frequency:'미정',note:'',manager:'',members:[]},
  {status:'preparing',name:'멍 동아리',icon:'🌳',color:'#16A34A',bg:'#F0FDF4',leader:'미정',purpose:'자연에서 쉬며 교제',location:'미정',schedule:'미정',frequency:'미정',note:'',manager:'',members:[]},
  {status:'preparing',name:'워킹 위드 갓',icon:'👣',color:'#0369A1',bg:'#E0F2FE',leader:'미정',purpose:'함께 산책하며 교제',location:'미정',schedule:'미정',frequency:'미정',note:'',manager:'',members:[]},
  {status:'preparing',name:'우리랜드',icon:'🎲',color:'#6D28D9',bg:'#EDE9FE',leader:'미정',purpose:'보드게임으로 함께 교제',location:'미정',schedule:'미정',frequency:'미정',note:'',manager:'',members:[]},
];

const DEFAULT_ADMINS = [
  {name:'정상혁', pw:'2004', role:'방장'},
  {name:'김지숙', pw:'0000', role:'부방장'},
];

async function setup() {
  const authClient = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: authClient });

  // 시트 목록 확인 후 없으면 생성
  const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const exists = meta.data.sheets.some(s => s.properties.title === SHEET_NAME);

  if (!exists) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [{ addSheet: { properties: { title: SHEET_NAME } } }],
      },
    });
    console.log(`✅ "${SHEET_NAME}" 시트 생성 완료`);
  } else {
    console.log(`ℹ️  "${SHEET_NAME}" 시트 이미 존재 — 데이터 덮어쓰기`);
  }

  const rows = [
    ['clubs',          JSON.stringify(DEFAULT_CLUBS)],
    ['admins',         JSON.stringify(DEFAULT_ADMINS)],
    ['customMembers',  JSON.stringify({})],
    ['pendingMembers', JSON.stringify([])],
    ['pendingClubReqs',JSON.stringify([])],
    ['approvalLog',    JSON.stringify([])],
    ['appPeriod',      JSON.stringify({ start: '', end: '' })],
  ];

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A1:B7`,
    valueInputOption: 'RAW',
    requestBody: { values: rows },
  });

  console.log("✅ 초기 데이터 입력 완료");
  console.log(`🔗 https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`);
}

setup().catch(console.error);
