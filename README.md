# ARHAT — 床垫品牌网站基础框架

React + Vite + Three.js。英文单页企业站与独立产品页面，适配桌面与移动端，最大版心 1700px。

## 运行

```sh
npm install
npm run dev
```

```sh
npm run build
npm run preview
```

也可以使用 pnpm。开发预览默认地址 http://127.0.0.1:5173 。

## 内容更新

- `src/productContent.js`：品牌信息、两类产品的已确认规格和询价配置。
- `src/main.jsx`：各模块英文内容与产品详情、询价交互。
- `src/ModularScene.jsx`：Three.js 组合床垫；按 5:10:10 厚度比例建模，含绗缝布套、纽扣连接带、单/双面拉链，支持旋转、缩放和分层。
- `src/ModularDetails.jsx`：加厚模块切换、适中/偏硬选择、分层结构说明。
- `src/modular.css`：组合产品模块专用样式。
- `src/styles.css`：暗色视觉、字体、布局、1700px 版心及移动端样式。
- `public/media/`：放置正式品牌视频和图片；首页支持自动播放、静音、循环视频，加载失败回退到 3D 场景。

## 页面

- `/` 首页、产品、公司、工厂、联系模块。
- `/products/modular-combo`：25cm 三层 Combo，可预览加入一层加厚模块后的 35cm 组合。
- `/products/zip-extension`：10cm 双面拉链模块，适中/偏硬两种选项，可单独查看或预览装入 Combo。

正式静态部署时需要将未知路由重写到 `/index.html`（SPA fallback）。

## 当前版本边界

网站品牌为 ARHAT，公司名称为 Arhat trade services LLC.。已确认产品结构：5cm 柔软纽扣上层、10cm 适中中层（连接面单面拉链）、10cm 偏硬底层（连接面单面拉链）；加厚模块为 10cm 双面拉链，提供适中和偏硬两种硬度，安装在中层和底层之间。页面不虚构密度数值或认证。英文产品名为暂定名称，实际长宽、价格和供应选项待确认。三维纹理和五金位置为基于参考图的示意，公司与工厂图片仍为占位素材。

目前没有后端、支付、库存或订单系统。独立产品页支持尺寸/数量选择和询价。未配置 `brand.email` 时下载询价文本，不向任何人发送信息；配置真实邮箱后通过用户邮件客户端发送。真实售价、交易条款和支付服务确定后再接入结账。

公司参考图片来自 Unsplash（https://unsplash.com/photos/1497366754035-f200968a6e72），工厂参考图来自 Umuarama 市政府报道（https://www.umuarama.pr.gov.br/noticias/indstria-e-comrcio/destaque-na-economia-setor-moveleiro-contribui-para-valorizar-o-que-umuarama-produz）。图片已保存在 `public/media/`，仅用于本地概念预览；正式公开上线应替换为公司的自有或已授权素材。字体来自 Google Fonts。

首页 `public/media/combo-hero.webm` 为本项目组合床垫模型录制的 12 秒拆分/合拢循环视频。

## 本地验证

`node scripts/verify-modular.mjs` 检查三层 25cm、四层 35cm、独立 10cm 模块、两种硬度、询价参数、视频、独立路由与移动端溢出。验证脚本使用当前开发设备的 Playwright 和 Edge；换机时需调整 Playwright 导入路径。

## 项目存放位置

当前项目位于 Y:\mweb，后续源码、素材、截图及构建产物统一保存到这里。旧目录为暂存备份，不再用于开发。


## 蓝青波浪主题

GradientWaves 根据用户提供的 React Bits 组件接入，依赖 ogl。全站共享一层蓝色／薄荷青／白色波浪背景；参数位于 src/WaveBackdrop.jsx，主题位于 src/ocean-theme.css。入场 PixelSwap 保留 ARHAT → Build Your Own Sleep 两屏及 2.6 秒柔和衔接。桌面背景限制到约 30fps，手机使用较低质量；减少动态效果设置会停止波浪动画，不支持 WebGL 时保留 CSS 渐变底色。蓝色首页视频位于 public/media/combo-hero-blue.webm。

### Entry animation performance

The intro uses PixelSwap's lightweight SVG clipping mode: one shared incoming layer instead of hundreds of full-screen DOM clones. Keep this mode enabled for the full-screen entry. The 2.6-second home reveal is unchanged.

Mattress scenes are loaded through DeferredMattressScene after the intro and when near the viewport. The hero uses the local video and combo-hero-poster.webp; live 3D is the fallback when the video fails or reduced motion is requested. The wave canvas is capped at 900,000 rendering pixels, with a stable 30 fps animation budget.

Local performance checks: node scripts/profile-entry.mjs <label> and node scripts/verify-entry.mjs (Edge/Playwright paths match this workstation). Profile JSON and preview screenshots are saved in Y:/mweb.
