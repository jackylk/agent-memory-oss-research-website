'use client';

import { useState } from 'react';
import type { ProjectMeta } from '@/lib/data';
import Link from 'next/link';

interface CompareViewProps {
  projects: ProjectMeta[];
}

export default function CompareView({ projects }: CompareViewProps) {
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  const toggleProject = (projectName: string) => {
    setSelectedProjects(prev => {
      if (prev.includes(projectName)) {
        return prev.filter(p => p !== projectName);
      }
      if (prev.length >= 4) {
        alert('最多只能同时对比4个项目');
        return prev;
      }
      return [...prev, projectName];
    });
  };

  const selectedProjectsData = selectedProjects
    .map(name => projects.find(p => p.name === name))
    .filter(Boolean) as ProjectMeta[];

  const sortedProjects = [...projects].sort((a, b) => b.stars - a.stars);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <Link href="/">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer">
                Agent Memory 研究中心
              </h1>
            </Link>
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
              ← 返回首页
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">项目对比</h2>
          <p className="text-gray-600">
            选择2-4个项目进行横向对比，深入了解它们的目标、技术和云服务需求
          </p>
        </div>

        {/* Project Selection */}
        <div className="mb-8 bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            选择项目 ({selectedProjects.length}/4)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {sortedProjects.map(project => (
              <button
                key={project.name}
                onClick={() => toggleProject(project.name)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  selectedProjects.includes(project.name)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className={`font-medium text-sm truncate ${
                  selectedProjects.includes(project.name)
                    ? 'text-blue-900'
                    : 'text-gray-900'
                }`}>
                  {project.name}
                </div>
                <div className={`text-xs ${
                  selectedProjects.includes(project.name)
                    ? 'text-blue-700'
                    : 'text-gray-600'
                }`}>
                  ⭐ {project.stars >= 1000 ? `${(project.stars / 1000).toFixed(1)}K` : project.stars}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        {selectedProjectsData.length >= 2 ? (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 sticky left-0 bg-gray-50 z-10 min-w-[150px]">
                      对比维度
                    </th>
                    {selectedProjectsData.map(project => (
                      <th key={project.name} className="px-4 py-3 text-left text-sm font-semibold text-gray-700 min-w-[250px]">
                        <div className="flex items-center gap-2">
                          <span className="truncate">{project.name}</span>
                          <button
                            onClick={() => toggleProject(project.name)}
                            className="text-gray-400 hover:text-red-500"
                            title="移除"
                          >
                            ✕
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {/* 基本信息 */}
                  <tr className="bg-blue-50">
                    <td colSpan={selectedProjectsData.length + 1} className="px-4 py-2 text-sm font-semibold text-blue-900">
                      📊 基本信息
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-700 sticky left-0 bg-white">GitHub Stars</td>
                    {selectedProjectsData.map(p => (
                      <td key={p.name} className="px-4 py-3 text-sm text-gray-600">
                        ⭐ {p.stars >= 1000 ? `${(p.stars / 1000).toFixed(1)}K` : p.stars}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-700 sticky left-0 bg-gray-50">项目描述</td>
                    {selectedProjectsData.map(p => (
                      <td key={p.name} className="px-4 py-3 text-sm text-gray-600">
                        {p.description}
                      </td>
                    ))}
                  </tr>

                  {/* 核心亮点 */}
                  <tr className="bg-gradient-to-r from-purple-50 to-blue-50">
                    <td colSpan={selectedProjectsData.length + 1} className="px-4 py-2 text-sm font-semibold text-purple-900">
                      💎 核心亮点
                    </td>
                  </tr>
                  {selectedProjectsData.some(p => p.value_propositions && p.value_propositions.length > 0) && (
                    <>
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-gray-700 sticky left-0 bg-white align-top">亮点 1</td>
                        {selectedProjectsData.map(p => (
                          <td key={p.name} className="px-4 py-3 text-sm text-gray-600">
                            {p.value_propositions && p.value_propositions[0] ? (
                              <div>
                                <div className="font-semibold text-purple-900 mb-1">
                                  {p.value_propositions[0].name}
                                </div>
                                <div className="text-gray-700 text-xs leading-relaxed">
                                  {p.value_propositions[0].description}
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400">暂无</span>
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-700 sticky left-0 bg-gray-50 align-top">亮点 2</td>
                        {selectedProjectsData.map(p => (
                          <td key={p.name} className="px-4 py-3 text-sm text-gray-600">
                            {p.value_propositions && p.value_propositions[1] ? (
                              <div>
                                <div className="font-semibold text-purple-900 mb-1">
                                  {p.value_propositions[1].name}
                                </div>
                                <div className="text-gray-700 text-xs leading-relaxed">
                                  {p.value_propositions[1].description}
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400">暂无</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    </>
                  )}

                  {/* 云服务需求 */}
                  <tr className="bg-orange-50">
                    <td colSpan={selectedProjectsData.length + 1} className="px-4 py-2 text-sm font-semibold text-orange-900">
                      ☁️ 云服务需求
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-700 sticky left-0 bg-white">计算需求</td>
                    {selectedProjectsData.map(p => (
                      <td key={p.name} className="px-4 py-3 text-sm text-gray-600">
                        {p.cloud_needs?.compute?.estimated_requirements || 'N/A'}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-700 sticky left-0 bg-gray-50">需要GPU</td>
                    {selectedProjectsData.map(p => (
                      <td key={p.name} className="px-4 py-3 text-sm text-gray-600">
                        {p.cloud_needs?.compute?.gpu_needed ? '✓ 是' : '✗ 否'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-700 sticky left-0 bg-white">部署复杂度</td>
                    {selectedProjectsData.map(p => (
                      <td key={p.name} className="px-4 py-3 text-sm text-gray-600">
                        {p.cloud_needs?.deployment?.complexity ? `${p.cloud_needs.deployment.complexity}/10` : 'N/A'}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-700 sticky left-0 bg-gray-50">容器化</td>
                    {selectedProjectsData.map(p => (
                      <td key={p.name} className="px-4 py-3 text-sm text-gray-600">
                        {p.cloud_needs?.deployment?.containerized ? '✓ 支持' : '✗ 不支持'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-700 sticky left-0 bg-white">编排工具</td>
                    {selectedProjectsData.map(p => (
                      <td key={p.name} className="px-4 py-3 text-sm text-gray-600">
                        <div className="flex flex-wrap gap-1">
                          {p.cloud_needs?.deployment?.orchestration?.map((o: string) => (
                            <span key={o} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                              {o}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* 技术特点 */}
                  <tr className="bg-purple-50">
                    <td colSpan={selectedProjectsData.length + 1} className="px-4 py-2 text-sm font-semibold text-purple-900">
                      💡 技术特点
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-700 sticky left-0 bg-white">技术流派</td>
                    {selectedProjectsData.map(p => (
                      <td key={p.name} className="px-4 py-3 text-sm text-gray-600">
                        <div className="flex flex-wrap gap-1">
                          {p.categories?.tech_approach?.slice(0, 3).map((t: string) => (
                            <span key={t} className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs">
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-700 sticky left-0 bg-gray-50">应用场景</td>
                    {selectedProjectsData.map(p => (
                      <td key={p.name} className="px-4 py-3 text-sm text-gray-600">
                        <div className="flex flex-wrap gap-1">
                          {p.categories?.use_case?.slice(0, 3).map((u: string) => (
                            <span key={u} className="px-2 py-0.5 bg-pink-100 text-pink-700 rounded text-xs">
                              {u}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <div className="text-gray-400 text-lg mb-2">👆</div>
            <p className="text-gray-600">请至少选择2个项目开始对比</p>
          </div>
        )}

        {/* Link to Details */}
        {selectedProjectsData.length >= 2 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              查看详细分析：
              {selectedProjectsData.map((p, i) => (
                <span key={p.name}>
                  {i > 0 && ' • '}
                  <Link href={`/projects/${p.name}`} className="text-blue-600 hover:underline">
                    {p.name}
                  </Link>
                </span>
              ))}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
