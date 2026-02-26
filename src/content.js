(() => {
  const OPEN_BTN_ID = "arxiv-cn-open-btn";
  const OVERLAY_ID = "arxiv-cn-overlay";

  function getPaperIdFromUrl(url) {
    const path = new URL(url).pathname;
    const m = path.match(/^\/abs\/(.+)$/);
    return m ? m[1] : null;
  }

  function buildGithubPdfUrl(paperId) {
    const cfg = window.ARXIV_CN_VIEWER_CONFIG || {};
    const owner = cfg.githubOwner;
    const repo = cfg.githubRepo;
    const branch = cfg.branch || "main";
    const basePath = cfg.basePath ? cfg.basePath.replace(/^\/+|\/+$/g, "") : "";
    const mapped = typeof cfg.mapPaperIdToRelativePath === "function"
      ? cfg.mapPaperIdToRelativePath(paperId)
      : `${paperId}.pdf`;
    const cleanMapped = String(mapped).replace(/^\/+/, "");

    if (!owner || !repo) {
      throw new Error("请在 src/config.js 中配置 githubOwner 和 githubRepo");
    }

    const fullPath = [basePath, cleanMapped].filter(Boolean).join("/");

    if (cfg.useRawGithub !== false) {
      const encodedPath = fullPath
        .split("/")
        .map((seg) => encodeURIComponent(seg))
        .join("/");
      return `https://raw.githubusercontent.com/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/${encodeURIComponent(branch)}/${encodedPath}`;
    }

    return `https://github.com/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/blob/${encodeURIComponent(branch)}/${fullPath}?raw=1`;
  }

  function buildArxivPdfUrl(paperId) {
    return `https://arxiv.org/pdf/${paperId}.pdf`;
  }

  function createOpenButton(paperId) {
    if (document.getElementById(OPEN_BTN_ID)) {
      return;
    }

    const btn = document.createElement("button");
    btn.id = OPEN_BTN_ID;
    btn.type = "button";
    btn.textContent = "中英双栏 PDF";
    btn.addEventListener("click", () => openSplitView(paperId));
    document.body.appendChild(btn);
  }

  function openSplitView(paperId) {
    if (document.getElementById(OVERLAY_ID)) {
      return;
    }

    const arxivPdfUrl = buildArxivPdfUrl(paperId);
    let translatedPdfUrl;

    try {
      translatedPdfUrl = buildGithubPdfUrl(paperId);
    } catch (err) {
      alert(err.message || "配置错误");
      return;
    }

    const overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;

    const toolbar = document.createElement("div");
    toolbar.id = "arxiv-cn-toolbar";

    const title = document.createElement("div");
    title.id = "arxiv-cn-title";
    title.textContent = `arXiv: ${paperId}`;

    const links = document.createElement("div");
    links.id = "arxiv-cn-links";

    const originLink = document.createElement("a");
    originLink.href = arxivPdfUrl;
    originLink.target = "_blank";
    originLink.rel = "noreferrer";
    originLink.textContent = "打开原文";

    const transLink = document.createElement("a");
    transLink.href = translatedPdfUrl;
    transLink.target = "_blank";
    transLink.rel = "noreferrer";
    transLink.textContent = "打开中文翻译";

    const closeBtn = document.createElement("button");
    closeBtn.id = "arxiv-cn-close";
    closeBtn.type = "button";
    closeBtn.textContent = "关闭";
    closeBtn.addEventListener("click", () => overlay.remove());

    links.appendChild(originLink);
    links.appendChild(transLink);
    links.appendChild(closeBtn);

    toolbar.appendChild(title);
    toolbar.appendChild(links);

    const panes = document.createElement("div");
    panes.id = "arxiv-cn-panes";

    const left = document.createElement("iframe");
    left.className = "arxiv-cn-pane";
    left.src = arxivPdfUrl;
    left.title = "arXiv 原文 PDF";

    const right = document.createElement("iframe");
    right.className = "arxiv-cn-pane";
    right.src = translatedPdfUrl;
    right.title = "中文翻译 PDF";

    const errBar = document.createElement("div");
    errBar.id = "arxiv-cn-error";
    errBar.textContent = "若右侧加载失败，请点击上方“打开中文翻译”。";

    right.addEventListener("load", () => {
      errBar.style.display = "none";
    });

    right.addEventListener("error", () => {
      errBar.style.display = "block";
    });

    panes.appendChild(left);
    panes.appendChild(right);

    overlay.appendChild(toolbar);
    overlay.appendChild(panes);
    overlay.appendChild(errBar);

    document.body.appendChild(overlay);
  }

  const paperId = getPaperIdFromUrl(window.location.href);
  if (!paperId) {
    return;
  }

  createOpenButton(paperId);
})();
