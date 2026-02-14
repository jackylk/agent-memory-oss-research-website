import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import SummaryPageClient from './SummaryPageClient';

// Configure marked to generate IDs for headings
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

marked.use({
  renderer: {
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens);
      const id = slugify(text);
      return `<h${depth} id="${id}">${text}</h${depth}>`;
    }
  }
});

// Add prefix to all heading IDs in HTML
function addPrefixToHeadingIds(html: string, prefix: string): string {
  return html.replace(/<h(\d) id="([^"]+)"/g, (match, level, id) => {
    return `<h${level} id="${prefix}${id}"`;
  });
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
  let githubTrendsHtml = marked.parse(githubTrendsMarkdown) as string;
  let academicTrendsHtml = marked.parse(academicTrendsMarkdown) as string;

  // 添加前缀避免ID冲突
  githubTrendsHtml = addPrefixToHeadingIds(githubTrendsHtml, 'github-');
  academicTrendsHtml = addPrefixToHeadingIds(academicTrendsHtml, 'academic-');

  return (
    <SummaryPageClient
      summary={summary}
      githubTrends={githubTrendsHtml}
      academicTrends={academicTrendsHtml}
    />
  );
}
