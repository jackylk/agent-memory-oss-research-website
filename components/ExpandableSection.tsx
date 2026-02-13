'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import { MermaidDiagram } from './MermaidDiagram';
import { ArchitectureDiagram } from './ArchitectureDiagram';

interface ExpandableSectionProps {
  title: string;
  content: string;
  previewLength: number;
  sectionPrefix?: string; // prefix for heading IDs
}

// Generate a stable ID from heading text
function headingToId(prefix: string, text: string): string {
  // Remove markdown formatting and number prefixes (e.g., "1. ", "2. ")
  const cleaned = text.replace(/[*_`#]/g, '').replace(/^\d+\.\s*/, '').trim();
  const slug = cleaned
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${prefix}-${slug}`;
}

// Create markdown components with heading IDs
function createMarkdownComponents(sectionPrefix: string): Components {
  return {
  // 表格样式
  table: ({ children }) => (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full divide-y divide-gray-300 border border-gray-300 rounded-lg">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-gray-50">
      {children}
    </thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-gray-200 bg-white">
      {children}
    </tbody>
  ),
  tr: ({ children }) => (
    <tr className="hover:bg-gray-50 transition-colors">
      {children}
    </tr>
  ),
  th: ({ children }) => (
    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-200 last:border-r-0">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200 last:border-r-0">
      {children}
    </td>
  ),
  // 标题样式 - 带ID用于目录导航
  h1: ({ children }) => {
    const id = headingToId(sectionPrefix, String(children));
    return (
      <h1 id={id} className="text-3xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-gray-200 scroll-mt-24">
        {children}
      </h1>
    );
  },
  h2: ({ children }) => {
    const id = headingToId(sectionPrefix, String(children));
    return (
      <h2 id={id} className="text-2xl font-bold text-gray-900 mt-6 mb-3 pb-2 border-b border-gray-200 scroll-mt-24">
        {children}
      </h2>
    );
  },
  h3: ({ children }) => {
    const id = headingToId(sectionPrefix, String(children));
    return (
      <h3 id={id} className="text-xl font-semibold text-gray-900 mt-5 mb-2 scroll-mt-24">
        {children}
      </h3>
    );
  },
  h4: ({ children }) => {
    const id = headingToId(sectionPrefix, String(children));
    return (
      <h4 id={id} className="text-lg font-semibold text-gray-800 mt-4 mb-2 scroll-mt-24">
        {children}
      </h4>
    );
  },
  // 段落样式
  p: ({ children }) => (
    <p className="text-gray-900 leading-7 mb-4">
      {children}
    </p>
  ),
  // 列表样式
  ul: ({ children }) => (
    <ul className="list-disc list-inside space-y-2 mb-4 text-gray-900">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-900">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="text-gray-900 leading-7">
      {children}
    </li>
  ),
  // 代码块容器样式
  pre: ({ children }) => (
    <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto my-6 text-sm leading-relaxed">
      {children}
    </pre>
  ),
  // 代码样式
  code: ({ inline, children, className }) => {
    // 检测是否是 Mermaid 图表或架构图
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';

    if (!inline && language === 'architecture') {
      try {
        const data = JSON.parse(String(children));
        return <ArchitectureDiagram layers={data.layers} />;
      } catch (e) {
        // 当内容被截断时（收起状态），JSON 可能不完整，显示友好提示
        return (
          <div className="my-6 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg text-center">
            <div className="text-blue-600 text-lg font-semibold mb-2">📊 架构图</div>
            <div className="text-gray-600">展开查看完整架构图</div>
          </div>
        );
      }
    }

    if (!inline && language === 'mermaid') {
      return <MermaidDiagram chart={String(children).replace(/\n$/, '')} />;
    }

    if (inline) {
      return (
        <code className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-sm font-mono font-semibold">
          {children}
        </code>
      );
    }
    // 代码块内的代码（在 pre 标签内）
    return (
      <code className="font-mono text-sm whitespace-pre">
        {children}
      </code>
    );
  },
  // 引用样式
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 text-gray-900 italic">
      {children}
    </blockquote>
  ),
  // 链接样式
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  // 分割线
  hr: () => (
    <hr className="my-8 border-t-2 border-gray-200" />
  ),
  // 强调样式
  strong: ({ children }) => (
    <strong className="font-bold text-gray-900">
      {children}
    </strong>
  ),
  em: ({ children }) => (
    <em className="italic text-gray-800">
      {children}
    </em>
  ),
  };
}

export function ExpandableSection({ title, content, previewLength, sectionPrefix = 'section' }: ExpandableSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const components = createMarkdownComponents(sectionPrefix);

  const preview = content.slice(0, previewLength);
  const shouldShowButton = content.length > previewLength;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {shouldShowButton && isExpanded && (
          <button
            onClick={() => setIsExpanded(false)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2 text-sm font-medium"
            title="收起内容"
          >
            <span>收起</span>
            <span>↑</span>
          </button>
        )}
      </div>
      <div className="markdown-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={components}
        >
          {isExpanded ? content : preview + (shouldShowButton ? '\n\n...' : '')}
        </ReactMarkdown>
      </div>
      {shouldShowButton && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            <span>{isExpanded ? '收起内容' : '查看完整内容'}</span>
            <span>{isExpanded ? '↑' : '↓'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
