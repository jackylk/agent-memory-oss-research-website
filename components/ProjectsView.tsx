'use client';

import Link from 'next/link';
import type { ProjectMeta } from '@/lib/data';

type ViewMode = 'category' | 'tech' | 'benchmark';

interface ProjectsViewProps {
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
  viewMode: ViewMode;
}

export default function ProjectsView({
  projects,
  topTierProjects,
  activeProjects,
  emergingProjects,
  benchmarkProjects,
  frameworkProjects,
  ultraNewProjects,
  mainTechCategories,
  locomoRanking,
  longmemRanking,
  viewMode,
}: ProjectsViewProps) {

  // 渲染项目卡片
  const ProjectCard = ({ project, index, badge }: { project: ProjectMeta; index?: number; badge?: string }) => (
    <Link
      href={`/projects/${project.name}`}
      className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          {index !== undefined && (
            <div className="text-2xl font-bold text-gray-300 group-hover:text-blue-400 transition">
              #{index + 1}
            </div>
          )}
          <div className="flex-1">
            <h4 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition">
              {project.name}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-yellow-500">⭐</span>
              <span className="text-sm font-medium text-gray-700">
                {project.stars >= 1000 ? `${(project.stars / 1000).toFixed(1)}K` : project.stars}
              </span>
              {badge && (
                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                  {badge}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2">
        {project.categories.tech_approach.slice(0, 2).map((tag: string) => (
          <span
            key={tag}
            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
          >
            {tag}
          </span>
        ))}
        {project.paper?.exists && (
          <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
            📄 有论文
          </span>
        )}
      </div>
    </Link>
  );

  return (
    <>
      {/* === 分类视图 === */}
      {viewMode === 'category' && (
        <div className="py-16 px-4 space-y-16">
          {/* 头部项目 */}
          <section className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <h3 className="text-3xl font-bold text-gray-900">🏆 头部项目</h3>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                Stars &gt; 15K
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topTierProjects.map((project, index) => (
                <ProjectCard key={project.name} project={project} index={index} />
              ))}
            </div>
          </section>

          {/* 活跃项目 */}
          <section className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <h3 className="text-3xl font-bold text-gray-900">🔥 活跃项目</h3>
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                Stars 5K-15K
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeProjects.map((project, index) => (
                <ProjectCard key={project.name} project={project} index={index + topTierProjects.length} />
              ))}
            </div>
          </section>

          {/* 新兴创新 */}
          <section className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <h3 className="text-3xl font-bold text-gray-900">💡 新兴创新</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                2025-2026 创新项目
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {emergingProjects.map((project) => (
                <ProjectCard key={project.name} project={project} />
              ))}
            </div>
          </section>

          {/* Benchmark项目 */}
          <section className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <h3 className="text-3xl font-bold text-gray-900">📊 Benchmark评测</h3>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                官方基准测试
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benchmarkProjects.map((project) => (
                <ProjectCard key={project.name} project={project} />
              ))}
            </div>
          </section>

          {/* 框架集成 */}
          <section className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <h3 className="text-3xl font-bold text-gray-900">🔧 框架集成</h3>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                LangChain等
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {frameworkProjects.map((project) => (
                <ProjectCard key={project.name} project={project} />
              ))}
            </div>
          </section>

          {/* 超新项目 */}
          {ultraNewProjects.length > 0 && (
            <section className="max-w-7xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <h3 className="text-3xl font-bold text-gray-900">🌱 超新项目</h3>
                <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
                  2026年2月
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ultraNewProjects.map((project) => (
                  <ProjectCard key={project.name} project={project} badge="最新" />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* === 技术流派视图 === */}
      {viewMode === 'tech' && (
        <div className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-3">🔧 技术流派分类</h3>
              <p className="text-gray-600">不同技术路径的 Agent Memory 解决方案</p>
            </div>

            <div className="space-y-12">
              {mainTechCategories.map(([category, categoryProjects]) => (
                <div key={category}>
                  <div className="flex items-center gap-3 mb-6">
                    <h4 className="text-2xl font-bold text-gray-900">{category}</h4>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      {categoryProjects.length} 个项目
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryProjects.map((project) => (
                      <ProjectCard key={project.name} project={project} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* === Benchmark排名视图 === */}
      {viewMode === 'benchmark' && (
        <div className="py-16 px-4 space-y-16">
          {/* LoCoMo排行榜 */}
          <section className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-3">🏆 LoCoMo 排行榜</h3>
              <p className="text-gray-600">Long-Context Memory Benchmark (ACL 2024)</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locomoRanking.map((project, index) => (
                <Link
                  key={project.name}
                  href={`/projects/${project.name}`}
                  className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-lg hover:border-green-200 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`text-3xl font-bold ${
                        index === 0 ? 'text-yellow-500' :
                        index === 1 ? 'text-gray-400' :
                        index === 2 ? 'text-orange-600' : 'text-gray-300'
                      }`}>
                        #{index + 1}
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900 group-hover:text-green-600 transition">
                          {project.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-2xl font-bold text-green-600">
                            {project.locomoScore.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>⭐ {project.stars >= 1000 ? `${(project.stars / 1000).toFixed(1)}K` : project.stars}</span>
                    <span>•</span>
                    <span>{project.primary_language}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* LongMemEval排行榜 */}
          {longmemRanking.length > 0 && (
            <section className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-3">📈 LongMemEval 排行榜</h3>
                <p className="text-gray-600">500问扩展对话基准测试 (ICLR 2025)</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {longmemRanking.map((project, index) => (
                  <Link
                    key={project.name}
                    href={`/projects/${project.name}`}
                    className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`text-3xl font-bold ${
                          index === 0 ? 'text-yellow-500' :
                          index === 1 ? 'text-gray-400' :
                          index === 2 ? 'text-orange-600' : 'text-gray-300'
                        }`}>
                          #{index + 1}
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition">
                            {project.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-2xl font-bold text-blue-600">
                              +{project.longmemScore.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>⭐ {project.stars >= 1000 ? `${(project.stars / 1000).toFixed(1)}K` : project.stars}</span>
                      <span>•</span>
                      <span>{project.primary_language}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </>
  );
}
