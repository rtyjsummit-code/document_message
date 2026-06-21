function parseMessage(text) {
  const lines = text
    .split("\n")
    .map(line => line.trim())
    .filter(line => line !== "");

  let note = "";
  let title = "";
  let preIntro = [];

  let intro = [];
  let body = [];
  let conclusion = [];

  let current = "pre";

  for (const line of lines) {
    // [2026-06-21 전체메세지 개요]
    if (line.startsWith("[") && line.endsWith("]")) {
      note = line;
      continue;
    }

    // 제목
    if (!title && !line.startsWith("서론") &&
        !line.startsWith("본론") &&
        !line.startsWith("결론")) {
      title = line;
      continue;
    }

    // 섹션 전환
    if (line.startsWith("서론")) {
      current = "intro";

      const rest = line.replace(/^서론\s*[-–]?\s*/, "");

      if (rest) intro.push({
        type: "text",
        text: rest
      });

      continue;
    }

    if (line.startsWith("본론")) {
      current = "body";
      continue;
    }

    if (line.startsWith("결론")) {
      current = "conclusion";

      const rest = line.replace(/^결론\s*[-–]?\s*/, "");

      if (rest) conclusion.push({
        type: "text",
        text: rest
      });

      continue;
    }

    const target =
      current === "intro"
        ? intro
        : current === "body"
        ? body
        : current === "conclusion"
        ? conclusion
        : preIntro;

    // 대주제
    if (/^\d+\./.test(line)) {
      target.push({
        type: "major",
        text: line
      });
      continue;
    }

    // 소주제
    if (/^\d+\)/.test(line)) {
      target.push({
        type: "minor",
        text: line
      });
      continue;
    }

    // 세부소주제
    // (1)그리스도 (2)5가지확신
    const matches = line.match(/\(\d+\)/g);

    if (matches && matches.length >= 2) {
      const items = [];

      const parts = line.split(/(?=\(\d+\))/);

      parts.forEach(part => {
        const cleaned = part.trim();
        if (cleaned) items.push(cleaned);
      });

      target.push({
        type: "subminor",
        items
      });

      continue;
    }

    // 일반 텍스트
    target.push({
      type: "text",
      text: line
    });
  }

  return {
    note,
    title,
    preIntro,
    intro,
    body,
    conclusion
  };
}
