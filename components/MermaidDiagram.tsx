'use client';

import { useEffect, useRef } from 'react';

interface MermaidDiagramProps {
  chart: string;
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current) return;

      try {
        // 动态导入 mermaid，避免 SSR 问题
        const mermaid = (await import('mermaid')).default;

        // 初始化 Mermaid（只初始化一次）
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        });

        // 清空容器
        containerRef.current.innerHTML = '';

        // 创建一个临时 div 来渲染
        const tempDiv = document.createElement('div');
        tempDiv.className = 'mermaid';
        tempDiv.textContent = chart;
        containerRef.current.appendChild(tempDiv);

        // 运行 mermaid 渲染
        await mermaid.run({
          querySelector: '.mermaid',
        });

        console.log('Mermaid diagram rendered successfully');
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div class="text-red-700 font-semibold mb-2">图表渲染失败</div>
            <pre class="text-red-600 text-sm mb-4 whitespace-pre-wrap">${error instanceof Error ? error.message : String(error)}</pre>
            <details class="text-xs">
              <summary class="cursor-pointer text-gray-600 hover:text-gray-900">查看原始代码</summary>
              <pre class="mt-2 p-2 bg-white rounded border border-gray-200 overflow-x-auto">${chart}</pre>
            </details>
          `;
        }
      }
    };

    renderDiagram();
  }, [chart]);

  return (
    <div className="mermaid-container my-8 p-6 bg-white rounded-lg border border-gray-200 overflow-x-auto">
      <div ref={containerRef} className="flex justify-center">
        <div className="text-gray-500 text-center py-4 animate-pulse">加载图表中...</div>
      </div>
    </div>
  );
}
