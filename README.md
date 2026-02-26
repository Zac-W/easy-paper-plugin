# arXiv 中文翻译双栏插件

这个 Chrome 插件会在 `https://arxiv.org/abs/<paper-id>` 页面注入一个按钮。
点击后弹出双栏阅读层：
- 左侧：arXiv 原文 PDF
- 右侧：GitHub 仓库里按 paper id 映射的中文翻译 PDF

## 1. 配置你的 GitHub 仓库

编辑文件：`src/config.js`

```js
window.ARXIV_CN_VIEWER_CONFIG = {
  githubOwner: "your-org-or-user",
  githubRepo: "your-repo",
  branch: "main",
  basePath: "translated-papers",
  useRawGithub: true,
  mapPaperIdToRelativePath(paperId) {
    return `${paperId}.pdf`;
  }
};
```

例如：
- arXiv 页面：`https://arxiv.org/abs/2401.01234`
- 对应中文 PDF 路径：`translated-papers/2401.01234.pdf`
- 最终 URL：
  `https://raw.githubusercontent.com/<owner>/<repo>/<branch>/translated-papers/2401.01234.pdf`

## 2. 加载插件

1. 打开 Chrome 的 `chrome://extensions/`
2. 打开右上角“开发者模式”
3. 点击“加载已解压的扩展程序”
4. 选择本目录：`easy-paper-plugin`

## 3. 使用

1. 打开任意 arXiv 论文摘要页（`/abs/...`）
2. 点击右下角 `中英双栏 PDF`
3. 在覆盖层中并排查看原文和中文翻译

## 4. 常见自定义

如果你的文件名不是 `<paperId>.pdf`，可以改映射逻辑：

```js
mapPaperIdToRelativePath(paperId) {
  return `cn-${paperId}.pdf`;
}
```

如果你希望把旧式 arXiv id（包含 `/`）映射成单文件名：

```js
mapPaperIdToRelativePath(paperId) {
  return `${paperId.replace('/', '_')}.pdf`;
}
```
