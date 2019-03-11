# Pricedoge

<div style="float: right;"><a href="./README-zh_CN.md">English document</a></div>

一个比较商品价格的 Chrome 扩展

## 原理

当你访问一个网页时，这个扩展会检查它是不是商品详情页，然后从其他平台搜索相同商品的价格，结果会显示在当前网页的顶部。

## 扩展

本扩展使用了 React 和 Typescript。
你可以运行 `npm run build` 来编译本扩展，然后在 Chrome 的扩展管理中`加载已解压的扩展`。
我们不想使用 `npm run eject`，这样会从 react-scripts 里 eject 出一堆不需要的东西，所以我们使用 `rewire` 来修改 webpack 配置。
你可以看看 [./extension/scripts/build.js](./extension/scripts/build.js) 和 [./extension/config/webpack.prod.js](./extension/config/webpack.prod.js)。

### 密钥对

当你打开扩展页时，本扩展会使用 bip39 生成一对密钥对，详情请见 [./extension/src/utils/keyStore.ts](./extension/src/utils/keyStore.ts)。

### Content script

所有的 Content script 都在 [./extension/src/contentHandler](./extension/src/contentHandler) 目录下。
每个脚本都继承了 `IContentHandler`。
`canHandle()` 会在每次访问页面时被调用。如果 `canHandle()` 返回了 `true`，`handle()` 会被调用。

### Background script

所有的 Background script 都在 [./extension/src/backgroundService](./extension/src/backgroundService) 目录下。

### Background script、Content script 与网页之间的通信

在不同的上下文之间通信很重要，因为相同的代码会在不同的上下文里执行。
详情见 [./extension/src/utils/messaging.ts](./extension/src/utils/messaging.ts)。  
为了避免每次都检查当前上下文，我们有一个 `MessageCenter` 来处理这些事情。
用 `Message.send()` 发送消息，用 `Message.on()` 订阅。

所有的消息都是有类型的。见类型 `ITypedMessages`。

### 商品结果提供商

-   [亚马逊](https://amazon.com)
-   [京东](https://jd.com)
-   [Newegg](https://newegg.com)
-   [淘宝](https://taobao.com)

详情见 [./extension/src/services](./extension/src/services)。
淘宝的搜索请求需要额外的服务器辅助。见 [服务器](#服务器) 一节。

### 本地化

本地化文本储存在 [./extension/src/i18n`中，以`en](./extension/src/i18n`中，以`en) 为基准。
使用以下脚本检查本地化是否完整。

> `cd extension`

> `npm run i18n-lint`

## 服务器

服务器使用了 Typescript + Koa。
`puppeteer` 用来完成搜索请求。详情见 [./server/src/taobao.ts](./server/src/taobao.ts)。
