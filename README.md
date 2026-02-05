# Simple Currency Converter（极简汇率转换）

一个基于 **Vue 3 + TypeScript + Vite** 的前端小项目：输入金额与币种，获取最新汇率并完成换算；支持收藏常用货币对、保留最近 5 条转换记录。

- **技术栈**：Vue 3、TypeScript、Vite、Pinia、Axios、Element Plus、TailwindCSS
- **数据来源**：ExchangeRate-API（v6）

## 功能概览

- **实时换算**：根据“持有币种”拉取最新汇率，计算目标币种金额
- **币种筛选**：下拉选择支持搜索过滤
- **一键互换**：快速交换“持有/兑换”币种
- **收藏常用汇率对**：点击结果区收藏，常用列表一键加载
- **转换历史**：自动记录最近 5 条（LocalStorage 持久化）
- **统一错误提示**：Axios 拦截器统一处理网络/接口错误并提示

## 面试官可关注的实现点

- **状态管理与持久化**：Pinia Store 维护币种、汇率缓存、收藏/历史，并将收藏与历史写入 LocalStorage
- **API 分层**：
  - `src/api/request.ts` 封装 Axios 实例（baseURL、超时、响应拦截器）
  - `src/api/exchange.ts` 封装汇率接口（通过环境变量读取 API Key）
- **类型安全**：对汇率响应结构定义 `ExchangeRateResponse`，并补充 `vite-env.d.ts` 让 `import.meta.env` 有类型提示
- **安全配置**：API Key 通过 `VITE_API_KEY` 注入，不在仓库中硬编码；`.env` 已加入 `.gitignore`

## 项目结构

```
src/
  api/
    request.ts        # Axios 封装与拦截器
    exchange.ts       # 汇率接口封装
  store/
    currency.ts       # Pinia：汇率缓存/收藏/历史
  views/
    HomeView.vue      # 主页面：输入、选择、转换、收藏
  components/
    HistoryList.vue   # 历史记录展示（最近 5 条）
  utils/
    format.ts         # 金额/时间格式化
```

## 本地运行

1) 安装依赖

```bash
npm install
```

2) 配置环境变量（项目根目录新建 `.env`）

```bash
VITE_API_KEY=你的_exchangerate_api_key
```

3) 启动开发服务器

```bash
npm run dev
```

## 构建

```bash
npm run build
```

## 部署到 Vercel

- 导入 GitHub 仓库
- 在 Vercel 项目设置中添加环境变量：`VITE_API_KEY`
- 其余默认即可（Vite 项目常见配置：Build=`npm run build`，Output=`dist`）
- 修改环境变量后需要重新部署（Redeploy）才会生效

## 后续可优化方向

- 汇率缓存策略（按 baseCurrency 缓存/过期策略），减少重复请求
- 使用 `/codes` 完整展示“币种名称 + 代码”，提升可用性
- 增加测试：`utils` 单元测试、核心交互的 E2E 测试
- 可访问性与国际化（i18n）
