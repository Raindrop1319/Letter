/**
 * 情书加载与渲染
 * 支持的 letter.txt 标记语法：
 *   # 标题            => 主标题（h1）
 *   ## 副标题         => 副标题（subtitle）
 *   ### 章节          => 段落小标题（h2）
 *   > 引用文字         => 引用块
 *   --- 或 ***         => 分割线
 *   [img: 路径]        => 单独一行：插入图片
 *   [img: 路径 | 描述] => 带说明文字的图片
 *   [signature: 落款] => 替换默认落款
 *   [title: 信件标题] => 替换默认信件标题（顶部 title）
 *   空行              => 段落分隔
 */

(function () {
  const envelope = document.getElementById("envelope");
  const letter = document.getElementById("letter");
  const body = document.getElementById("letterBody");
  const titleEl = document.getElementById("letterTitle");
  const subtitleEl = document.getElementById("letterSubtitle");
  const signatureEl = document.getElementById("letterSignature");
  const closeBtn = document.getElementById("closeBtn");

  envelope.addEventListener("click", openEnvelope);
  envelope.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openEnvelope();
    }
  });

  closeBtn.addEventListener("click", closeLetter);

  loadLetter();

  function openEnvelope(e) {
    if (e && e.isTrusted === false) return;
    if (envelope.classList.contains("opened")) return;
    envelope.classList.add("opened");
    setTimeout(() => {
      envelope.classList.add("gone");
      setTimeout(() => {
        envelope.classList.add("hidden");
      }, 500);
      letter.classList.remove("hiding");
      letter.classList.add("show");
      letter.setAttribute("aria-hidden", "false");
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }, 700);
  }

  function closeLetter() {
    letter.classList.remove("show");
    letter.classList.add("hiding");
    letter.setAttribute("aria-hidden", "true");
    envelope.classList.remove("hidden");
    requestAnimationFrame(() => {
      envelope.classList.remove("gone");
    });
    setTimeout(() => {
      letter.classList.remove("hiding");
      envelope.classList.remove("opened");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 500);
  }

  async function loadLetter() {
    try {
      const url = "letter.txt?t=" + Date.now();
      const res = await fetch(url);
      if (!res.ok) throw new Error("无法读取 letter.txt：" + res.status);
      const text = await res.text();
      renderLetter(text);
    } catch (err) {
      console.error(err);
      body.innerHTML =
        '<p class="loading">读取信件失败，请确认 letter.txt 是否存在。<br/>' +
        '若在本地直接双击 index.html 打开，浏览器会限制读取本地文件，' +
        "请使用本地服务器或部署到 GitHub Pages。</p>";
    }
  }

  function renderLetter(text) {
    const lines = text.replace(/\r\n/g, "\n").split("\n");
    const html = [];
    let paragraph = [];

    const flushParagraph = () => {
      if (paragraph.length) {
        html.push("<p class=\"fade-in\">" + paragraph.join("<br/>") + "</p>");
        paragraph = [];
      }
    };

    for (let raw of lines) {
      const line = raw.trim();

      if (!line) {
        flushParagraph();
        continue;
      }

      // 标题 / 副标题 / 落款 这类元数据
      const titleMatch = line.match(/^\[title:\s*(.+?)\s*\]$/i);
      if (titleMatch) {
        titleEl.textContent = titleMatch[1];
        continue;
      }
      const subtitleMatch = line.match(/^\[subtitle:\s*(.+?)\s*\]$/i);
      if (subtitleMatch) {
        subtitleEl.textContent = subtitleMatch[1];
        continue;
      }
      const sigMatch = line.match(/^\[signature:\s*(.+?)\s*\]$/i);
      if (sigMatch) {
        signatureEl.textContent = sigMatch[1];
        continue;
      }

      // 图片
      const imgMatch = line.match(/^\[img:\s*([^\]|]+?)(?:\s*\|\s*(.+?))?\s*\]$/i);
      if (imgMatch) {
        flushParagraph();
        const src = imgMatch[1].trim();
        const caption = imgMatch[2] ? imgMatch[2].trim() : "";
        html.push(
          '<figure class="fade-in"><img src="' +
            escapeAttr(src) +
            '" alt="' +
            escapeAttr(caption || "letter image") +
            '" loading="lazy" />' +
            (caption
              ? '<figcaption>' + escapeHtml(caption) + "</figcaption>"
              : "") +
            "</figure>"
        );
        continue;
      }

      // 分割线
      if (/^(-{3,}|\*{3,})$/.test(line)) {
        flushParagraph();
        html.push('<hr class="fade-in" />');
        continue;
      }

      // 标题层级
      if (line.startsWith("# ")) {
        titleEl.textContent = line.slice(2).trim();
        continue;
      }
      if (line.startsWith("## ")) {
        subtitleEl.textContent = line.slice(3).trim();
        continue;
      }
      if (line.startsWith("### ")) {
        flushParagraph();
        html.push('<h2 class="fade-in">' + escapeHtml(line.slice(4).trim()) + "</h2>");
        continue;
      }

      // 引用
      if (line.startsWith("> ")) {
        flushParagraph();
        html.push(
          '<blockquote class="fade-in">' +
            escapeHtml(line.slice(2).trim()) +
            "</blockquote>"
        );
        continue;
      }

      // 普通文本（支持简单的行内强调）
      paragraph.push(inlineFormat(escapeHtml(line)));
    }
    flushParagraph();

    body.innerHTML =
      html.join("\n") ||
      '<p class="loading">letter.txt 是空的，写点什么给 TA 吧～</p>';

    // 给 fade-in 元素加上递进延迟，呈现一种"慢慢展开"的感觉
    const items = body.querySelectorAll(".fade-in");
    items.forEach((el, i) => {
      el.style.animationDelay = Math.min(i * 0.08, 1.2) + "s";
    });
  }

  // **加粗** 与 *倾斜*
  function inlineFormat(text) {
    return text
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>");
  }

  function escapeHtml(s) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  function escapeAttr(s) {
    return escapeHtml(s).replace(/"/g, "&quot;");
  }
})();
