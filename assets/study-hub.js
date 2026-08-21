/* ─────────────────────────────────────────────
   StudyHub — 과목별 학습 기록을 브라우저(localStorage)에 저장합니다.
   기록은 이 브라우저에만 남고 서버로 전송되지 않습니다.

   각 학습 페이지는 결과가 나올 때 StudyHub.push(certId, entry)를 호출하고,
   루트 index.html(허브)이 그 기록을 읽어 카드에 표시합니다.
   ───────────────────────────────────────────── */
(function (global) {
  var KEY = 'study-hub-v1';
  var HISTORY_MAX = 20;

  function readAll() {
    try {
      var raw = global.localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function writeAll(data) {
    try {
      global.localStorage.setItem(KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
    }
  }

  function slot(data, certId) {
    if (!data[certId]) data[certId] = { history: [], examDate: null };
    if (!data[certId].history) data[certId].history = [];
    return data[certId];
  }

  var StudyHub = {
    /* 과목 하나의 저장 내용 전체 { history, examDate } */
    get: function (certId) {
      return slot(readAll(), certId);
    },

    /* 가장 최근 기록 (없으면 null) */
    latest: function (certId) {
      var h = this.get(certId).history;
      return h.length ? h[0] : null;
    },

    /* 최고 성취도(pct) 기록 (없으면 null) */
    best: function (certId) {
      var h = this.get(certId).history, top = null;
      for (var i = 0; i < h.length; i++) {
        if (top === null || h[i].pct > top.pct) top = h[i];
      }
      return top;
    },

    /*
     * 학습 기록 추가.
     * entry = {
     *   kind : 'exam' | 'practice',   // 모의고사 채점 / 문제은행 연습
     *   label: '제1회 실전 모의고사',  // 회차 이름
     *   headline: '72점 · 합격',       // 카드에 그대로 노출되는 한 줄
     *   pct  : 72,                     // 0~100, 진행 막대에 사용
     *   pass : true | false | null,    // 합격 판정이 없는 모드는 null
     *   replaceTop: true                // 같은 응시의 재계산이면 맨 앞 기록을 대체
     * }
     * 같은 kind+label의 연습(practice) 기록은 최신 것으로 덮어씁니다.
     */
    push: function (certId, entry) {
      var data = readAll();
      var s = slot(data, certId);
      var rec = {
        kind: entry.kind || 'exam',
        label: entry.label || '',
        headline: entry.headline || '',
        pct: Math.max(0, Math.min(100, Math.round(entry.pct || 0))),
        pass: (typeof entry.pass === 'boolean') ? entry.pass : null,
        at: new Date().toISOString()
      };
      if (rec.kind === 'practice') {
        s.history = s.history.filter(function (h) {
          return !(h.kind === 'practice' && h.label === rec.label);
        });
      }
      /* 서술형 자가채점처럼 같은 응시의 점수만 바뀐 경우 맨 앞 기록을 덮어씁니다. */
      if (entry.replaceTop && s.history.length &&
          s.history[0].kind === rec.kind && s.history[0].label === rec.label) {
        s.history.shift();
      }
      s.history.unshift(rec);
      s.history = s.history.slice(0, HISTORY_MAX);
      writeAll(data);
      return rec;
    },

    /* 시험일(D-day) 저장 — 'YYYY-MM-DD' 또는 null */
    setExamDate: function (certId, isoDate) {
      var data = readAll();
      slot(data, certId).examDate = isoDate || null;
      writeAll(data);
    },

    /* 남은 일수. 시험일이 없으면 null */
    dday: function (certId) {
      var d = this.get(certId).examDate;
      if (!d) return null;
      var target = new Date(d + 'T00:00:00');
      if (isNaN(target)) return null;
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      return Math.round((target - today) / 86400000);
    },

    /* 한 과목의 기록만 삭제 */
    clear: function (certId) {
      var data = readAll();
      delete data[certId];
      writeAll(data);
    },

    /* 전체 기록 삭제 */
    clearAll: function () {
      try { global.localStorage.removeItem(KEY); } catch (e) {}
    },

    /* 'M월 D일' 같은 짧은 표기 */
    formatDate: function (iso) {
      var d = new Date(iso);
      if (isNaN(d)) return '';
      return (d.getMonth() + 1) + '월 ' + d.getDate() + '일';
    }
  };

  global.StudyHub = StudyHub;
})(window);
