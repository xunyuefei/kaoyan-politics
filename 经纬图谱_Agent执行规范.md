# 📐 考研政治「经纬图谱」— Agent 执行规范与扩充指南

> **目标读者**：任何 AI 语言模型 / Coding Agent（如 Claude, GPT-4, DeepSeek, Kimi 等）。
> **核心用途**：当用户上传新的考研政治历史时期素材（如抗日战争、解放战争、社会主义改造等）时，直接按照本规范进行无缝扩充。

---

## 📂 项目结构说明

```
政治/
├── index.html                   ← 单文件 Web 应用（HTML + CSS + JS 全部内嵌）
└── 经纬图谱_Agent执行规范.md      ← 本标准执行文档（供各模型遵循）
```

> ⚠️ **关键原则**：
> 1. 本项目采用**自包含单文件架构（Zero-Build, Pure HTML/CSS/JS）**，无 npm、无框架依赖，双击浏览器即开即用。
> 2. 所有对图谱内容的扩充，**只需在 `index.html` 对应位置按模板追加/更新**，切勿推翻已有样式或破坏 DOM 树层级。

---

## 🧭 系统全局架构全览

```
index.html
├── <style>                         ← 集中样式区
│   ├── :root { ... }               ← 暗色主题 Design Tokens
│   ├── [data-theme="light"] { ... } ← 亮色主题 Design Tokens
│   ├── .node, .card, .trap, .kw    ← 时间线与卡片、题眼、关键词
│   ├── .toolbar, .minimap          ← 工具栏与右侧迷你导航
│   ├── .kmap-*, .connection-*      ← 全局知识地图与跨时期关联线
│   ├── .stats-*, .quiz-*           ← 错题统计面板与自测模式
│   └── @media print { ... }        ← PDF 导出打印样式（强制展开全部题眼）
│
├── <body>
│   ├── .toolbar                    ← 右上角固定工具栏（🌓主题 / 🗺️地图 / 📊统计 / 📤导出PDF）
│   ├── .sticky-dock                ← ⭐ 吸顶悬浮章节导航坞（7大篇章瞬时直达 + 模式切换）
│   ├── .app
│   │   ├── .hero                   ← 标头区与章节导航胶囊组（36节点/108理论词/36题眼/20著作）
│   │   ├── .legend & .controls     ← 搜索框与卡片筛选栏（含专题雷达与4K避坑直达按钮）
│   │   ├── .timeline               ← ⭐【时间维】双线时间轴（含7大篇章Banner与36大考点节点）
│   │   │   ├── .period-banner      ← 篇章分界旗标（旧民主/五大革命/土地/抗战/解放/探索/新时代）
│   │   │   ├── .timeline__axis     ← 中央纵向基准轴
│   │   │   ├── .node (36个)        ← 每个历史考点节点（史纲卡片 + 理论卡片 + 题眼陷阱）
│   │   │   └── .chapter-footer     ← 章末承接与流转按钮
│   │   ├── .radar-section          ← ⭐【专题维】高频多选横向对比雷达（土地政策/毛思阶段/统一战线演变）
│   │   ├── .rules-section          ← ⭐【应试维】史纲毛概4K避坑秒杀法则（论战切割/宣言书匹配/飞跃定性）
│   │   ├── .connections-section    ← 🔗 跨时期核心概念关联脉络
│   │   └── .footer
│   ├── .minimap                    ← 右侧快速定位导航点
│   ├── .kmap-overlay               ← 🗺️ 全局知识地图弹窗（全历史时期100%全景激活）
│   ├── .stats-overlay              ← 📊 错题与薄弱点统计弹窗
│   ├── .works-overlay              ← 📚 20部核心必考著作文献速查背诵宝库
│   └── .quiz-overlay               ← ❓ 极速自测答题弹窗（28道真题风考题）
│
└── <script>                        ← 数据与交互控制
    ├── quizData[]                  ← 自测题库数组（28道题）
    ├── connectionData[]            ← 跨时期概念演化链路数据（贯通1840—2026+）
    ├── periodsData[]               ← 全局时期总览与完成状态（7大时期全满贯）
    ├── selectChapter()             ← 章节导航与单章专注过滤驱动
    ├── switchRadarTab()            ← 专题雷达 Tab 切换驱动
    ├── focusStat()                 ← 顶部统计卡片点击聚焦与联动展开
    └── Stats 统计逻辑              ← 基于 localStorage 的错题累加与正确率计算
```

---

## 🛠️ 新增历史时期的标准扩充 SOP（7 步法）

当用户提供新时期的考研大纲或复习资料时，请按顺序执行以下 7 步：

### 步骤 1：在 `.timeline` 中插入新的考点节点（`.node`）

找到 `<!-- /timeline -->` 之前的末尾位置，插入新的 `.node` 块。
**基本结构**：左侧是史纲历史脉络，中间是时间圆点，右侧是毛概理论成果，下方横跨展开「易错题眼」。

```html
<!-- ========== NODE: [事件名称] [年份] ========== -->
<div class="node" data-year="[年份或代号，如 1937]" data-tags="history theory trap">
  <!-- 1. 左侧：史纲卡片 -->
  <div class="card card--history">
    <span class="card__label card__label--history">📜 史纲</span>
    <h3 class="card__title">[历史事件/会议名称]</h3>
    <div class="card__body">
      <div style="font-size:0.78rem;color:var(--text-muted);margin-bottom:8px;">[具体时间 · 地点 · 背景]</div>
      <ul>
        <li>[关键史实 1，关键词使用 <span class="kw kw--history">高亮词</span> 包裹]</li>
        <li>[关键史实 2，核心地位用 <span class="kw kw--important">重要概念</span> 包裹]</li>
      </ul>
    </div>
  </div>

  <!-- 2. 中央：时间圆点 -->
  <div class="node__dot-wrap">
    <div class="node__dot node__dot--history">
      <span class="node__year">[年份文字]</span>
    </div>
  </div>

  <!-- 3. 右侧：毛概理论成果卡片 -->
  <div class="card card--theory">
    <span class="card__label card__label--theory">📐 毛概</span>
    <h3 class="card__title">[理论成果 / 著作 / 思想命题]</h3>
    <div class="card__body">
      <ul>
        <li>[理论核心论断，理论关键词使用 <span class="kw kw--theory">理论高亮</span> 包裹]</li>
        <li>[代表作或里程碑表述]</li>
      </ul>
    </div>
  </div>

  <!-- 4. 底部横跨：题眼陷阱辨析（考研极易挖坑点） -->
  <div class="trap" data-trap="[唯一标识]" onclick="this.classList.toggle('trap--expanded')">
    <div class="trap__icon">⚠️</div>
    <div class="trap__content">
      <div class="trap__label">[陷阱特征，如：时态陷阱 / 概念偷换 / 地位混淆]</div>
      <div class="trap__text">
        [清晰的一句话辨析，重点警示使用 <strong>加粗</strong> 或 <span class="diff-mark">红字</span>]
      </div>
      <div class="trap__detail">
        <table class="compare-table">
          <thead>
            <tr>
              <th>精准正解（命题正确表述）</th>
              <th>迷惑混淆点（常见错误选项）</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>[正确说法及原话出处]</td>
              <td>[命题人常见偷换概念或时态倒错的陷阱]</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="trap__toggle">▼ 展开对比</div>
    </div>
  </div>
</div>
```

---

### 步骤 2：在右侧悬浮迷你导航（`.minimap`）添加锚点

在 `index.html` 的 `<nav class="minimap">` 内部，按时间顺序追加定位圆点：

```html
<div class="minimap__dot" data-target="[对应node的data-year]">
  <span class="minimap__dot-label">[事件简短名称，如：洛川会议]</span>
</div>
```

---

### 步骤 3：在 JS 中扩充真题风自测题（`quizData`）

在 `<script>` 内的 `const quizData = [...]` 中追加 2~4 道紧扣该考点的单选或辨析题：

```javascript
{
  id: 'q8',                      // 必须全局唯一
  q: '【多选题/单选】毛泽东在某著作中首次明确提出了...',
  topic: '抗战路线与方针',          // 考点类别（错题统计面板中归纳薄弱点使用）
  options: [
    '错误选项 A',
    '正确选项 B',
    '干扰选项 C',
    '时态错置选项 D'
  ],
  correct: 1,                    // 正确选项下标：0=A, 1=B, 2=C, 3=D
  explain: '【题眼点睛】此处易混淆...1937年洛川会议明确的是...而非...'
}
```

---

### 步骤 4：激活与扩充跨时期关联线（`connectionData`）

在 `<script>` 内的 `const connectionData = [...]` 中：
1. 如果该时期推进了现有概念（如「实事求是」、「土地政策」、「统一战线」），将该节点从 `active: false` 变更为 `active: true`。
2. 如需新增演化主线，按格式追加：

```javascript
{
  name: '思想路线演进',
  icon: '💡',
  color: '#6366f1',
  desc: '从初步萌芽到延安整风确立，再到新时期解放思想',
  nodes: [
    { event: '反对本本主义', time: '1930', period: '土地革命', active: true },
    { event: '延安整风 / 改造我们的学习', time: '1941', period: '抗日战争', active: true },
    { event: '十一届三中全会', time: '1978', period: '改革开放', active: false }
  ]
}
```

---

### 步骤 5：更新全局知识地图完成状态（`periodsData`）

在 `<script>` 内的 `const periodsData = [...]` 中，将已完成添加的时期的 `active` 属性设为 `true`：

```javascript
{ id: 'anti-japan', name: '抗日战争时期', dates: '1937—1945', emoji: '⚔️', active: true, color: '#3b82f6' }
```

---

### 步骤 6：更新顶部统计看板数字与交互

根据本次添加的节点量，微调 `.stats` 中的展示指标：
- 史纲历史事件总数（点击联动筛选历史并滚动聚焦）
- 毛概理论关键词总数（点击联动筛选理论并脉冲高亮关键词）
- 题眼易错辨析总数（点击联动筛选题眼并一键展开所有对比表）
- 经典著作/文献总数（点击调出《核心著作极速背诵卡》弹窗）

---

---

### 步骤 7：章节导航与吸顶悬浮条同步维护

为解决知识点繁多导致的“冗长滑动”问题，图谱内置了**章节导航与单章专注系统**。当新增时期时，请同步维护：
1. **顶部 Hero 导航胶囊（`.chapter-nav`）**：在 `#heroChapterNav` 中新增该时期的按钮，声明 `data-chapter="<periodId>"` 并标注年代与考点数。
2. **吸顶悬浮导航条（`.sticky-dock`）**：在 `#stickyDock` 中同步新增对应的紧凑胶囊按钮。
3. **篇章 Banner 属性**：在新增时期的 `.period-banner` 上必须同时设置 `id="period-<periodId>"` 与 `data-period-banner="<periodId>"`。
4. **章末承接卡片（`.chapter-footer`）**：在该时期所有考点 Node 结束后插入 `.chapter-footer`，引导学生一键跳转到下一章节或专题雷达。

---

### 步骤 8：验证与自检清单

新增内容后，在浏览器中检查：
1. **章节导航切换**：点击 Hero 导航或吸顶条中的章节胶囊，能瞬间聚焦该章节，且单章专注模式下能正确隐藏其他章节节点。
2. **暗色/亮色模式**：文字色彩对比度正常，对比表格清晰可见。
3. **搜索与筛选**：输入新时期的关键词能精准筛选，无脚本报错。
4. **自测答题与错题统计**：新题目能正常作答，错题能正确计入薄弱考点列表。
5. **PDF 导出**：点击右上角 📤 导出按钮，所有题眼卡片能自动展开并适合 A4 打印。

---

## 🎨 样式字典与高亮规则参考

| 标签 / 类名 | 语义属性 | 渲染色彩 |
| :--- | :--- | :--- |
| `<span class="kw kw--history">` | 史纲核心会议、战役、人物、政策 | 琥珀金 (`#f59e0b`) |
| `<span class="kw kw--theory">` | 毛中特概念、著作、理论命题 | 靛蓝紫 (`#6366f1`) |
| `<span class="kw kw--important">` | 第一/标志/根本/精髓等最高级词眼 | 翡翠绿 (`#10b981`) |
| `<span class="diff-mark">` | 易错混淆词、警示反例 | 警示红 (`#ef4444`) |

