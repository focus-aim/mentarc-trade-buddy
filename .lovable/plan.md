## 目标

把「资源管理」重构为两大板块：**文件资源** 与 **记忆资源**，各自带二级分类。

## 信息架构

```text
资源管理
├── 文件资源（一级 Tab）
│   └── 二级筛选：全部 / 分析报告 / 报价单 / 图册 / 图片
└── 记忆资源（一级 Tab）
    └── 二级筛选：全部 / 技能 / 经验
```

## 页面设计

顶部：标题「资源管理」+ 副标题（历史会话沉淀的文件与记忆，统一归档）+ 右上角保留静态「同步至MIC」按钮。

一级 Tab（胶囊式，沿用现有 primary 实心样式）：文件资源（n）、记忆资源（n）。

二级分类：一级 Tab 下方一行轻量 chip（灰底/描边，选中态用 primary/10 + primary 文字），带数量。

内容区：
- 文件资源：默认列表形式（图标 + 名称 + 「来自会话 · 日期 · 大小」+ 收藏/回溯按钮）。当选中「图片」分类时切换为现有的图片网格卡片；「全部」时图片以列表项形式混排（缩略图代替图标）。
- 记忆资源：列表形式，左侧维度图标（技能 = Sparkles，经验 = Lightbulb），标题 + 描述 + 「来自会话 · 日期」+ 收藏/回溯按钮。

交互沿用现有：收藏 toast、回溯会话 toast、Tooltip、空状态提示（「该分类下暂无资源」）。

## 数据（静态示例）

文件项增加 `category: "report" | "quote" | "album" | "image"` 字段：
- 分析报告：Bergmann 询盘分析报告.pdf、热门产品词_趋势报告.xlsx
- 报价单：外贸报价单模板.xlsx、Bergmann PI 报价单.pdf
- 图册：保温杯产品图册.pdf、公司实力介绍图册.pdf
- 图片：沿用现有 4 张 Unsplash 图

记忆项 `kind: "skill" | "experience"`：
- 技能：AI 麦可、营销视频、报价单生成（沿用现有 SKILLS 数据）
- 经验：强化 LED 产品卖点表达、德国买家偏好系统化议价应对、样品寄送前先确认清关资料

## 技术细节

- 仅改 `src/components/ResourceLibraryView.tsx`，单文件重写；`src/pages/Index.tsx` 的接入方式不变。
- 状态：`tab: "file" | "memory"`、`fileCat`、`memoryKind`、`favorites`（现有逻辑保留）。
- 保持玻璃拟态风格：`rounded-2xl border-border/60 bg-card/80 backdrop-blur-sm`，无硬编码颜色。
