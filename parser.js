function fixText(text) {
  return text
    .replace(/\r/g, "")
    .replace(/–/g, "-")
    .replace(/\t/g, " ");
}

function isSection(line) {
  return (
    line.startsWith("본문") ||
    line.startsWith("서론") ||
    line.startsWith("본론") ||
    line.startsWith("결론")
  );
}

function isTopic(line) {
  return /^\d+\./.test(line);
}

/*
 소주제
 1) 확실한 복음
*/
function isSubtopic(line) {
  return /^\d+\)/.test(line);
}

/*
 (1)(2)(3)
*/
function isDetailLine(line) {
  return /^\(\d+\)/.test(line);
}

/*
 (1)그리스도 (2)5가지 확신
 →
 (1) 그리스도     (2) 5가지 확신
*/
function normalizeDetailLine(line) {

  const parts =
    line.match(/\(\d+\)[^\(]*/g);

  if (!parts) return line;

  return parts
    .map(item => {

      const num =
        item.match(/\(\d+\)/)[0];

      const text =
        item.replace(num, "").trim();

      return `${num} ${text}`;

    })
    .join("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
}

/*
 1)확실한 복음
 2)분명한 미션
*/
function splitSubtopics(line) {

  const matches =
    line.match(/\d+\)[^0-9]+/g);

  if (!matches)
    return [line];

  return matches.map(v => v.trim());
}
