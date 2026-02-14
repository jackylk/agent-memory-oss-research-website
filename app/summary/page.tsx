import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import SummaryPageClient from './SummaryPageClient';

export default function SummaryPage() {
  const summaryPath = path.join(process.cwd(), 'data/aggregated/cloud-services-summary.json');
  const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'));

  // 读取markdown文件
  const githubTrendsPath = path.join(process.cwd(), '../analysis/github-future-trends.md');
  const academicTrendsPath = path.join(process.cwd(), '../analysis/academic-innovation-trends.md');

  const githubTrendsMarkdown = fs.readFileSync(githubTrendsPath, 'utf-8');
  const academicTrendsMarkdown = fs.readFileSync(academicTrendsPath, 'utf-8');

  // 解析markdown to HTML
  const githubTrendsHtml = marked.parse(githubTrendsMarkdown) as string;
  const academicTrendsHtml = marked.parse(academicTrendsMarkdown) as string;

  return (
    <SummaryPageClient
      summary={summary}
      githubTrends={githubTrendsHtml}
      academicTrends={academicTrendsHtml}
    />
  );
}
