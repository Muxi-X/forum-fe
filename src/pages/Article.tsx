import React, { useEffect, useState } from 'react';
import MarkdownNavbar from 'markdown-navbar';
import Catalog, { generateCatalog } from 'components/Catalog/catalog';
import 'md-editor-rt/lib/style.css';
import '@wangeditor/editor/dist/css/style.css';
import 'markdown-navbar/dist/navbar.css';
import { getDraftsList } from 'db/db';

const Article: React.FC = () => {
  const [content, setContent] =
    useState(`<h1 id="第十二章BOM"><a href="#第十二章BOM">第十二章BOM</a></h1><h3 id="window对象作为全局Global对象"><a href="#window对象作为全局Global对象">window对象作为全局Global对象</a></h3><p>这个就是说明var 和 function 两个关键字变量提升挂在到全局对象的问题上</p>
<h3 id="几个window相关API"><a href="#几个window相关API">几个window相关API</a></h3><ul>
<li>screenTop() 、screenLeft()	窗口相对于屏幕的相关距离</li>
<li>moveTo()、 moveBy() 移动窗口</li>
</ul>
<p>上面这俩API可能会被禁用来着 我自己从来没用过</p>
<ul>
<li>scrollTo(), scrollBy(), 其中有个behavior属性，决定是否平滑滚动，用来做回到顶部的窗口组件</li>
<li>Window.open()打开新窗口 有相关参数属性 没用过</li>
<li>Window.innerHeight/weight()</li>
<li>定时器 </li>
<li>alert(), confirm(), prompt()</li>
</ul>
<h3 id="window对象比较常用的子对象"><a href="#window对象比较常用的子对象">window对象比较常用的子对象</a></h3><h5 id="document"><a href="#document">document</a></h5><p>到了DOM再讲</p>
<h5 id="location"><a href="#location">location</a></h5><p>就是获取你网页URL的相关参数，什么host, port, href啥的，router hashs就是以这个为底层做封装的</p>
<h5 id="navigator"><a href="#navigator">navigator</a></h5><p>浏览器的相关配置对象，比如什么appName，appVersion,plugins什么的，我没用过</p>
<h5 id="screen"><a href="#screen">screen</a></h5><p>就获取一些跟你电脑屏幕尺寸相关的信息 也是几乎没用过</p>
<h5 id="history"><a href="#history">history</a></h5><p>同样是router的底层原理, 有 go, push 等方法</p>
<h1 id="第十三章 客户端检测(略读)"><a href="#第十三章 客户端检测(略读)">第十三章 客户端检测(略读)</a></h1><p>简单点说就是不同浏览器接口不一样，我们要先检测然后决定我们该怎么写该用啥子办法，然后有很多API，感觉有点黑科技等是</p>
<p>navigator.connection()和navigator.getBattery()两个方法，可以获取网速跟设备电池状态</p>
<h1 id="第十四章 DOM"><a href="#第十四章 DOM">第十四章 DOM</a></h1><p>介绍了DOM里面的几种类型和相关API</p>
<p>DOM理解为Tree， Element理解为 TreeNode，读完只后可以大概理解react diff是怎么实现比较的了，attr，Element, text，children等在原生中都有相关的API，比如needType</p>
<h1 id="第十五章 DOM扩展"><a href="#第十五章 DOM扩展">第十五章 DOM扩展</a></h1><ul>
<li>selectorsAPI 通过选择器获取nodeList</li>
</ul>
<p>还是一些属性跟相关APi</p>
<h1 id="第十六章 DOM2和DOM3"><a href="#第十六章 DOM2和DOM3">第十六章 DOM2和DOM3</a></h1><p>关于DOM节点的操作 不多说</p>
<ul>
<li>offsetH/W， clientH/W, scrollH/W 区别</li>
</ul>
<p>在有滚动条的情况下，scrollH/W 就是内容区整体的宽高</p>
<p>offset是可视的部分 +  border + 滚动条</p>
<p>client就是可视部分了 </p>
<ul>
<li>节点的遍历和range</li>
</ul>
<h1 id="第十七章 事件(🌟)"><a href="#第十七章 事件(🌟)">第十七章 事件(🌟)</a></h1><ul>
<li><p>事件捕获和事件冒泡</p>
</li>
<li><p>事件对象</p>
</li>
<li><p>clientX, pageX, screenX区别</p>
</li>
<li><p>事件委托</p>
</li>
</ul>
<h1 id="第十八章 动画与Canvas"><a href="#第十八章 动画与Canvas">第十八章 动画与Canvas</a></h1><h1 id="第十九章 表单脚本"><a href="#第十九章 表单脚本">第十九章 表单脚本</a></h1><p>讲解form / input type以及相关API </p>
<h1 id="第二十章 JavaScript API(🌟🌟🌟)"><a href="#第二十章 JavaScript API(🌟🌟🌟)">第二十章 JavaScript API(🌟🌟🌟)</a></h1><h1 id="第二十一章 错误处理与调试"><a href="#第二十一章 错误处理与调试">第二十一章 错误处理与调试</a></h1><ul>
<li>Try/catch,  onError, 识别错误类型，基本调试方法</li>
</ul>
<h1 id="第二十二章 处理XML"><a href="#第二十二章 处理XML">第二十二章 处理XML</a></h1><p>XML 可扩展标记语言 设计出来用于传输和储存数据。HTML用于显示数据 这章说了JS操控XML的相关API</p>
<p>安卓开发写的布局和样式就是XML</p>
<h1 id="第二十三章 JSON"><a href="#第二十三章 JSON">第二十三章 JSON</a></h1><p>简单介绍了JSON</p>
<h1 id="第二十四章 网络请求与远程资源"><a href="#第二十四章 网络请求与远程资源">第二十四章 网络请求与远程资源</a></h1><p>说了下啥是XHR，然后简单提了跨域，JSONP </p>
<ul>
<li>Fetch是重点</li>
</ul>
<h1 id="第二十五章 客户端储存"><a href="#第二十五章 客户端储存">第二十五章 客户端储存</a></h1><p>Cookie, localStorage, sessionStorage, IndexDB</p>
<h1 id="第二十六章 模块"><a href="#第二十六章 模块">第二十六章 模块</a></h1><p>CommonJs 和 import</p>
<h1 id="第二十七章 工作者线程"><a href="#第二十七章 工作者线程">第二十七章 工作者线程</a></h1><p>有点高深 没咋看</p>
<h1 id="第二十八章 最佳实践"><a href="#第二十八章 最佳实践">第二十八章 最佳实践</a></h1><p>讲了下一些基本的代码优化规范</p>`);

  const { catalogNodes } = generateCatalog(content);

  return (
    <>
      <div id="md-editor-rt-preview-wrapper" className="md-preview-wrapper">
        <div id="md-editor-rt-preview" className="md-preview vuepress-theme md-scrn">
          <div dangerouslySetInnerHTML={{ __html: content }}></div>
        </div>
      </div>
      <div className="navigation">
        {/* <MarkdownNavbar source={a} /> */}
        {Catalog(catalogNodes)}
      </div>
    </>
  );
};

export default Article;
