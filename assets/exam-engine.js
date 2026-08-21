/* =============================================================
   Study CBT — 공용 시험 엔진
   페이지는 window.EXAM_META 와 window.EXAMS 만 정의하면 됩니다.

   EXAM_META = {
     id, cert, eyebrow, headline, lede,
     minutes, perQuestion, passTotal,
     subjects: [{ name, short, count, cut }],   // cut = 과락 기준 정답 수(없으면 null)
     spec: [[용어, 값], ...],
     coverage: { updated, basis, source },
     tips: [{ h, p }, ...]
   }

   EXAMS = [{ title, note, q: [문항, ...] }]
   문항 =
     { n, s, t:'mcq',   q, code?, o:[보기4], a:정답인덱스, e:해설 }
     { n, s, t:'short', q, code?, blanks:[{lbl?, accept:[정답표기...]}], e }
     { n, s, t:'desc',  q, code?, model:모범답안, points?:[채점포인트], e? }
   ============================================================= */
(function () {
  'use strict';

  var META = window.EXAM_META;
  var EXAMS = window.EXAMS || [];
  if (!META || !EXAMS.length) return;

  var $ = function (s) { return document.querySelector(s); };
  var MARKS = ['①', '②', '③', '④', '⑤'];

  function esc(t) {
    return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function sv(el, blk) {
    try { el && el.scrollIntoView({ behavior: 'smooth', block: blk || 'start' }); } catch (e) {}
  }
  function pad(n) { return String(n).padStart(2, '0'); }
  /* t를 생략한 문항은 객관식으로 봅니다. */
  function type(q) { return q.t || 'mcq'; }

  /* 문항 수·배점 */
  var TOTAL = EXAMS[0].q.length;
  var PER = META.perQuestion || (100 / TOTAL);
  var PASS = META.passTotal == null ? 60 : META.passTotal;
  var SUBS = META.subjects || [];
  var HAS_SUBS = SUBS.length > 1;

  /* 응시 상태 */
  var cur = null;      // 현재 회차
  var answers = [];    // 문항별 응답
  var flags = [];      // 보류 표시
  var order = [];      // mcq 보기 표시 순서
  var graded = false;
  var tick = null, left = 0, wrongOnly = false, quitArmed = null;
  var recorded = false; // 이번 응시의 결과를 이미 기록했는지

  /* ---------------------------------------------------------
     정답 비교 — 표기 흔들림(공백·대소문자·따옴표)을 흡수합니다.
     --------------------------------------------------------- */
  function normalize(v) {
    return String(v == null ? '' : v)
      .replace(/\s+/g, ' ')
      .replace(/[“”]/g, '"').replace(/[‘’]/g, "'")
      .trim()
      .toLowerCase();
  }
  function tight(v) {
    return normalize(v).replace(/[\s'"`.,]/g, '');
  }
  function blankOk(input, accept) {
    var a = normalize(input), b = tight(input);
    if (!b) return false;
    for (var i = 0; i < accept.length; i++) {
      if (a === normalize(accept[i]) || b === tight(accept[i])) return true;
    }
    return false;
  }
  function shortOk(q, ans) {
    if (!ans) return false;
    for (var i = 0; i < q.blanks.length; i++) {
      if (!blankOk(ans[i], q.blanks[i].accept)) return false;
    }
    return true;
  }
  function isCorrect(q, ans) {
    if (type(q) === 'short') return shortOk(q, ans);
    if (type(q) === 'desc') return !!(ans && ans.self === true);
    return ans === q.a;
  }
  function isAnswered(q, ans) {
    if (type(q) === 'short') return !!(ans && ans.some(function (v) { return String(v || '').trim(); }));
    if (type(q) === 'desc') return !!(ans && String(ans.text || '').trim());
    return ans !== null && ans !== undefined;
  }

  /* ---------------------------------------------------------
     표지
     --------------------------------------------------------- */
  function coverHtml() {
    var cov = META.coverage || {};
    var specRows = (META.spec || []).map(function (r) {
      return '<div class="row"><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd></div>';
    }).join('');

    return '' +
      '<div class="hero">' +
        '<div>' +
          '<p class="eyebrow">' + esc(META.eyebrow || META.cert) + '</p>' +
          '<h1>' + META.headline + '</h1>' +
          '<p class="lede">' + esc(META.lede) + '</p>' +
          '<div class="badge brand" id="coverage-chip">' +
            '반영 ' + esc(cov.basis || '-') + ' · 업데이트 ' + esc(cov.updated || '-') +
          '</div>' +
          (cov.source ? '<p class="muted" style="font-size:12.5px;margin-top:10px">' + esc(cov.source) + '</p>' : '') +
        '</div>' +
        '<dl class="spec">' + specRows + '</dl>' +
      '</div>' +

      '<div class="opts-bar">' +
        '<span class="label">응시 설정</span>' +
        '<label class="switch"><input type="checkbox" id="shuf"' + (META.shuffle === false ? '' : ' checked') + '>보기 순서 섞기</label>' +
        '<label class="switch"><input type="checkbox" id="timed" checked>제한 시간 사용 (' + META.minutes + '분)</label>' +
      '</div>' +

      '<div class="papers" id="papers"></div>' +

      '<div class="tips">' +
        (META.tips || []).map(function (t) {
          return '<section><h4>' + esc(t.h) + '</h4><p>' + esc(t.p) + '</p></section>';
        }).join('') +
      '</div>';
  }

  function paintPapers() {
    $('#papers').innerHTML = EXAMS.map(function (e, i) {
      var rec = null;
      try {
        rec = (window.StudyHub ? window.StudyHub.get(META.id).history : []).filter(function (h) {
          return h.label === e.title;
        })[0] || null;
      } catch (err) {}
      return '' +
        '<article class="paper">' +
          '<span class="no">PAPER ' + pad(i + 1) + '</span>' +
          '<h3>' + esc(e.title) + '</h3>' +
          '<p>' + esc(e.note) + '</p>' +
          '<span class="last">' + (rec
            ? '최근 <b>' + esc(rec.headline) + '</b> · ' + esc(window.StudyHub.formatDate(rec.at))
            : '아직 응시 기록 없음') + '</span>' +
          '<button class="btn" data-start="' + i + '">' + (rec ? '다시 응시' : '응시 시작') + '</button>' +
        '</article>';
    }).join('');

    $('#papers').querySelectorAll('[data-start]').forEach(function (b) {
      b.addEventListener('click', function () { start(+b.dataset.start); });
    });
  }

  /* ---------------------------------------------------------
     응시 시작
     --------------------------------------------------------- */
  function start(i) {
    cur = EXAMS[i];
    graded = false; wrongOnly = false; recorded = false;
    var shuffle = $('#shuf') ? $('#shuf').checked : true;
    var timed = $('#timed') ? $('#timed').checked : true;

    answers = cur.q.map(function (q) {
      if (type(q) === 'short') return q.blanks.map(function () { return ''; });
      if (type(q) === 'desc') return { text: '', self: null };
      return null;
    });
    flags = cur.q.map(function () { return false; });
    order = cur.q.map(function (q) {
      if (type(q) !== 'mcq') return null;
      var idx = q.o.map(function (_, k) { return k; });
      if (shuffle) {
        for (var k = idx.length - 1; k > 0; k--) {
          var j = Math.floor(Math.random() * (k + 1));
          var tmp = idx[k]; idx[k] = idx[j]; idx[j] = tmp;
        }
      }
      return idx;
    });

    $('#cover').style.display = 'none';
    $('#result').style.display = 'none';
    $('#result').innerHTML = '';
    $('#exam').style.display = 'block';
    $('#tbTitle').textContent = META.cert + ' · ' + cur.title;
    $('#submitBtn').textContent = '제출하고 채점하기';
    $('#submitBtn').disabled = false;
    $('#wrongOnlyBtn').style.display = 'none';

    paintSheet();
    paintOmr();
    updateProgress();

    clearInterval(tick);
    if (timed) {
      left = META.minutes * 60;
      paintTimer();
      tick = setInterval(function () {
        left--; paintTimer();
        if (left <= 0) { clearInterval(tick); grade(true); }
      }, 1000);
      $('#timer').style.display = '';
    } else {
      $('#timer').style.display = 'none';
    }
    try { window.scrollTo(0, 0); } catch (e) {}
  }

  function paintTimer() {
    var t = $('#timer');
    t.textContent = pad(Math.floor(Math.max(left, 0) / 60)) + ':' + pad(Math.max(left, 0) % 60);
    t.classList.toggle('warn', left <= 300);
  }

  /* ---------------------------------------------------------
     문제지
     --------------------------------------------------------- */
  function bodyHtml(q, i) {
    if (type(q) === 'short') {
      var multi = q.blanks.length > 1;
      return '<div class="blanks">' + q.blanks.map(function (b, bi) {
        return '<div class="blank" data-blank="' + bi + '">' +
          (multi || b.lbl ? '<span class="lbl">' + esc(b.lbl || '(' + (bi + 1) + ')') + '</span>' : '') +
          '<input type="text" autocomplete="off" spellcheck="false" data-i="' + i + '" data-b="' + bi + '" ' +
            'value="' + esc(answers[i][bi]) + '" placeholder="답을 입력하세요">' +
          '</div>';
      }).join('') + '</div>' +
      '<p class="hint">대소문자와 앞뒤 공백은 채점에 영향을 주지 않습니다.</p>';
    }
    if (type(q) === 'desc') {
      return '<textarea class="desc-input" data-i="' + i + '" placeholder="핵심 키워드를 넣어 서술하세요">' + esc(answers[i].text) + '</textarea>' +
        '<p class="hint">서술형은 채점 후 모범답안과 비교해 스스로 정답 여부를 표시합니다.</p>';
    }
    return '<ul class="opts">' + order[i].map(function (oi, pos) {
      return '<li data-opt="' + oi + '">' +
        '<label><input type="radio" name="q' + q.n + '" value="' + oi + '" data-i="' + i + '"' +
          (answers[i] === oi ? ' checked' : '') + '>' +
        '<span class="mk">' + MARKS[pos] + '</span>' +
        '<span class="txt">' + esc(q.o[oi]) + '</span></label></li>';
    }).join('') + '</ul>';
  }

  function paintSheet() {
    var html = '', lastSub = null, seen = 0;
    cur.q.forEach(function (q, i) {
      if (HAS_SUBS && q.s !== lastSub) {
        lastSub = q.s;
        seen = 0;
        var sub = SUBS[q.s - 1];
        html += '<div class="sec-head"><h2>' + esc(sub.name) + '</h2>' +
          '<span>' + sub.count + '문항</span><span class="line"></span></div>';
      }
      seen++;
      html += '' +
        '<article class="q" id="q' + q.n + '" data-i="' + i + '">' +
          '<div class="q-head">' +
            '<span class="q-no">' + q.n + '</span>' +
            '<p class="q-text">' + esc(q.q) + '</p>' +
            '<span class="q-pts">' + (Math.round(PER * 10) / 10) + '점</span>' +
            '<button class="flag" data-flag="' + i + '" type="button">보류</button>' +
          '</div>' +
          (q.code ? '<pre class="code">' + esc(q.code) + '</pre>' : '') +
          bodyHtml(q, i) +
          '<div class="expl"></div>' +
        '</article>';
    });
    $('#sheet').innerHTML = html;
  }

  /* ---------------------------------------------------------
     답안지(OMR)
     --------------------------------------------------------- */
  function paintOmr() {
    var html = '';
    var groups = HAS_SUBS ? SUBS.map(function (s, si) {
      return { name: s.short || s.name, items: cur.q.map(function (q, i) { return { q: q, i: i }; }).filter(function (o) { return o.q.s === si + 1; }) };
    }) : [{ name: null, items: cur.q.map(function (q, i) { return { q: q, i: i }; }) }];

    groups.forEach(function (g) {
      if (g.name) html += '<div class="sub-lbl">' + esc(g.name) + '</div>';
      html += '<div class="grid">' + g.items.map(function (o) {
        var cls = '';
        if (graded) cls = isCorrect(o.q, answers[o.i]) ? 'r-ok' : 'r-no';
        else if (flags[o.i]) cls = 'flagged';
        else if (isAnswered(o.q, answers[o.i])) cls = 'done';
        return '<b class="' + cls + '" data-go="' + o.q.n + '">' + o.q.n + '</b>';
      }).join('') + '</div>';
    });
    $('#omrBody').innerHTML = html;
    $('#omrBody').querySelectorAll('[data-go]').forEach(function (b) {
      b.addEventListener('click', function () { sv($('#q' + b.dataset.go)); });
    });
  }

  function updateProgress() {
    var n = cur.q.filter(function (q, i) { return isAnswered(q, answers[i]); }).length;
    $('#progBar').style.width = Math.round(n / TOTAL * 100) + '%';
    $('#progN').textContent = n + ' / ' + TOTAL;
    var blank = TOTAL - n;
    $('#blankNote').textContent = graded ? '' : (blank ? '아직 ' + blank + '문항이 비어 있습니다.' : '');
  }

  /* ---------------------------------------------------------
     입력 처리
     --------------------------------------------------------- */
  function bindSheet() {
    var sheet = $('#sheet');

    sheet.addEventListener('change', function (e) {
      if (graded) return;
      var t = e.target;
      if (t.type === 'radio') {
        answers[+t.dataset.i] = +t.value;
        paintOmr(); updateProgress();
      }
    });

    sheet.addEventListener('input', function (e) {
      if (graded) return;
      var t = e.target;
      if (t.tagName === 'INPUT' && t.dataset.b !== undefined) {
        answers[+t.dataset.i][+t.dataset.b] = t.value;
        paintOmr(); updateProgress();
      } else if (t.tagName === 'TEXTAREA') {
        answers[+t.dataset.i].text = t.value;
        paintOmr(); updateProgress();
      }
    });

    /* 단답형에서 Enter → 다음 입력칸 */
    sheet.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' || e.target.tagName !== 'INPUT') return;
      e.preventDefault();
      var all = Array.prototype.slice.call(sheet.querySelectorAll('.blank input'));
      var at = all.indexOf(e.target);
      if (at > -1 && all[at + 1]) all[at + 1].focus();
    });

    sheet.addEventListener('click', function (e) {
      var f = e.target.closest('[data-flag]');
      if (f && !graded) {
        var i = +f.dataset.flag;
        flags[i] = !flags[i];
        f.classList.toggle('on', flags[i]);
        f.textContent = flags[i] ? '보류 중' : '보류';
        f.closest('.q').classList.toggle('marked', flags[i]);
        paintOmr();
        return;
      }
      var sg = e.target.closest('[data-self]');
      if (sg && graded) {
        var qi = +sg.dataset.i;
        answers[qi].self = sg.dataset.self === 'ok';
        paintSelfGrade(qi);
        paintOmr();
        recount();
      }
    });
  }

  /* ---------------------------------------------------------
     채점
     --------------------------------------------------------- */
  function explHtml(q, i) {
    var ans = answers[i];
    var answered = isAnswered(q, ans);
    var ok = isCorrect(q, ans);
    var state = !answered ? 'skip' : (ok ? 'ok' : 'no');
    var label = !answered ? '미응답' : (ok ? '정답' : '오답');

    var head = '';
    if (type(q) === 'mcq') {
      head = '<span class="answer">정답 ' + MARKS[order[i].indexOf(q.a)] + ' &nbsp;' + esc(q.o[q.a]) + '</span>';
    } else if (type(q) === 'short') {
      head = '<span class="answer">정답 ' + q.blanks.map(function (b) {
        return '<code>' + esc(b.accept[0]) + '</code>';
      }).join(' , ') + '</span>';
    } else {
      head = '<span class="answer">모범답안 · ' + esc(q.model) + '</span>' +
        (q.points && q.points.length
          ? '<span class="answer" style="font-weight:500;color:var(--ink-2)">채점 포인트 — ' + esc(q.points.join(' / ')) + '</span>'
          : '');
    }

    return '<span class="verdict ' + state + '">' + label + '</span>' + head +
      (q.e ? esc(q.e) : '') +
      (type(q) === 'desc' ? '<div class="selfgrade" data-sg="' + i + '"></div>' : '');
  }

  function paintSelfGrade(i) {
    var box = $('#sheet').querySelector('[data-sg="' + i + '"]');
    if (!box) return;
    var self = answers[i].self;
    box.innerHTML = '스스로 채점 : ' +
      '<button class="btn sm quiet" data-self="ok" data-i="' + i + '" aria-pressed="' + (self === true) + '">맞음</button>' +
      '<button class="btn sm quiet" data-self="no" data-i="' + i + '" aria-pressed="' + (self === false) + '">틀림</button>' +
      (self === null ? '<span class="muted" style="font-size:12.5px">아직 표시하지 않은 서술형은 오답으로 계산됩니다.</span>' : '');
    var card = $('#q' + cur.q[i].n);
    card.classList.remove('ok', 'no', 'skip');
    card.classList.add(self === true ? 'ok' : 'no');
  }

  function grade(auto) {
    if (graded) return;
    graded = true;
    clearInterval(tick);
    $('#submitBtn').textContent = '채점 완료';
    $('#submitBtn').disabled = true;
    $('#wrongOnlyBtn').style.display = '';
    $('#wrongOnlyBtn').textContent = '틀린 문항만 보기';
    $('#blankNote').textContent = '';

    cur.q.forEach(function (q, i) {
      var el = $('#q' + q.n);
      var ans = answers[i];
      var ok = isCorrect(q, ans);
      var answered = isAnswered(q, ans);

      el.classList.remove('marked');
      el.classList.add(!answered && type(q) !== 'desc' ? 'skip' : (ok ? 'ok' : 'no'));
      el.querySelectorAll('input, textarea').forEach(function (f) { f.disabled = true; });

      if (type(q) === 'mcq') {
        el.querySelectorAll('[data-opt]').forEach(function (li) {
          var oi = +li.dataset.opt;
          if (oi === q.a) li.classList.add('correct');
          if (!ok && ans === oi) li.classList.add('chosen-wrong');
        });
      } else if (type(q) === 'short') {
        el.querySelectorAll('[data-blank]').forEach(function (row, bi) {
          row.classList.add(blankOk(ans[bi], q.blanks[bi].accept) ? 'ok' : 'no');
        });
      }

      var ex = el.querySelector('.expl');
      ex.style.display = 'block';
      ex.innerHTML = explHtml(q, i);
      if (type(q) === 'desc') paintSelfGrade(i);
    });

    paintOmr();
    recount(auto);
    sv($('#result'));
  }

  /* 서술형 자가채점이 바뀌면 점수를 다시 계산합니다. */
  function recount(auto) {
    var per = SUBS.length ? SUBS.map(function () { return 0; }) : [0];
    cur.q.forEach(function (q, i) {
      if (isCorrect(q, answers[i])) per[SUBS.length ? q.s - 1 : 0]++;
    });
    showResult(per, auto);
  }

  function showResult(per, auto) {
    var correct = per.reduce(function (a, b) { return a + b; }, 0);
    var total = Math.round(correct * PER * 10) / 10;
    var failed = SUBS.map(function (s, i) {
      return (s.cut != null && per[i] < s.cut) ? i : -1;
    }).filter(function (i) { return i >= 0; });
    var pass = total >= PASS && failed.length === 0;

    var why = [];
    if (total < PASS) why.push('총점 ' + PASS + '점 미달');
    failed.forEach(function (i) { why.push((SUBS[i].short || SUBS[i].name) + ' 과락'); });

    var rows = '<div class="bar-row"><span class="lbl">총점</span>' +
      '<span class="bar-track"><span class="bar-fill ' + (total < PASS ? 'low' : '') + '" style="width:' + Math.min(total, 100) + '%"></span>' +
      '<span class="cut" style="left:' + PASS + '%"></span></span>' +
      '<span class="bar-val">' + total + ' / 100 · ' + correct + '/' + TOTAL + '</span></div>';

    if (HAS_SUBS) {
      rows += SUBS.map(function (s, i) {
        var pctv = Math.round(per[i] / s.count * 100);
        var low = s.cut != null && per[i] < s.cut;
        return '<div class="bar-row"><span class="lbl">' + esc(s.short || s.name) + '</span>' +
          '<span class="bar-track"><span class="bar-fill ' + (low ? 'low' : '') + '" style="width:' + pctv + '%"></span>' +
          (s.cut != null ? '<span class="cut" style="left:' + Math.round(s.cut / s.count * 100) + '%"></span>' : '') +
          '</span><span class="bar-val">' + per[i] + ' / ' + s.count + '문항</span></div>';
      }).join('');
    }

    $('#result').style.display = 'block';
    $('#result').innerHTML = '' +
      '<div class="score">' +
        '<p class="eyebrow">' + esc(cur.title) + (auto ? ' · 시간 종료로 자동 제출됨' : '') + '</p>' +
        '<p class="verdict-big ' + (pass ? 'pass' : 'fail') + '">' + total + '점 · ' + (pass ? '합격' : '불합격') + '</p>' +
        '<p class="verdict-sub">' + (pass
          ? '합격 기준(' + PASS + '점' + (SUBS.some(function (s) { return s.cut != null; }) ? ', 과목 과락 없음' : '') + ')을 넘겼습니다. 이 컨디션이면 실전에서도 통과합니다.'
          : esc(why.join(' · ')) + ' — 막대의 세로선이 커트라인입니다.') + '</p>' +
        '<div class="bars">' + rows + '</div>' +
        '<div class="res-actions">' +
          '<button class="btn" id="reviewBtn">틀린 문항 확인하기</button>' +
          '<button class="btn quiet" id="retryBtn">이 회차 다시 풀기</button>' +
          '<button class="btn quiet" id="homeBtn">회차 목록으로</button>' +
          '<a class="btn quiet" href="../">학습 허브로</a>' +
        '</div>' +
      '</div>';

    $('#reviewBtn').onclick = function () { if (!wrongOnly) toggleWrong(); sv($('#sheet')); };
    $('#retryBtn').onclick = function () { start(EXAMS.indexOf(cur)); };
    $('#homeBtn').onclick = home;

    try {
      window.StudyHub && window.StudyHub.push(META.id, {
        kind: 'exam',
        label: cur.title,
        headline: total + '점 · ' + (pass ? '합격' : '불합격'),
        pct: total,
        pass: pass,
        replaceTop: recorded
      });
      recorded = true;
    } catch (e) {}
  }

  function toggleWrong() {
    wrongOnly = !wrongOnly;
    cur.q.forEach(function (q, i) {
      $('#q' + q.n).style.display = (wrongOnly && isCorrect(q, answers[i])) ? 'none' : '';
    });
    document.querySelectorAll('.sec-head').forEach(function (h) { h.style.display = wrongOnly ? 'none' : ''; });
    $('#wrongOnlyBtn').textContent = wrongOnly ? '전체 문항 보기' : '틀린 문항만 보기';
  }

  function home() {
    clearInterval(tick);
    if (quitArmed) { clearTimeout(quitArmed); quitArmed = null; }
    $('#quitBtn').textContent = '나가기';
    $('#exam').style.display = 'none';
    $('#result').style.display = 'none';
    $('#cover').style.display = 'block';
    paintPapers();
    try { window.scrollTo(0, 0); } catch (e) {}
  }

  /* ---------------------------------------------------------
     화면 뼈대 조립
     --------------------------------------------------------- */
  function mount() {
    var omrGroups = HAS_SUBS ? SUBS : [];
    document.getElementById('app').innerHTML = '' +
      '<nav class="topnav"><div class="wrap">' +
        '<a class="brandmark" href="../"><span class="dot"></span>자격증 학습 허브</a>' +
        '<span class="crumb">/ ' + esc(META.cert) + '</span>' +
        '<span class="spacer"></span>' +
        '<a class="btn quiet sm" href="../">허브로</a>' +
      '</div></nav>' +

      '<main id="cover" class="wrap">' + coverHtml() + '</main>' +

      '<section id="exam">' +
        '<div class="exambar"><div class="wrap">' +
          '<span class="title" id="tbTitle"></span>' +
          '<span class="sep"></span>' +
          '<span class="timer" id="timer">00:00</span>' +
          '<span class="track"><i id="progBar"></i></span>' +
          '<span class="count" id="progN">0 / ' + TOTAL + '</span>' +
          '<button class="btn quiet sm" id="quitBtn">나가기</button>' +
        '</div></div>' +
        '<div class="wrap layout">' +
          '<div id="sheet"></div>' +
          '<aside class="omr">' +
            '<h4>답안지</h4>' +
            '<p class="hint">번호를 누르면 해당 문항으로 이동합니다.</p>' +
            '<div id="omrBody"></div>' +
            '<p class="note" id="blankNote"></p>' +
            '<button class="btn block" id="submitBtn">제출하고 채점하기</button>' +
            '<button class="btn quiet block" id="wrongOnlyBtn" style="display:none;margin-top:8px">틀린 문항만 보기</button>' +
          '</aside>' +
        '</div>' +
      '</section>' +

      '<section id="result" class="wrap-narrow"></section>';

    void omrGroups;

    paintPapers();
    bindSheet();

    $('#submitBtn').onclick = function () {
      var blank = cur.q.filter(function (q, i) { return !isAnswered(q, answers[i]); }).length;
      if (blank && !confirm(blank + '문항이 비어 있습니다. 그대로 제출할까요?')) return;
      grade(false);
    };
    $('#wrongOnlyBtn').onclick = function () { toggleWrong(); };
    $('#quitBtn').onclick = function () {
      if (graded) { home(); return; }
      if (quitArmed) { clearTimeout(quitArmed); quitArmed = null; home(); return; }
      $('#quitBtn').textContent = '한 번 더 누르면 나갑니다';
      quitArmed = setTimeout(function () {
        quitArmed = null;
        $('#quitBtn').textContent = '나가기';
      }, 4000);
    };

    window.addEventListener('beforeunload', function (e) {
      if (cur && !graded && $('#exam').style.display !== 'none') {
        e.preventDefault();
        e.returnValue = '';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', mount);
})();
