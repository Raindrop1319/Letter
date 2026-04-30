# 一封信 · Letter

一个用纯静态网页写成的"情书"页面：进入是一封粉色的信封，点一下就缓缓展开，露出可滚动的信纸内容。**所有文字与图片都通过同目录下的 `letter.txt` 配置**，不需要懂代码就能改。

部署到 GitHub Pages 之后，你只需要发一个链接，对方就能在浏览器（手机/电脑均可）打开看到。

---

## 目录结构

```
Letter/
├─ index.html       网页入口（不要改名）
├─ style.css        样式
├─ script.js        渲染逻辑
├─ letter.txt       ← 你只需要改这个文件
├─ images/          ← 图片放这里
│   ├─ photo1.jpg
│   └─ photo2.jpg
└─ README.md
```

---

## 一、修改信件内容（letter.txt）

`letter.txt` 是一个普通文本文件，用记事本 / VSCode / 任何编辑器都能打开。
保存时请使用 **UTF-8 编码**，否则中文会乱码。

支持以下标记（不熟悉的话可以直接照着示例改）：

| 写法 | 效果 |
| --- | --- |
| `[title: 致最亲爱的你]` | 信件顶部的大标题 |
| `[subtitle: A LETTER FOR YOU]` | 顶部副标题 |
| `[signature: —— 永远爱你的我]` | 右下角落款 |
| `### 章节小标题` | 段落小标题 |
| 普通一行文字 | 一段话；空行表示新段落 |
| `> 引用一句话` | 显示为优雅的引用块 |
| `**加粗**` | **加粗** |
| `*倾斜*` | *倾斜* |
| `---` 或 `***` | 一条分割线 |
| `[img: images/photo1.jpg]` | 插入一张图片 |
| `[img: images/photo1.jpg \| 图片说明]` | 带说明文字的图片 |

> 提示：`[img: ...]` 必须独占一行。

### 示例片段

```
[title: 致我最亲爱的你]
[subtitle: A LETTER FOR YOU]

### 写在最前

亲爱的：

见字如面。当你打开这封信的时候，希望你正坐在一个安静温柔的地方。

> 这世上最好的话，是"今天也想见你"。

[img: images/photo1.jpg | 那天的你，是我见过最好看的风景]

[signature: —— 永远爱你的我]
```

---

## 二、添加图片

1. 把图片放进 `images/` 文件夹
2. 在 `letter.txt` 里用 `[img: images/你的文件名.jpg]` 引用

建议：

- 文件名用英文或数字，避免空格和中文
- 单张图片最好压缩到 1MB 以内，加载更快
- 推荐长边 1200px 左右

---

## 三、本地预览

> 直接双击 `index.html` 打开，浏览器出于安全限制可能读不到 `letter.txt`，所以推荐用一个本地小服务器预览。

任选一种方式：

### 方法 A · Python（最方便）

```bash
# 在 Letter 目录下打开终端
python -m http.server 8000
```

然后浏览器访问 <http://localhost:8000>

### 方法 B · Node.js

```bash
npx serve .
```

### 方法 C · VSCode 插件

安装 **Live Server** 插件，右键 `index.html` → "Open with Live Server"。

---

## 四、部署到 GitHub Pages（生成可分享链接）

### 步骤 1 · 注册并登录 GitHub
打开 <https://github.com> 注册账号（免费）。

### 步骤 2 · 新建仓库
- 点右上角 **+** → **New repository**
- 仓库名随便取，例如 `letter`（**只能用英文/数字/连字符**）
- 选择 **Public**（公开，这样别人才能访问）
- 不要勾选 "Add a README"，直接 **Create repository**

### 步骤 3 · 上传文件（最简单的网页拖拽方式）
1. 进入刚创建的仓库页面
2. 点击页面中央的 **uploading an existing file** 链接
3. 把 `Letter` 文件夹里的 **所有内容**（注意是文件夹里的内容，不是文件夹本身）拖进去：
   - `index.html`
   - `style.css`
   - `script.js`
   - `letter.txt`
   - `images/` 整个文件夹
   - `README.md`
4. 滚到底部点 **Commit changes**

### 步骤 4 · 启用 Pages
1. 仓库页面顶栏 → **Settings**
2. 左边菜单 → **Pages**
3. **Source** 选择 `Deploy from a branch`
4. **Branch** 选择 `main`，文件夹选 `/ (root)`，点 **Save**
5. 等待 1~2 分钟，页面顶部会出现：

   > Your site is live at **https://你的用户名.github.io/letter/**

把这个链接发给 TA 就可以啦 💌

### 步骤 5 · 以后修改内容
- 想换文字 → 在 GitHub 仓库里点开 `letter.txt` → 右上角铅笔图标 → 改完点 **Commit changes**
- 想换/加图片 → 进入 `images/` 文件夹 → **Add file → Upload files**
- 等 1 分钟左右，刷新链接就能看到新内容

---

## 五、（可选）使用 Git 命令行部署

如果你已经会用 git：

```bash
cd Letter
git init
git add .
git commit -m "first letter"
git branch -M main
git remote add origin https://github.com/你的用户名/letter.git
git push -u origin main
```

然后按上面"步骤 4"启用 Pages 即可。

---

## 六、常见问题

**Q：打开后只看到信封，点了没反应？**
请确认通过 `http(s)://` 访问（GitHub Pages 或本地服务器），不要直接双击 html 文件。

**Q：中文显示乱码？**
保存 `letter.txt` 时编码要选 **UTF-8**。Windows 记事本另存为时可以选编码。

**Q：图片不显示？**
检查 `letter.txt` 里写的路径和 `images/` 目录里实际文件名是否完全一致（大小写、扩展名都要一样）。

**Q：想换背景颜色 / 字体？**
打开 `style.css`，最上面的 `:root { ... }` 里改这几个变量就行：
`--bg-1`, `--bg-2`, `--accent`, `--paper` 等。

---

愿这封信能稳稳地送到 TA 手里。🌸
