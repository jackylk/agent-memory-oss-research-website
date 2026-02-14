import fs from 'fs';
import path from 'path';
import SummaryPageClient from './SummaryPageClient';

export default function SummaryPage() {
  const summaryPath = path.join(process.cwd(), 'data/aggregated/cloud-services-summary.json');
  const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'));

  return <SummaryPageClient summary={summary} />;
}
