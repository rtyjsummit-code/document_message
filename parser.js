function fixText(text) {

  return text
    .replaceAll("론론", "본론")
    .replaceAll("본 론", "본론")
    .replaceAll("결 른", "결론")
    .replaceAll("1..", "1.");
}

/*
  (1)그리스도  (2)5가지 확신
  형태 정리
*/
function normalizeDetailLine(line) {

  return line
    .replace(/\(\d+\)/g, match => {
      return " " + match + " ";
    })
    .replace(/\s+/g, " ")
    .trim();
}

/*
  1)각인 2)뿌리 3)체질

  →

  [
    "1)각인",
    "2)뿌리",
    "3)체질"
  ]
*/
function splitSubtopics(line) {

  const result = line
    .split(/(?=\d+\))/)
    .map(v => v.trim())
    .filter(v => v.length > 0);

  return result;
}

/*
  섹션 여부
*/
function isSection(line) {

  return [
    "본문",
    "서론",
    "본론",
    "결론"
  ].includes(line.trim());
}

/*
  대주제 여부

  1.
  2.
  3.
*/
function isTopic(line) {

  return /^\d+\./.test(
    line.trim()
  );
}

/*
  소주제 여부

  1)
  2)
*/
function isSubtopic(line) {

  return /^\d+\)/.test(
    line.trim()
  );
}

/*
  (1)
  (2)
*/
function isDetailLine(line) {

  return /^\(\d+\)/.test(
    line.trim()
  );
}
