'use client';

import { useState } from 'react';
import Header from './Header';
import ProjectsView from './ProjectsView';
import type { ProjectMeta } from '@/lib/data';

interface HomeClientProps {
  projects: ProjectMeta[];
  topTierProjects: ProjectMeta[];
  activeProjects: ProjectMeta[];
  emergingProjects: ProjectMeta[];
  benchmarkProjects: ProjectMeta[];
  frameworkProjects: ProjectMeta[];
  ultraNewProjects: ProjectMeta[];
  mainTechCategories: [string, ProjectMeta[]][];
  locomoRanking: any[];
  longmemRanking: any[];
  totalStars: number;
  withPapers: number;
}

export default function HomeClient(props: HomeClientProps) {
  const [viewMode, setViewMode] = useState<'category' | 'tech' | 'benchmark'>('category');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Header viewMode={viewMode} onViewModeChange={setViewMode} />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Agent Memory 开源项目研究</h2>
          <p className="text-xl text-blue-100 mb-6">
            探索 25+ 个前沿 AI Agent 记忆系统的架构、技术与应用
          </p>
          <div className="flex justify-center gap-8 text-sm">
            <div>
              <div className="text-3xl font-bold">{props.projects.length}</div>
              <div className="text-blue-200">开源项目</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{(props.totalStars / 1000).toFixed(0)}K+</div>
              <div className="text-blue-200">GitHub Stars</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{props.withPapers}</div>
              <div className="text-blue-200">学术论文</div>
            </div>
          </div>
        </div>
      </section>

      <ProjectsView {...props} viewMode={viewMode} />
    </div>
  );
}
