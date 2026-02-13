import { loadAllProjects, loadAggregatedData } from '@/lib/data';
import HomeClient from '@/components/HomeClient';

export default function Home() {
  const projects = loadAllProjects();
  const categories = loadAggregatedData('categories.json');
  const trends = loadAggregatedData('trends.json');

  const totalStars = projects.reduce((sum, p) => sum + p.stars, 0);
  const withPapers = projects.filter(p => p.paper?.exists).length;

  // === 分类1: 头部项目 (Stars > 15K) ===
  const topTierProjects = projects.filter(p => p.stars > 15000);

  // === 分类2: 活跃项目 (5K-15K) ===
  const activeProjects = projects.filter(p => p.stars >= 5000 && p.stars <= 15000);

  // === 分类3: 新兴创新 (Stars < 5K, 2025-2026) ===
  const emergingProjects = projects.filter(p => {
    const year = new Date(p.last_updated).getFullYear();
    return p.stars < 5000 && p.stars >= 500 && (year === 2025 || year === 2026);
  });

  // === 分类4: Benchmark项目 ===
  const benchmarkProjects = projects.filter(p =>
    p.name === 'locomo' || p.name === 'LongMemEval' || p.name === 'MemoryAgentBench'
  );

  // === 分类5: 框架集成 ===
  const frameworkProjects = projects.filter(p =>
    p.name === 'memory-agent' || p.name === 'langgraph-redis' || p.name === 'Backboard-Locomo-Benchmark'
  );

  // === 分类6: 超新项目 (2026年2月，Stars < 100) ===
  const ultraNewProjects = projects.filter(p => {
    const date = new Date(p.last_updated);
    return date.getFullYear() === 2026 && date.getMonth() === 1 && p.stars < 100;
  });

  // === 技术流派分类 ===
  const projectsByTechApproach: Record<string, typeof projects> = {};
  projects.forEach(project => {
    project.categories.tech_approach.forEach((approach: string) => {
      if (!projectsByTechApproach[approach]) {
        projectsByTechApproach[approach] = [];
      }
      projectsByTechApproach[approach].push(project);
    });
  });

  Object.keys(projectsByTechApproach).forEach(category => {
    projectsByTechApproach[category].sort((a, b) => b.stars - a.stars);
  });

  const mainTechCategories = Object.entries(projectsByTechApproach)
    .sort(([, a], [, b]) => b.length - a.length)
    .slice(0, 6);

  // === Benchmark排名 ===
  const projectsWithBenchmarks = projects
    .filter(p => p.benchmarks && Object.keys(p.benchmarks).length > 0)
    .map(p => {
      const locomoScore = p.benchmarks?.locomo?.score || 0;
      const longmemScore = p.benchmarks?.longmemeval?.score || 0;
      return { ...p, locomoScore, longmemScore };
    });

  const locomoRanking = [...projectsWithBenchmarks]
    .filter(p => p.locomoScore > 0)
    .sort((a, b) => b.locomoScore - a.locomoScore);

  const longmemRanking = [...projectsWithBenchmarks]
    .filter(p => p.longmemScore > 0)
    .sort((a, b) => b.longmemScore - a.longmemScore);

  return (
    <HomeClient
      projects={projects}
      topTierProjects={topTierProjects}
      activeProjects={activeProjects}
      emergingProjects={emergingProjects}
      benchmarkProjects={benchmarkProjects}
      frameworkProjects={frameworkProjects}
      ultraNewProjects={ultraNewProjects}
      mainTechCategories={mainTechCategories}
      locomoRanking={locomoRanking}
      longmemRanking={longmemRanking}
      totalStars={totalStars}
      withPapers={withPapers}
    />
  );
}
