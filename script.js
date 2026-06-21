const input = document.getElementById("inputText");
const paper = document.getElementById("paper");

/*
 저장
*/
input.value =
  localStorage.getItem("message_v4") || "";

input.addEventListener("input", () => {
  localStorage.setItem(
    "message_v4",
    input.value
  );
});

/*
 렌더링
*/
function renderDocument() {

  let text = fixText(
    input.value
  );

  let lines = text.split("\n");

  let html = "";

  let index = 0;

  /*
   메타
  */
  if (
    lines.length > 0 &&
    lines[0].trim().startsWith("[")
  ) {

    html += `
      <div class="meta">
        ${lines[0]}
      </div>
    `;

    index++;
  }

  /*
   빈 줄 제거
  */
  while (
    index < lines.length &&
    !lines[index].trim()
  ) {
    index++;
  }

  /*
   제목 수집
  */
  let titleLines = [];

  while (index < lines.length) {

    const line =
      lines[index].trim();

    if (!line) {
      index++;
      break;
    }

    if (
      isSection(line)
    ) {
      break;
    }

    titleLines.push(line);

    index++;
  }

  html += `
    <div class="title">
      ${titleLines.join("<br>")}
    </div>
  `;

  /*
   본문 파싱
  */
  for (
    let i = index;
    i < lines.length;
    i++
  ) {

    let line =
      lines[i].trim();

    if (!line) {
      continue;
    }

    /*
      본문 - xxx
      서론 - xxx
      결론 - xxx
    */
    if (
      line.startsWith("본문")
    ) {

      html += `
        <div class="section-title">
          본문
        </div>
      `;

      let content =
        line.replace("본문", "")
            .replace("-", "")
            .trim();

      if (content) {

        html += `
          <div class="body-text">
            ${content}
          </div>
        `;
      }

      continue;
    }

    if (
      line.startsWith("서론")
    ) {

      html += `
        <div class="section-title">
          서론
        </div>
      `;

      let content =
        line.replace("서론", "")
            .replace("-", "")
            .trim();

      if (content) {

        html += `
          <div class="body-text">
            ${content}
          </div>
        `;
      }

      continue;
    }

    if (
      line.startsWith("본론")
    ) {

      html += `
        <div class="section-title">
          본론
        </div>
      `;

      continue;
    }

    if (
      line.startsWith("결론")
    ) {

      html += `
        <div class="section-title">
          결론
        </div>
      `;

      let content =
        line.replace("결론", "")
            .replace("–", "")
            .replace("-", "")
            .trim();

      if (content) {

        html += `
          <div class="body-text">
            ${content}
          </div>
        `;
      }

      continue;
    }

    /*
      대주제
    */
    if (
      isTopic(line)
    ) {

      html += `
        <div class="topic">
          ${line}
        </div>
      `;

      continue;
    }

    /*
      (1)(2)(3)
    */
    if (
      isDetailLine(line)
    ) {

      html += `
        <div class="detail-line">
          ${normalizeDetailLine(line)}
        </div>
      `;

      continue;
    }

    /*
      1)각인 2)뿌리 3)체질
    */
    if (
  isSubtopic(line)
)

      const subs =
        splitSubtopics(line);

      for (
        const sub of subs
      ) {

        html += `
          <div class="subtopic">
            ${sub}
          </div>
        `;
      }

      continue;
    }

    /*
      일반 텍스트
    */
    html += `
      <div class="body-text">
        ${line}
      </div>
    `;
  }

  paper.innerHTML = html;
}

/*
 PDF 저장
*/
function downloadPDF() {

  let title =
    document
      .querySelector(".title")
      ?.innerText
      ?.split("\n")[0]
      ?.trim();

  if (!title) {
    title = "message";
  }

  const opt = {
    margin: 0,
    filename: title + ".pdf",
    image: {
      type: "jpeg",
      quality: 1
    },
    html2canvas: {
      scale: 2
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait"
    }
  };

  html2pdf()
    .set(opt)
    .from(paper)
    .save();
}

/*
 최초 실행
*/
renderDocument();
