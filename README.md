# Pricedoge


<img src="https://i.imgur.com/KGTM3gw.png"  width="100" height="100" />
<a href="https://996.icu"><img src="https://img.shields.io/badge/link-996.icu-red.svg" alt="996.icu"></a>



<div style="float: right;"><a href="./README-zh_CN.md">中文文档</a></div>


Chrome extension for price comparison.

## How it works

When you visit a web page, the extension will check the website if it is a goods detail page, search from other platforms, and finally show the result at the top of the current website.

## Extension

You can download the packed crx file at: https://github.com/DimensionFoundation/PriceDoge/raw/master/extension/pricedog.crx

We build the extension using `React` with `Typescript`.  
You can run `npm run build` to build the extension and load unpacked extension from chrome.

Since we don't want to run `npm run eject` which will throw everything from react-scripts that we don't necessarily need, we're using `rewire` to modify some webpack setting. You can check [./extension/scripts/build.js](./extension/scripts/build.js) and [./extension/config/webpack.prod.js](./extension/config/webpack.prod.js) for reference.

### Key pair

The extension will generate a key pair using bip39 once you open the extension's page, you can check [./extension/src/utils/keyStore.ts](./extension/src/utils/keyStore.ts) for reference.

### Content script

You can check all the scripts under [./extension/src/contentHandler](./extension/src/contentHandler) folder.
Every script extends from `IContentHandler` interface and `canHandle()` function will be called every time the user visits a website. `handle()` function will be called if `canHandle()` returns `true`.

### Background script

You can check all the background services under [./extension/src/backgroundService](./extension/src/backgroundService) folder.

### Communication between background script && content script && actual web page

Communication between different context is very important since the same code will be executed from different contexts.  
You can check the [./extension/src/utils/messaging.ts](./extension/src/utils/messaging.ts) file if you're in a hurry :)

Since we don't want to check the context every time, we create a `MessageCenter` to handle all that stuff. `Message.send()` to send a message and `Message.on()` to subscribe.

All messages are typed. See `ITypedMessages` in [./extension/src/utils/messaging.ts](./extension/src/utils/messaging.ts).

### Searching results provider

-   [Amazon](https://amazon.com)
-   [JD.com](https://jd.com)
-   [Newegg](https://newegg.com)
-   [Taobao](https://taobao.com)  
    You can check the [./extension/src/services](./extension/src/services) folder to see the actual code.
    Since Taobao's search is an ajax request, we create a server to complete the search, you can check the [Server](#Server) section to see more.

### Localization

You can add your localization under [./extension/src/i18n` folder just like `en](./extension/src/i18n`folder just like`en) folder.
Use script to check if localization is complete.

> `cd extension`

> `npm run i18n-lint`

## Server

We create a server using `Koa` with Typescript.  
`puppeteer` is used to completing the actual search, you can check [./server/src/taobao.ts](./server/src/taobao.ts) to see more.
