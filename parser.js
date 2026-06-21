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

  let currentSection = "pre";

  for (let line of lines) {

    // [2026-06-21 전체메세지 개요]
    if (line.startsWith("[") && line.endsWith("]")) {
      note = line;
      continue;
    }

    // 제목
    if (
      !title &&
      !line.startsWith("서론") &&
      !line.startsWith("본론") &&
      !line.startsWith("결론")
    ) {
      title = line;
      continue;
    }

    // 서론
    if (line.startsWith("서론")) {
      currentSection = "intro";

      const rest = line.replace(/^서론\s*[-–]?\s*/, "");

      if (rest) {
        intro.push({
          type: "text",
          text: rest
        });
      }

      continue;
    }

    // 본론
    if (line.startsWith("본론")) {
      currentSection = "body";
      continue;
    }

    // 결론
    if (line.startsWith("결론")) {
      currentSection = "conclusion";

      const rest = line.replace(/^결론\s*[-–]?\s*/, "");

      if (rest) {
        conclusion.push({
          type: "text",
          text: rest
        });
      }

      continue;
    }

    const target =
      currentSection === "intro"
        ? intro
        : currentSection === "body"
        ? body
        : currentSection === "conclusion"
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

    // (1)(2)(3) 여러개 있는 줄
    const matches = line.match(/\(\d+\)/g);

    if (matches && matches.length >= 2) {

      const items = line
        .split(/(?=\(\d+\))/)
        .map(v => v.trim())
        .filter(Boolean);

      target.push({
        type: "subminor",
        items
      });

      continue;
    }

    // 일반본문
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
