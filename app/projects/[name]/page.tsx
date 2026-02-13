import { loadProject, loadAllProjects } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { ExpandableSection } from '@/components/ExpandableSection';
import { TableOfContents, type TocSection } from '@/components/TableOfContents';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  const projects = loadAllProjects();
  return projects.map((project) => ({
    name: project.name,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const { name } = await params;
  return {
    title: `Agent Memory 研究中心：${name}`,
  };
}

function headingToId(prefix: string, text: string): string {
  const cleaned = text.replace(/[*_`#]/g, '').trim();
  const slug = cleaned
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${prefix}-${slug}`;
}

function extractMarkdownHeadings(content: string, prefix: string): { id: string; title: string }[] {
  const headings: { id: string; title: string }[] = [];
  const lines = content.split('\n');
  for (const line of lines) {
    const match = line.match(/^##\s+(?:\d+\.\s*)?(.+)/);
    if (match) {
      const title = match[1].replace(/[*_`]/g, '').trim();
      const id = headingToId(prefix, title);
      headings.push({ id, title });
    }
  }
  return headings;
}

function loadProjectMarkdown(projectName: string, filename: string): string | null {
  const DATA_DIR = path.join(process.cwd(), '..', 'data');
  const mdPath = path.join(DATA_DIR, 'projects', projectName, filename);

  if (!fs.existsSync(mdPath)) return null;
  return fs.readFileSync(mdPath, 'utf-8');
}

export default async function ProjectDetail({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const project = loadProject(name);

  if (!project) {
    notFound();
  }

  const architecture = loadProjectMarkdown(name, 'architecture.md');
  const cloudNeeds = loadProjectMarkdown(name, 'cloud-needs.md');

  // 构建目录导航
  const tocSections: TocSection[] = [
    { id: 'overview', title: '项目概览', icon: '📊' },
  ];

  if (project.value_propositions && project.value_propositions.length > 0) {
    tocSections.push({ id: 'value-propositions', title: '华为式价值判断', icon: '💎' });
  }

  tocSections.push({ id: 'cloud-needs-summary', title: '华为云适配性', icon: '🇨🇳' });

  if (project.paper?.exists) {
    tocSections.push({ id: 'paper', title: '学术论文', icon: '📄' });
  }

  if (Object.keys(project.benchmarks).length > 0) {
    tocSections.push({ id: 'benchmarks', title: '性能基准', icon: '🏆' });
  }

  if (project.innovations) {
    tocSections.push({ id: 'innovations', title: '核心创新', icon: '💡' });
  }

  if (project.use_cases) {
    tocSections.push({ id: 'use-cases', title: '应用场景', icon: '🎯' });
  }

  tocSections.push({ id: 'tech-stack', title: '技术栈', icon: '🛠️' });

  if (architecture) {
    const archChildren = extractMarkdownHeadings(architecture, 'arch');
    tocSections.push({ id: 'architecture', title: '架构分析', icon: '🏗️', children: archChildren });
  }

  if (cloudNeeds) {
    const cloudChildren = extractMarkdownHeadings(cloudNeeds, 'cloud');
    tocSections.push({ id: 'cloud-needs-detail', title: '云服务需求详情', icon: '💰', children: cloudChildren });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer">
                Agent Memory 研究中心
              </h1>
            </Link>
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition">
              ← 返回首页
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex gap-8">
          {/* 主内容区域 */}
          <div className="flex-1 max-w-5xl">
            {/* Project Header */}
            <div id="overview" className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{project.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{project.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-600">
                ⭐ {(project.stars / 1000).toFixed(1)}K
              </div>
              <div className="text-xs text-gray-600 mt-1">GitHub Stars</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{project.primary_language}</div>
              <div className="text-xs text-gray-600 mt-1">主要语言</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">
                {project.cloud_needs.deployment.complexity}/10
              </div>
              <div className="text-xs text-gray-600 mt-1">部署复杂度</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                {project.paper?.exists ? '有' : '无'}
              </div>
              <div className="text-xs text-gray-600 mt-1">学术论文</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {project.categories.tech_approach.map(tag => (
              <span
                key={tag}
                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <a
              href={project.repository_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition flex items-center gap-2"
            >
              <span>GitHub 仓库</span>
              <span>→</span>
            </a>
            {project.website_url && (
              <a
                href={project.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <span>🌐</span>
                <span>官方网站</span>
              </a>
            )}
            {project.paper?.exists && project.paper.url &&
             !project.paper.url.includes('github.com') &&
             !project.paper.url.includes('unknown') &&
             project.paper.url.startsWith('http') && (
              <a
                href={project.paper.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-50 transition"
              >
                📄 查看论文
              </a>
            )}
          </div>
        </div>

            {/* Value Propositions - 华为式价值判断 */}
            {project.value_propositions && project.value_propositions.length > 0 && (
              <div id="value-propositions" className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-lg p-8 mb-8 border-2 border-purple-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="text-3xl">💎</span>
                  <span>华为式价值判断</span>
                </h2>
                <div className="space-y-6">
                  {project.value_propositions.map((vp: any, index: number) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-purple-100">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <h3 className="text-lg font-bold text-purple-900 flex-1">
                          {vp.name}
                        </h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed ml-11">
                        {vp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Huawei Cloud Adaptability Summary */}
            {project.huawei_cloud && (
              <div id="cloud-needs-summary" className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl shadow-lg p-8 mb-8 border-2 border-red-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="text-3xl">🇨🇳</span>
                  <span>华为云适配性</span>
                </h2>

                {/* Adaptability Badge */}
                <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-gray-200">
                  <span className="text-lg">
                    {project.huawei_cloud.overall_difficulty === '容易' && '🟢'}
                    {project.huawei_cloud.overall_difficulty === '中等' && '🟡'}
                    {project.huawei_cloud.overall_difficulty === '困难' && '🔴'}
                  </span>
                  <span className="font-semibold text-gray-900">适配性：</span>
                  <span className={`font-bold ${
                    project.huawei_cloud.overall_difficulty === '容易' ? 'text-green-600' :
                    project.huawei_cloud.overall_difficulty === '中等' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {project.huawei_cloud.overall_difficulty === '容易' ? '高' :
                     project.huawei_cloud.overall_difficulty === '中等' ? '中' :
                     project.huawei_cloud.overall_difficulty === '困难' ? '低' :
                     project.huawei_cloud.overall_difficulty}
                  </span>
                </div>

                {/* Core Requirements */}
                {project.cloud_needs && (
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span>📋</span>
                      <span>项目核心需求</span>
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      {/* Storage Requirements */}
                      {project.cloud_needs.storage?.types && (
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-2">存储服务</h4>
                          <ul className="space-y-1">
                            {project.cloud_needs.storage.types.map((type: string, idx: number) => (
                              <li key={idx} className="text-gray-600 flex items-start gap-1">
                                <span className="text-gray-400">•</span>
                                <span>{type}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Compute Requirements */}
                      {project.cloud_needs.compute && (
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-2">计算资源</h4>
                          <ul className="space-y-1">
                            {project.cloud_needs.compute.estimated_requirements && (
                              <li className="text-gray-600 flex items-start gap-1">
                                <span className="text-gray-400">•</span>
                                <span>{project.cloud_needs.compute.estimated_requirements}</span>
                              </li>
                            )}
                            {project.cloud_needs.compute.gpu_needed && (
                              <li className="text-gray-600 flex items-start gap-1">
                                <span className="text-gray-400">•</span>
                                <span>GPU/NPU 加速支持</span>
                              </li>
                            )}
                            {project.cloud_needs.compute.embedding && (
                              <li className="text-gray-600 flex items-start gap-1">
                                <span className="text-gray-400">•</span>
                                <span>嵌入模型推理</span>
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      {/* Deployment Requirements */}
                      {project.cloud_needs.deployment?.orchestration && (
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-2">部署方式</h4>
                          <ul className="space-y-1">
                            {project.cloud_needs.deployment.orchestration.map((orch: string, idx: number) => (
                              <li key={idx} className="text-gray-600 flex items-start gap-1">
                                <span className="text-gray-400">•</span>
                                <span>{orch}</span>
                              </li>
                            ))}
                            <li className="text-gray-600 flex items-start gap-1">
                              <span className="text-gray-400">•</span>
                              <span>部署复杂度: {project.cloud_needs.deployment.complexity}/10</span>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Supported Services */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-green-100">
                    <h3 className="font-semibold text-green-700 mb-4 flex items-center gap-2">
                      <span>✅</span>
                      <span>华为云完全支持</span>
                    </h3>
                    <ul className="space-y-2 text-sm">
                      {project.huawei_cloud.recommended_services?.database?.primary && (
                        <li className="text-gray-700 flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span><strong>数据库：</strong>{typeof project.huawei_cloud.recommended_services.database.primary === 'string'
                            ? project.huawei_cloud.recommended_services.database.primary
                            : project.huawei_cloud.recommended_services.database.service || 'RDS PostgreSQL'}</span>
                        </li>
                      )}
                      {project.huawei_cloud.recommended_services?.cache && (
                        <li className="text-gray-700 flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span><strong>缓存：</strong>{typeof project.huawei_cloud.recommended_services.cache === 'string'
                            ? (project.huawei_cloud.recommended_services.cache === '无需' ? '无需' : project.huawei_cloud.recommended_services.cache)
                            : project.huawei_cloud.recommended_services.cache?.service || 'DCS Redis'}</span>
                        </li>
                      )}
                      {project.huawei_cloud.recommended_services?.compute?.primary && (
                        <li className="text-gray-700 flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span><strong>计算：</strong>{typeof project.huawei_cloud.recommended_services.compute.primary === 'string'
                            ? project.huawei_cloud.recommended_services.compute.primary
                            : project.huawei_cloud.recommended_services.compute.service || 'CCE/ECS'}</span>
                        </li>
                      )}
                      {project.cloud_needs?.deployment?.containerized && (
                        <li className="text-gray-700 flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span><strong>容器编排：</strong>CCE (云容器引擎)</span>
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Challenges */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-100">
                    <h3 className="font-semibold text-orange-700 mb-4 flex items-center gap-2">
                      <span>⚠️</span>
                      <span>差距与挑战</span>
                    </h3>
                    <ul className="space-y-2 text-sm">
                      {project.huawei_cloud.special_requirements && project.huawei_cloud.special_requirements.length > 0 ? (
                        project.huawei_cloud.special_requirements.slice(0, 4).map((req, idx) => (
                          <li key={idx} className="text-gray-700 flex items-start gap-2">
                            <span className="text-orange-500 mt-1">•</span>
                            <span>{req}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-500 italic">无重大挑战</li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Cost Estimation */}
                {project.huawei_cloud.cost_estimation?.small_scale && (
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
                    <h3 className="font-semibold text-blue-700 mb-4 flex items-center gap-2">
                      <span>💰</span>
                      <span>成本估算（小规模）</span>
                    </h3>
                    <div className="flex items-baseline gap-4 mb-3">
                      <span className="text-3xl font-bold text-blue-600">
                        {project.huawei_cloud.cost_estimation.small_scale.monthly_cost}
                      </span>
                      <span className="text-sm text-gray-600">
                        / 月
                      </span>
                      <span className="text-xs text-gray-500">
                        ({project.huawei_cloud.cost_estimation.small_scale.description})
                      </span>
                    </div>
                    {project.huawei_cloud.cost_estimation.small_scale.breakdown && (
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                        {Object.entries(project.huawei_cloud.cost_estimation.small_scale.breakdown).slice(0, 4).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span>{key}:</span>
                            <span className="font-medium">{value as string}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Quick Actions */}
                <div className="mt-6 flex gap-3">
                  <a
                    href="#cloud-needs-detail"
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2 shadow-sm hover:shadow-md"
                  >
                    <span>查看详细适配方案</span>
                    <span>↓</span>
                  </a>
                </div>
              </div>
            )}

            {/* Paper Info */}
            {project.paper?.exists && (
              <div id="paper" className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📄 学术论文</h2>
            <div className="space-y-2">
              <p className="text-gray-700"><span className="font-semibold">标题:</span> {project.paper.title}</p>
              <p className="text-gray-700"><span className="font-semibold">会议/期刊:</span> {project.paper.venue}</p>
              <p className="text-gray-700"><span className="font-semibold">年份:</span> {project.paper.year}</p>
            </div>
          </div>
        )}

            {/* Benchmarks */}
            {Object.keys(project.benchmarks).length > 0 && (
              <div id="benchmarks" className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🏆 性能基准</h2>
            <div className="space-y-4">
              {Object.entries(project.benchmarks).map(([name, result]: [string, any]) => (
                <div key={name} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="font-semibold text-lg text-gray-900">{name.toUpperCase()}</div>
                  {result.score > 0 && (
                    <div className="text-2xl font-bold text-blue-600 my-1">{result.score}</div>
                  )}
                  <div className="text-gray-600 text-sm">{result.details}</div>
                </div>
              ))}
            </div>
          </div>
        )}

            {/* Innovations */}
            {project.innovations && (
              <div id="innovations" className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">💡 核心创新</h2>

            <div className="space-y-6">
              {project.innovations.key_features && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">🎯 关键特性</h3>
                  <ul className="space-y-2">
                    {project.innovations.key_features.map((feature, idx) => (
                      <li key={idx} className="text-gray-700 flex items-start gap-2">
                        <span className="text-blue-500 mt-1">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.innovations.improvements && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">📈 性能提升</h3>
                  <ul className="space-y-2">
                    {project.innovations.improvements.map((improvement, idx) => (
                      <li key={idx} className="text-gray-700 flex items-start gap-2">
                        <span className="text-green-500 mt-1">▲</span>
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.innovations.user_value && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">🎁 用户价值</h3>
                  <ul className="space-y-2">
                    {project.innovations.user_value.map((value, idx) => (
                      <li key={idx} className="text-gray-700 flex items-start gap-2">
                        <span className="text-purple-500 mt-1">★</span>
                        <span>{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

            {/* Use Cases */}
            {project.use_cases && (
              <div id="use-cases" className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🎯 应用场景</h2>

            <div className="space-y-6">
              {project.use_cases.scenarios && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">适用场景</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {project.use_cases.scenarios.map((scenario, idx) => (
                      <div key={idx} className="bg-blue-50 rounded-lg p-3 text-sm text-gray-700">
                        {scenario}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {project.use_cases.companies && project.use_cases.companies.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">实际应用</h3>
                  <ul className="space-y-2">
                    {project.use_cases.companies.map((company, idx) => (
                      <li key={idx} className="text-gray-700 flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{company}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

            {/* Tech Stack */}
            <div id="tech-stack" className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🛠️ 技术栈</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">存储方案</h3>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.storage.map(item => (
                  <span key={item} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-md text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">框架</h3>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.frameworks.map(item => (
                  <span key={item} className="px-3 py-1 bg-green-50 text-green-700 rounded-md text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

            {/* Architecture Analysis */}
            {architecture && (
              <div id="architecture">
                <ExpandableSection
                  title="🏗️ 架构分析"
                  content={architecture}
                  previewLength={800}
                  sectionPrefix="arch"
                />
              </div>
            )}


            {/* Cloud Needs */}
            {cloudNeeds && (
              <div id="cloud-needs-detail">
                <ExpandableSection
                  title="💰 云服务需求详情"
                  content={cloudNeeds}
                  previewLength={800}
                  sectionPrefix="cloud"
                />
              </div>
            )}

            {/* Missing Analysis Notice */}
            {!architecture && !cloudNeeds && (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-8 mb-8">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">📝 分析进行中</h3>
                <p className="text-yellow-700">
                  该项目的详细架构分析和云需求分析正在准备中。目前已完成基础元数据分析。
                </p>
              </div>
            )}
          </div>

          {/* 侧边目录导航 */}
          <TableOfContents sections={tocSections} />
        </div>
      </div>
    </div>
  );
}
