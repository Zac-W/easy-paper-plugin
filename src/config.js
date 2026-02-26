(() => {
  // 修改这里为你的仓库信息。
  window.ARXIV_CN_VIEWER_CONFIG = {
    githubOwner: "your-org-or-user",
    githubRepo: "your-repo",
    branch: "main",
    basePath: "translated-papers",
    // true: 使用 raw.githubusercontent.com 直链。
    useRawGithub: true,
    // 论文 id 到文件名的映射，默认 <paperId>.pdf。
    mapPaperIdToRelativePath(paperId) {
      return `${paperId}.pdf`;
    }
  };
})();
