// ==========================================================
//  WEB予約ページ (reserve.html)
//  メニュー/スタッフは content.js の loadContent() から取得
//  （管理画面で編集した内容がそのまま反映される）
//
//  現在は「LINEに予約リクエストを整形送信」する方式。
//  ── 将来のバックエンド接続ポイント ──
//  submitViaLine() を API 呼び出し（Firebase / 予約SaaS）に
//  差し替えれば、サイト内完結の予約管理に移行できる。
//  空き状況の反映は buildTimeSlots() に空き情報を渡す設計を想定。
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
  const content = loadContent();

  // LINE公式アカウントID（content.contact.lineUrl と対応）
  const LINE_OA_ID = '@802orzur';

  // 予約可能範囲
  const DAYS_MIN_AHEAD = 1;   // 翌日から
  const DAYS_MAX_AHEAD = 60;  // 60日先まで

  // 受付開始時間（営業 11:00〜20:00 / 施術時間を考慮し最終受付18:00）
  const TIME_SLOTS = ['11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  const WEEKDAYS_JA = ['日', '月', '火', '水', '木', '金', '土'];

  // ---- 選択状態 ----
  const state = {
    menu: null,      // { name, price, category }
    staff: null,     // { name, role } / null = 指名なし
    date: null,      // Date
    time: null,      // '13:00'
    images: []       // [{ file, url }] 参考画像
  };

  // ==========================================================
  //  STEP 1: メニュー描画
  // ==========================================================
  const menuWrap = document.getElementById('menu-options');

  function renderMenuOptions() {
    const cats = (content.menu && content.menu.categories) || [];
    menuWrap.innerHTML = cats.map((cat, ci) => `
      <div class="rsv-menu-group">
        <p class="rsv-menu-cat">${escapeHtml(cat.name)}</p>
        <div class="rsv-menu-items">
          ${cat.items.map((item, ii) => `
            <button type="button" class="rsv-menu-item" data-cat="${ci}" data-item="${ii}">
              <span class="rsv-radio"></span>
              <span class="rsv-menu-item-body">
                <span class="rsv-menu-item-name">${escapeHtml(item.name)}</span>
                ${item.desc ? `<span class="rsv-menu-item-desc">${escapeHtml(item.desc)}</span>` : ''}
              </span>
              <span class="rsv-menu-item-price">${escapeHtml(item.price)}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `).join('');

    menuWrap.querySelectorAll('.rsv-menu-item').forEach(btn => {
      btn.addEventListener('click', () => {
        menuWrap.querySelectorAll('.rsv-menu-item').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        const cat = cats[btn.dataset.cat];
        const item = cat.items[btn.dataset.item];
        state.menu = { name: item.name, price: item.price, category: cat.name };
        update();
      });
    });
  }

  // ==========================================================
  //  STEP 2: スタッフ描画
  // ==========================================================
  const staffWrap = document.getElementById('staff-options');

  function renderStaffOptions() {
    const members = (content.staff && content.staff.members) || [];
    const chips = [
      `<button type="button" class="rsv-staff-chip selected" data-staff="-1">
        <span class="rsv-staff-photo"><span>—</span></span>
        <span class="rsv-staff-name">指名なし</span>
        <span class="rsv-staff-role">おまかせ</span>
      </button>`
    ].concat(members.map((m, i) => `
      <button type="button" class="rsv-staff-chip" data-staff="${i}">
        <span class="rsv-staff-photo">
          ${m.photoUrl
            ? `<img src="${escapeAttr(m.photoUrl)}" alt="${escapeAttr(m.name)}">`
            : '<span>' + escapeHtml((m.name || ' ').charAt(0)) + '</span>'}
        </span>
        <span class="rsv-staff-name">${escapeHtml(m.name)}</span>
        <span class="rsv-staff-role">${escapeHtml(m.role || '')}</span>
      </button>
    `));
    staffWrap.innerHTML = chips.join('');

    staffWrap.querySelectorAll('.rsv-staff-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        staffWrap.querySelectorAll('.rsv-staff-chip').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        const idx = parseInt(btn.dataset.staff, 10);
        state.staff = idx >= 0 ? members[idx] : null;
        update();
      });
    });
  }

  // ==========================================================
  //  STEP 3: カレンダー
  // ==========================================================
  const calGrid  = document.getElementById('cal-grid');
  const calTitle = document.getElementById('cal-title');
  const btnPrev  = document.getElementById('cal-prev');
  const btnNext  = document.getElementById('cal-next');

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minDate = addDays(today, DAYS_MIN_AHEAD);
  const maxDate = addDays(today, DAYS_MAX_AHEAD);

  let viewYear  = today.getFullYear();
  let viewMonth = today.getMonth();

  function addDays(d, n) {
    const r = new Date(d);
    r.setDate(r.getDate() + n);
    return r;
  }

  function sameDay(a, b) {
    return a && b &&
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();
  }

  function renderCalendar() {
    calTitle.textContent = `${viewYear}年 ${viewMonth + 1}月`;

    const first = new Date(viewYear, viewMonth, 1);
    const startPad = first.getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    let html = '';
    for (let i = 0; i < startPad; i++) html += '<span></span>';
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(viewYear, viewMonth, d);
      const disabled = date < minDate || date > maxDate;
      const cls = [
        'rsv-cal-day',
        sameDay(date, today) ? 'today' : '',
        sameDay(date, state.date) ? 'selected' : ''
      ].filter(Boolean).join(' ');
      html += `<button type="button" class="${cls}" data-day="${d}" ${disabled ? 'disabled' : ''}>${d}</button>`;
    }
    calGrid.innerHTML = html;

    // 前後ナビの活性制御（min〜max の範囲内のみ移動可）
    const viewStart = new Date(viewYear, viewMonth, 1);
    const viewEnd   = new Date(viewYear, viewMonth + 1, 0);
    btnPrev.disabled = viewStart <= new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    btnNext.disabled = viewEnd >= maxDate;

    calGrid.querySelectorAll('.rsv-cal-day:not(:disabled)').forEach(btn => {
      btn.addEventListener('click', () => {
        state.date = new Date(viewYear, viewMonth, parseInt(btn.dataset.day, 10));
        renderCalendar();
        renderTimes();
        update();
      });
    });
  }

  btnPrev.addEventListener('click', () => {
    viewMonth--;
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    renderCalendar();
  });
  btnNext.addEventListener('click', () => {
    viewMonth++;
    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    renderCalendar();
  });

  // ==========================================================
  //  STEP 3b: 時間チップ
  // ==========================================================
  const timesGrid  = document.getElementById('times-grid');
  const timesTitle = document.getElementById('times-title');

  function renderTimes() {
    timesGrid.classList.toggle('inactive', !state.date);
    timesTitle.textContent = state.date
      ? `${state.date.getMonth() + 1}/${state.date.getDate()}（${WEEKDAYS_JA[state.date.getDay()]}）の時間`
      : '時間を選ぶ（先に日付を選択）';

    timesGrid.innerHTML = TIME_SLOTS.map(t => `
      <button type="button" class="rsv-time-chip${t === state.time ? ' selected' : ''}" data-time="${t}">${t}</button>
    `).join('');

    timesGrid.querySelectorAll('.rsv-time-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        state.time = btn.dataset.time;
        renderTimes();
        update();
      });
    });
  }

  // ==========================================================
  //  サマリー & 送信
  // ==========================================================
  const sumMenu     = document.getElementById('sum-menu');
  const sumStaff    = document.getElementById('sum-staff');
  const sumDatetime = document.getElementById('sum-datetime');
  const sumName     = document.getElementById('sum-name');
  const btnLine     = document.getElementById('btn-line');
  const btnCopy     = document.getElementById('btn-copy');
  const submitHint  = document.getElementById('submit-hint');
  const nameInput   = document.getElementById('cust-name');
  const noteInput   = document.getElementById('cust-note');
  const sumImages   = document.getElementById('sum-images');
  const imgInput    = document.getElementById('cust-images');
  const uploadBtn   = document.getElementById('upload-trigger');
  const previewGrid = document.getElementById('preview-grid');
  const shareNote   = document.getElementById('share-note');

  nameInput.addEventListener('input', update);
  noteInput.addEventListener('input', update);

  // ---- 参考画像の添付 ----
  const MAX_IMAGES = 6;

  uploadBtn.addEventListener('click', () => imgInput.click());

  imgInput.addEventListener('change', () => {
    [...imgInput.files]
      .filter(f => f.type.startsWith('image/'))
      .forEach(file => {
        if (state.images.length >= MAX_IMAGES) return;
        state.images.push({ file, url: URL.createObjectURL(file) });
      });
    imgInput.value = '';        // 同じファイルの再選択を許可
    if (shareNote) shareNote.hidden = true;
    renderPreviews();
    update();
  });

  function renderPreviews() {
    previewGrid.innerHTML = state.images.map((im, i) => `
      <div class="rsv-preview-item">
        <img src="${im.url}" alt="参考画像 ${i + 1}">
        <button type="button" class="rsv-preview-remove" data-index="${i}" aria-label="削除">&times;</button>
      </div>
    `).join('');

    previewGrid.querySelectorAll('.rsv-preview-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        URL.revokeObjectURL(state.images[idx].url);
        state.images.splice(idx, 1);
        renderPreviews();
        update();
      });
    });

    uploadBtn.classList.toggle('has-images', state.images.length > 0);
    const textEl = uploadBtn.querySelector('.rsv-upload-text');
    if (textEl) {
      textEl.textContent = state.images.length
        ? `画像を追加する（${state.images.length}/${MAX_IMAGES}）`
        : '画像を選ぶ';
    }
  }

  function formatDate(d) {
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${WEEKDAYS_JA[d.getDay()]}）`;
  }

  function setCheck(key, done) {
    const el = document.querySelector(`.rsv-step-check[data-check="${key}"]`);
    if (el) el.classList.toggle('done', done);
  }

  function update() {
    // サマリー
    sumMenu.innerHTML = state.menu
      ? `${escapeHtml(state.menu.name)}<span class="rsv-price">${escapeHtml(state.menu.price)}</span>`
      : '<span class="rsv-empty">未選択</span>';

    sumStaff.innerHTML = state.staff
      ? `${escapeHtml(state.staff.name)} <span style="font-size:0.72rem;color:var(--text-light)">（指名）</span>`
      : '指名なし';

    sumDatetime.innerHTML = (state.date && state.time)
      ? `${formatDate(state.date)}<br>${escapeHtml(state.time)}〜`
      : (state.date
        ? `${formatDate(state.date)}<br><span class="rsv-empty">時間未選択</span>`
        : '<span class="rsv-empty">未選択</span>');

    sumName.innerHTML = nameInput.value.trim()
      ? escapeHtml(nameInput.value.trim())
      : '<span class="rsv-empty">—</span>';

    sumImages.innerHTML = state.images.length
      ? `${state.images.length}枚を添付`
      : '<span class="rsv-empty">なし</span>';

    // ステップ完了チェック
    setCheck('menu', !!state.menu);
    setCheck('staff', true);
    setCheck('datetime', !!(state.date && state.time));
    setCheck('info', !!(nameInput.value.trim() || noteInput.value.trim() || state.images.length));

    // 送信可否（メニュー＋日時が必須）
    const ready = !!(state.menu && state.date && state.time);
    btnLine.disabled = !ready;
    btnCopy.disabled = !ready;
    submitHint.textContent = ready
      ? (state.images.length ? '画像と予約内容をまとめて送信します' : 'LINEが開き、下書きが自動入力されます')
      : 'メニューと日時を選ぶと送信できます';
  }

  function buildMessage() {
    const lines = [
      '【WEB予約リクエスト】',
      `■ メニュー：${state.menu.name}（${state.menu.price}）`,
      `■ スタッフ：${state.staff ? state.staff.name + '（指名）' : '指名なし'}`,
      `■ 希望日時：${formatDate(state.date)} ${state.time}〜`
    ];
    if (nameInput.value.trim()) lines.push(`■ お名前：${nameInput.value.trim()}`);
    if (noteInput.value.trim()) lines.push(`■ ご要望：${noteInput.value.trim()}`);
    if (state.images.length)    lines.push(`■ 参考画像：${state.images.length}枚を添付`);
    lines.push('', '※サロンからの返信をもって予約確定となります');
    return lines.join('\n');
  }

  // ---- 送信 ----
  //  画像あり & 端末対応 → Web Share で画像＋文面をまとめて共有（主にスマホ→LINE選択）
  //  それ以外 → LINE公式アカウントに文面のみ送信（画像はトークで送るよう案内）
  //  将来ここをバックエンドAPI（Firebase / 予約SaaS）に差し替える。
  function openLineText() {
    const text = buildMessage();
    const url = 'https://line.me/R/oaMessage/' + encodeURIComponent(LINE_OA_ID) + '/?' + encodeURIComponent(text);
    window.open(url, '_blank', 'noopener');
  }

  async function submitReservation() {
    const text = buildMessage();
    const files = state.images.map(im => im.file);

    if (files.length && navigator.canShare && navigator.canShare({ files })) {
      try {
        await navigator.share({ files, text, title: 'ご予約リクエスト' });
        return;
      } catch (e) {
        if (e && e.name === 'AbortError') return; // ユーザーがキャンセル
        // それ以外の失敗は下のフォールバックへ
      }
    }

    openLineText();
    if (shareNote) shareNote.hidden = !files.length; // 画像がある時だけ案内を表示
  }

  btnLine.addEventListener('click', submitReservation);

  btnCopy.addEventListener('click', () => {
    navigator.clipboard.writeText(buildMessage()).then(() => {
      const original = btnCopy.textContent;
      btnCopy.textContent = 'コピーしました ✓';
      setTimeout(() => { btnCopy.textContent = original; }, 1500);
    });
  });

  // ---- helpers ----
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }
  function escapeAttr(str) {
    return (str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ---- init ----
  renderMenuOptions();
  renderStaffOptions();
  renderCalendar();
  renderTimes();
  update();
});
