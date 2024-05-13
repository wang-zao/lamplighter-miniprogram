# 星球点灯人 mini program版本

## 一、技术栈

uni-app
three.js

## 二、项目启动方式

### 1.环境安装

首先要保证本机已经安装了node.js和yarn。没接触过的同学可以看一下官网，了解一下他们是干啥的。
如果没有安装的话，需要安装这两个东西，具体参考：

http://nodejs.cn/download/
https://yarn.bootcss.com/docs/install/#mac-stable

同时还要记得下载微信开发者工具：

https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html

IDE用vscode或者hbuilder均可。

### 2.项目启动

首先安装这个项目的环境依赖。在命令行中切换到这个项目，然后运行
```
yarn install
```
这样我们这个项目的依赖就都被下载到了node_modules这个文件夹里，现在就可以运行项目了。（这个文件夹的东西在gitignore里面，意味着每次git更新不会管这个文件夹里的任何东西，需要开发者首次clone时自己yarn install）
接下来我们就可以跑这个项目。运行下面这个命令是普通web版本：

```
export NODE_OPTIONS=--openssl-legacy-provider
yarn serve
```
我们不运行这个命令，因为我们开发的是微信小程序。我们首先要运行这个命令：

```
yarn run dev:mp-weixin
```
这个是uniapp把现在的代码编译打包成微信小程序能看懂的东西的指令。
运行完之后，我们可以看到问我们的项目里面多了下面这样一个路径：

```
dist/dev/mp-weixin
```

千万注意！一会用开发者工具导入的时候，就要选择这个路径导入。
接下来我们打开微信开发者工具，登录一下自己的账号，选择导入项目，导入这个项目，输入我们的appid：
```
wx3863a10505055d58
```
然后就可以导入项目。这个时候可能会遇到没有开发权限的问题，如果出现请联系王凿在小程序后台添加开发者权限，然后就可以访问项目了。
如果遇到接口没法访问的问题，比如看不到关卡选择和城市的数据库，则需要在开发者工具右上角-Details-Local Settings-Dose not verify valid domain names这个选项打上对钩，就可以了。
只要前面yarn run顺利，就可以热更新，每次代码更改后保存，terminal会自动刷新dist/dev/mp-weixin的内容，微信开发者工具也会刷新小程序，看到你刚才的更改。

## 三、项目打包
这个是上线前需要干的，我们暂时用不上。
```
yarn build
```

## 四、目前的开发任务

### 1 设备选择

这版小程序是王凿半年前搞出来的。当时的后端使用的是微信云开发，数据库和后端都在微信提供的一个服务里面，因此不需要等待后端的同学配置https的域名。现在等到后端搞定https后，我们就应该可以真机调试的时候也访问后端接口了。这一点很重要，真机调试和微信开发者工具模拟的效果可能大相径庭。

### 2 总体任务
稍加改动地把现在上线的星球点灯人web版迁移到这个微信小程序里。

https://github.com/wang-zao/lamplighter-frontend

如果看过代码的同学都会发现，两个项目的写法和技术栈差别还是较大的。web版是vue+typescript装饰器写法。小程序是uniapp+vue+typescript非装饰器写法。其中最难的部分是three.js地球绘图，也是我们的核心需求。

王凿这两天实现了前后端接口交互的迁移工作。我们利用起来了最新的后端。

但现在，地球的现实出了问题。需要大家着重研究 src/components/earth-globe.vue 这个文件，看看出了什么问题，地球显示不出来了。如果一切正常，游玩界面应该长这样：

https://c3l9ptj96e.larksuite.com/wiki/wikusUTFwCkF8yFZN9ODmNV8pRg#Qo9Lzi

请大家发挥聪明才智，一起debug。目前想到的问题解决路径有两个：
1. 现有文件debug。目前的代码曾经是能跑出地球来的，但不知道问题何在。一定是某个环节出了问题，大家可以发挥自己的debug能力，看看是哪里使得它空空如也。
2. 渐进增强。首先参照uniapp和微信小程序官方开发文档，实现webgl的任何动画的展示。其次，参考web版的src/components/EarthGlobe.vue这个文件，使用Globe.gl这个库，不断尝试实现这个动画。

请注意，微信提供的webgl接口和浏览器提供的不完全一致，uniapp和微信提供的接口也不完全一致，这就意味着canvas本身在微信小程序里实现就有难度，而canvas+webgl+three.js在微信小程序里使用更有难度。困扰我们的正是这个核心问题，需要大家逐渐摸清这个流程。

遇到任何问题可以自行搜索名词/随时向王凿发问（最好的场合是飞书lark前端群中，因为其他人也可以看到且方便留存，王凿会及时查看）。

大家加油，这个问题解决了，我们的产品就会突飞猛进，大家的简历也可以顺手多好几个技术栈~

