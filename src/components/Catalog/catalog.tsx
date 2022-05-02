import React from 'react';

interface CatalogNode {
  title: string; // 目录名称
  tag: string; // 标题元素的tag，"h1", "h2", "h3", "h4", "h5", "h6"，表示该标题是几级标题
  childs: CatalogNode[]; // 该目录下的子目录
  id: string; // 标题元素的id属性值，用于跳转到文章指定标题位置
}

export const generateCatalog = (htmlText: string) => {
  const tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  const temEle = document.createElement('div');
  temEle.innerHTML = htmlText;

  const cmpContainer = [];
  const catalogNodes: CatalogNode[] = [];
  for (let i = 0; i < temEle.childNodes.length; i++) {
    const ele = temEle.childNodes[i] as HTMLElement;
    if (ele.tagName && tags.includes(ele.tagName.toLowerCase())) {
      const index1 = tags.indexOf(ele.tagName.toLowerCase());
      while (cmpContainer.length > 0) {
        const index2 = tags.indexOf(cmpContainer[cmpContainer.length - 1].tag);
        if (index1 > index2) {
          break;
        }
        cmpContainer.pop();
      }
      let idStr = ele.id;
      if (!idStr) {
        idStr = ele.innerText.replaceAll(' ', '-');
        ele.setAttribute('id', idStr); // 使用文章名称作为element的属性
      }
      if (cmpContainer.length > 0) {
        const node: CatalogNode = {
          title: ele.innerText,
          tag: ele.tagName.toLowerCase(),
          childs: [],
          id: idStr,
        };
        cmpContainer[cmpContainer.length - 1].childs.push(node);
        cmpContainer.push(node);
      } else {
        const rootNode: CatalogNode = {
          title: ele.innerText,
          tag: ele.tagName.toLowerCase(),
          childs: [],
          id: idStr,
        };
        catalogNodes.push(rootNode);
        cmpContainer.push(rootNode);
      }
    }
  }
  return { catalogNodes, htmlText: temEle.innerHTML };
};

const renderList = (catalogNodes: CatalogNode[]) => {
  if (catalogNodes.length === 0) {
    return <></>;
  }
  return (
    <ul className="list-wrap">
      {catalogNodes.map((node) => (
        <React.Fragment key={node.id}>
          <li className="list">
            <a href={`#${node.id}`}>{node.title}</a>
          </li>
          {renderList(node.childs)}
        </React.Fragment>
      ))}
    </ul>
  );
};

export default renderList;
