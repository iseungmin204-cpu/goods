// 대구경북지방중소벤처기업청 소개 웹 앱 스크립트

document.addEventListener('DOMContentLoaded', () => {
  // 1. [핵심] 국민 맞춤 혜택 진단 설문 / 체크리스트 기능
  initDiagnosisSurvey();

  // 2. 주요 업무 탭 전환 기능
  initDutyTabs();

  // 3. 간이 맞춤 지원 선택기 (하단)
  initQuickChecker();

  // 4. 네비게이션 스크롤 효과
  initNavScrollEffect();
});

/**
 * -------------------------------------------------------------
 * 1. "나는 이 기관으로부터 어떤 도움을 받을 수 있을까?"
 *    맞춤 혜택 진단 설문 & 체크리스트 엔진
 * -------------------------------------------------------------
 */

// 체크리스트 항목별 상세 매핑 데이터
const benefitDatabase = {
  funding: {
    title: '저금리 정책자금 융자 및 신용보증 지원',
    dept: '기업환경개선과 / 소상공인시장진흥공단 / 신용보증재단',
    icon: 'fa-solid fa-won-sign',
    desc: '고금리로 인한 금융비용 부담을 줄일 수 있도록 최대 1억원 한도의 긴급경영안정자금 및 특례보증 저리 대출을 연계해 드립니다.',
    steps: [
      '소상공인시장진흥공단(SEMAS) 또는 중소벤처기업진흥공단 정책자금 신청',
      '신용보증재단/신용보증기금 방문 후 특별보증서 발급',
      '시중 은행 연계 저금리 대출 실행'
    ],
    linkText: '소상공인 정책자금 신청 바로가기',
    url: 'https://ols.semas.or.kr'
  },
  debt_crisis: {
    title: '소상공인 채무조정 & 임대차 분쟁 무료 법률 케어',
    dept: '지역정책과 / 소진공 대구경북지역본부 / 한국부동산원',
    icon: 'fa-solid fa-hand-holding-heart',
    desc: '대경중기청의 "소상공인 경영위기 극복 종합상담회"를 통해 새출발기금 채무조정, 임대료 분쟁 법률 무료 상담, 폐업·재도전 장려금을 원스톱으로 지원합니다.',
    steps: [
      '대구·경북 순회 "경영위기 극복 종합상담회" 1:1 현장 접수',
      '한국부동산원 전문 변호사의 상가임대차 무료 법률 상담 진행',
      '새출발기금 및 서민금융진흥원 채무 재조정 솔루션 제공'
    ],
    linkText: '대경중기청 행사공고 확인하기',
    url: 'https://www.mss.go.kr/site/daegu/ex/bbs/List.do?cbIdx=132'
  },
  smart_store: {
    title: '소상공인 스마트상점 기술 보급 지원사업',
    dept: '소상공인과 / 소진공',
    icon: 'fa-solid fa-tablet-screen-button',
    desc: '매장 내 키오스크, 무인 테이블오더, 전자메뉴판, AI 바리스타 로봇 등 최신 디지털 기기 도입비용을 최대 70%(최대 500만~1,500만원) 국비 지원합니다.',
    steps: [
      '스마트상점 기술보급사업 공식 사이트 회원가입',
      '점포에 필요한 스마트 기술(키오스크/테이블오더 등) 선택 및 신청서 제출',
      '선정 후 기기 설치 및 국비 보조금 정산'
    ],
    linkText: '스마트상점 사업 안내',
    url: 'https://www.sbiz.or.kr/smst/index.do'
  },
  startup_package: {
    title: '창업 패키지(예비·초기) 사업화 자금 및 보육센터 입주',
    dept: '창업성장지원과 (053-659-2280)',
    desc: '예비창업자 및 7년 미만 스타트업에 최대 1억원의 무상 사업화 자금, 대경권 창업보육센터(BI) 독립 사무공간, 벤처투자 IR 데모데이를 연계 지원합니다.',
    steps: [
      'K-Startup(k-startup.go.kr)에서 예비·초기창업패키지 정기공고 확인',
      '사업계획서 작성 및 온라인 과제 접수',
      '서류·발표 심사 통과 후 바우처 자금 교부 및 멘토링 매칭'
    ],
    linkText: 'K-Startup 사업공고 바로가기',
    url: 'https://www.k-startup.go.kr'
  },
  smart_factory_ai: {
    title: '제조 AI 실무 무료 교육 & 스마트공장 보급',
    dept: '제품성능기술과 (053-659-2270)',
    desc: '지역 제조기업 재직자를 위한 현장 밀착형 생성형 AI/데이터 활용 무료 교육을 제공하고, 생산공정 자동화(스마트공장) 도입비용의 최대 50%를 보조합니다.',
    steps: [
      '대경중기청 주관 재직자 AI 활용 교육 참가 신청',
      '스마트제조혁신추진단 스마트공장 구축 지원사업 신청서 접수',
      '전문 코디네이터 현장 방문 지도 및 자동화 설비 도입'
    ],
    linkText: '스마트공장 사업관리시스템',
    url: 'https://www.smart-factory.kr'
  },
  public_procure: {
    title: '공공기관 우선구매 직접생산확인 및 판로 개척',
    dept: '공공판로지원과 (053-659-2240)',
    desc: '공공기관이 제품을 의무적으로 구매하도록 하는 공공조달 자격을 부여하며, 중소기업 확인서 및 직접생산확인증명서 실태조사를 신속히 승인합니다.',
    steps: [
      '공공구매종합정보망(SMPP) 회원가입 및 직접생산확인 신청',
      '대경중기청 실태조사원 현장 공장 검사 통과 및 증명서 발급',
      '나라장터 입찰 참가 및 지역 공공기관 구매상담회 매칭'
    ],
    linkText: '공공구매종합정보망(SMPP)',
    url: 'https://www.smpp.go.kr'
  },
  export_voucher: {
    title: '글로벌 수출바우처 & 해외 진출 지원',
    dept: '공공판로지원과 (053-659-2240)',
    desc: '수출을 희망하는 기업에 최대 1억원 바우처를 지급하여 해외 규격인증 획득, 해외 마케팅, 통번역, 글로벌 전시회 부스비를 바우처 형태로 자유롭게 집행하도록 돕습니다.',
    steps: [
      '수출지원포털(exportcenter.go.kr) 수출바우처 사업 신청',
      '수출역량 평가 및 바우처 포인트 교부',
      '원하는 해외 마케팅 수행기관 서비스 선택 및 정산'
    ],
    linkText: '수출지원기반활용(수출바우처)',
    url: 'https://www.exportvoucher.com'
  },
  legal_ombudsman: {
    title: '1:1 무료 법률·세무·노무 상담 & 중소기업 옴부즈만',
    dept: '지역정책과 / 1357 콜센터',
    desc: '변호사, 세무사, 공인노무사, 관세사 등 1급 전문가로 구성된 비즈니스지원단이 현장 방문 무료 컨설팅을 제공하며, 기업을 옥죄는 불합리한 지방 규제를 개선합니다.',
    steps: [
      '국번 없이 1357 전화 또는 대경중기청 고객민원실 방문',
      '전문가 1:1 매칭 상담 및 현장클리닉(전문가 심층 자문)',
      '지자체 조례 및 중앙부처 인허가 킬러 규제 개선 건의'
    ],
    linkText: '대경중기청 비즈니스지원단 안내',
    url: 'https://www.mss.go.kr/site/daegu/ex/bbs/List.do?cbIdx=132'
  }
};

// 신분별 기본 추천 안내
const roleNames = {
  citizen: '일반 국민 / 청년 / 취업준비생',
  smallbiz: '소상공인 / 자영업자 / 전통시장 상인',
  startup: '예비창업자 / 초기 스타트업',
  sme: '중소·제조기업 대표 및 재직자'
};

function initDiagnosisSurvey() {
  const submitBtn = document.getElementById('submitSurveyBtn');
  const resetBtn = document.getElementById('resetSurveyBtn');
  const form = document.getElementById('diagnosisForm');
  const resultReport = document.getElementById('surveyResultReport');

  if (!submitBtn || !form) return;

  submitBtn.addEventListener('click', () => {
    // 1. 선택한 사용자 역할
    const roleRadio = form.querySelector('input[name="userRole"]:checked');
    const roleValue = roleRadio ? roleRadio.value : 'citizen';
    const roleTitle = roleNames[roleValue];

    // 2. 체크한 고민 목록
    const checkedBoxes = Array.from(form.querySelectorAll('input[name="needs"]:checked'));
    const checkedValues = checkedBoxes.map(cb => cb.value);

    // 아무것도 체크하지 않은 경우 기본 안내
    let selectedBenefits = [];
    if (checkedValues.length === 0) {
      // 신분별 기본 추천 세팅
      if (roleValue === 'citizen') selectedBenefits = ['startup_package', 'legal_ombudsman'];
      else if (roleValue === 'smallbiz') selectedBenefits = ['funding', 'debt_crisis', 'smart_store'];
      else if (roleValue === 'startup') selectedBenefits = ['startup_package', 'funding', 'export_voucher'];
      else if (roleValue === 'sme') selectedBenefits = ['smart_factory_ai', 'public_procure', 'funding'];
    } else {
      selectedBenefits = checkedValues;
    }

    // 결과 HTML 생성
    renderSurveyReport(roleTitle, selectedBenefits, checkedValues.length === 0);
  });

  resetBtn.addEventListener('click', () => {
    form.reset();
    resultReport.classList.add('hidden');
    resultReport.innerHTML = '';
  });
}

function renderSurveyReport(roleTitle, benefitKeys, isDefaultRecommendation) {
  const resultReport = document.getElementById('surveyResultReport');

  const benefitCardsHtml = benefitKeys.map(key => {
    const item = benefitDatabase[key];
    if (!item) return '';

    const stepsListHtml = item.steps.map(step => `<li>${step}</li>`).join('');

    return `
      <div class="benefit-card">
        <div class="benefit-card-top">
          <h4><i class="${item.icon}"></i> ${item.title}</h4>
          <span class="benefit-dept-badge">${item.dept}</span>
        </div>
        <p class="benefit-desc">${item.desc}</p>
        <div class="action-flow-box">
          <strong><i class="fa-solid fa-list-ol"></i> 신청 및 지원 절차 3단계:</strong>
          <ol>
            ${stepsListHtml}
          </ol>
        </div>
        <div>
          <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="benefit-apply-link">
            ${item.linkText} <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
        </div>
      </div>
    `;
  }).join('');

  resultReport.innerHTML = `
    <div class="report-header">
      <div class="report-title-area">
        <h3><i class="fa-solid fa-file-invoice" style="color: #0d5c63; margin-right: 8px;"></i> [진단 완료] 고객님을 위한 대경중기청 맞춤 혜택 리포트</h3>
        <p>선택하신 조건에 맞춰 당장 신청하시거나 혜택을 받을 수 있는 최적의 지원사업 목록입니다.</p>
      </div>
      <div>
        <span class="user-badge-tag"><i class="fa-solid fa-user-check"></i> ${roleTitle}</span>
      </div>
    </div>

    ${isDefaultRecommendation ? `
      <div style="background: #eef7f8; border-left: 4px solid #17838d; padding: 0.9rem 1.2rem; border-radius: 4px; margin-bottom: 1.5rem; font-size: 0.9rem; color: #083b40;">
        <i class="fa-solid fa-circle-info"></i> <strong>알림:</strong> 체크 항목을 별도로 선택하지 않으셔서, <strong>${roleTitle}</strong> 회원분들이 가장 많이 신청하시는 대표 핵심 혜택을 추천해 드립니다.
      </div>
    ` : ''}

    <div class="benefit-card-list">
      ${benefitCardsHtml}
    </div>

    <div class="report-summary-box">
      <p>💡 지원사업 신청에 어려움이 있거나 서류 작성이 막막하시다면 주저하지 마시고 중소벤처기업부 종합 콜센터로 문의하세요.</p>
      <div class="summary-hotline">
        <i class="fa-solid fa-phone-volume"></i> 중소기업·소상공인 핫라인: 국번 없이 1357 (무료상담)
      </div>
    </div>
  `;

  resultReport.classList.remove('hidden');
  resultReport.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * -------------------------------------------------------------
 * 2. 주요 업무 탭 전환 핸들러
 * -------------------------------------------------------------
 */
function initDutyTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach((b) => b.classList.remove('active'));
      panels.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/**
 * -------------------------------------------------------------
 * 3. 하단 간이 선택기
 * -------------------------------------------------------------
 */
function initQuickChecker() {
  const select = document.getElementById('userTypeSelect');
  const checkBtn = document.getElementById('checkBtn');
  const resultBox = document.getElementById('checkResult');

  if (!checkBtn || !select) return;

  checkBtn.addEventListener('click', () => {
    const val = select.value;
    if (val === 'default') {
      alert('현재 상태를 목록에서 선택해 주세요.');
      select.focus();
      return;
    }

    // 설문 섹션의 해당 항목으로 연계하거나 리포트 즉시 노출
    const mapToBenefit = {
      startup: 'startup_package',
      smallbiz: 'debt_crisis',
      rnd: 'smart_factory_ai',
      export: 'public_procure',
      complaint: 'legal_ombudsman'
    };

    const targetKey = mapToBenefit[val] || 'funding';
    const roleMapping = {
      startup: '예비창업자 / 초기 스타트업',
      smallbiz: '소상공인 / 자영업자',
      rnd: '중소·제조기업 재직자',
      export: '판로 개척 기업',
      complaint: '경영 애로 기업'
    };

    renderSurveyReport(roleMapping[val], [targetKey], false);
  });
}

/**
 * -------------------------------------------------------------
 * 4. 네비게이션 스크롤 효과
 * -------------------------------------------------------------
 */
function initNavScrollEffect() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
    } else {
      navbar.style.boxShadow = 'var(--shadow-sm)';
    }
  });
}
