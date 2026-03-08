const KEY_HISTORY = "mh_history";
const KEY_LOGS = "mh_logs";
const KEY_PLAN = "mh_plan"; // 7天计划勾选

export function readHistory() {
  try {
    return JSON.parse(localStorage.getItem(KEY_HISTORY) || "[]");
  } catch {
    return [];
  }
}

export function saveRecord(record) {
  const list = readHistory();
  list.unshift(record);
  localStorage.setItem(KEY_HISTORY, JSON.stringify(list));
}

export function updateRecord(id, patch) {
  const list = readHistory();
  const next = list.map((x) => (x.id === id ? { ...x, ...patch } : x));
  localStorage.setItem(KEY_HISTORY, JSON.stringify(next));
}

export function getRecord(id) {
  return readHistory().find((x) => x.id === id) || null;
}

export function getLatestRecord() {
  return readHistory()[0] || null;
}

export function clearHistory() {
  localStorage.removeItem(KEY_HISTORY);
}

// 留痕
export function readLogs() {
  try {
    return JSON.parse(localStorage.getItem(KEY_LOGS) || "[]");
  } catch {
    return [];
  }
}

export function logAction(action, payload = {}) {
  const logs = readLogs();
  logs.unshift({ action, payload, at: new Date().toISOString() });
  localStorage.setItem(KEY_LOGS, JSON.stringify(logs));
}

export function clearLogs() {
  localStorage.removeItem(KEY_LOGS);
}

// 7天计划勾选
export function readPlan() {
  try {
    return JSON.parse(localStorage.getItem(KEY_PLAN) || "{}");
  } catch {
    return {};
  }
}

export function writePlan(obj) {
  localStorage.setItem(KEY_PLAN, JSON.stringify(obj));
}