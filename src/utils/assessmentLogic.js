export const PHQ9_ITEMS = [
  "做事缺乏兴趣或乐趣",
  "感到情绪低落、沮丧或绝望",
  "入睡困难、睡不安稳或睡得过多",
  "感到疲倦或精力不足",
  "食欲不振或吃得过多",
  "觉得自己很糟糕/对自己失望或觉得让家人失望",
  "注意力不集中（如看书/看电视困难）",
  "动作或说话变慢，或坐立不安、来回走动",
  "有不如死掉或伤害自己的念头",
];

export function scorePHQ9(answers) {
  return answers.reduce((a, b) => a + (Number(b) || 0), 0);
}

export function riskLevel(score) {
  if (score >= 20) return "高风险";
  if (score >= 10) return "中风险";
  return "低风险";
}

export function keywordTags(text) {
  const t = (text || "").toLowerCase();
  const rules = [
    ["失眠", ["睡不着", "睡不好", "失眠", "熬夜"]],
    ["焦虑", ["焦虑", "紧张", "慌", "害怕"]],
    ["自责", ["自责", "内疚", "没用", "失败"]],
    ["压力", ["压力", "崩溃", "撑不住", "deadline"]],
  ];
  const tags = [];
  for (const [tag, kws] of rules) {
    if (kws.some((k) => t.includes(k))) tags.push(tag);
  }
  return [...new Set(tags)];
}

export function buildReport({ score, risk, tags, text }) {
  const recommendations = [
    { title: "呼吸放松训练", detail: "4-7-8 呼吸：吸4秒-屏7秒-呼8秒，重复4轮。" },
    { title: "睡眠卫生", detail: "固定上床/起床；睡前1小时远离屏幕；下午减少咖啡因。" },
    { title: "情绪记录", detail: "记录：事件-想法-情绪-应对；每天1次，2分钟即可。" },
  ];

  const contraindications = [
    { title: "避免自行加量用药", detail: "如已在用药请遵医嘱，不建议自行调整剂量。" },
    { title: "避免把AI当诊断", detail: "本系统仅作辅助评估/建议，不替代专业诊疗。" },
  ];

  const evidence_paths = [
    { path: [`PHQ-9得分=${score}`, `风险等级=${risk}`, "建议：睡眠/放松/记录"], source: "rule-demo", confidence: 0.75 },
  ];

  if (tags.length) {
    evidence_paths.push({
      path: [`文本标签=${tags.join(",")}`, "建议：压力管理与支持系统", "禁忌：高风险转介优先"],
      source: "keyword-demo",
      confidence: 0.70,
    });
  }

  return { summary: text ? `自述摘要：${text.slice(0, 50)}...` : "基于量表与自述生成的演示版报告。", recommendations, contraindications, evidence_paths };
}