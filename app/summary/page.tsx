import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import SummaryPageClient from './SummaryPageClient';

// 提取markdown中的标题作为子章节
function extractMarkdownHeadings(content: string, prefix: string): { id: string; label: string }[] {
  const headings: { id: string; label: string }[] = [];
  const lines = content.split('\n');

  for (const line of lines) {
    // 匹配 ## 标题（二级标题）
    const match = line.match(/^##\s+(?:\d+\.\s*)?(.+)/);
    if (match) {
      const title = match[1].replace(/[*_`]/g, '').trim();
      // 生成ID
      const slug = title
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5\s]+/g, '')
        .replace(/\s+/g, '-')
        .replace(/^-|-$/g, '');
      const id = `${prefix}-${slug}`;
      headings.push({ id, label: title });
    }
  }

  return headings;
}

export default function SummaryPage() {
  const summaryPath = path.join(process.cwd(), 'data/aggregated/cloud-services-summary.json');
  const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'));

  // 读取markdown文件
  const githubTrendsPath = path.join(process.cwd(), 'data/analysis/github-future-trends.md');
  const academicTrendsPath = path.join(process.cwd(), 'data/analysis/academic-innovation-trends.md');

  const githubTrendsMarkdown = fs.readFileSync(githubTrendsPath, 'utf-8');
  const academicTrendsMarkdown = fs.readFileSync(academicTrendsPath, 'utf-8');

  // 解析markdown to HTML
  const githubTrendsHtml = marked.parse(githubTrendsMarkdown) as string;
  const academicTrendsHtml = marked.parse(academicTrendsMarkdown) as string;

  // 提取子章节
  const githubSections = extractMarkdownHeadings(githubTrendsMarkdown, 'future');
  const academicSections = extractMarkdownHeadings(academicTrendsMarkdown, 'academic');

  return (
    <SummaryPageClient
      summary={summary}
      githubTrends={githubTrendsHtml}
      academicTrends={academicTrendsHtml}
      githubSections={githubSections}
      academicSections={academicSections}
    />
  );
}
