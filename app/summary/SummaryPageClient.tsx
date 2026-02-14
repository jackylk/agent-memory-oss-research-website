'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface SummaryPageProps {
  summary: any;
  githubTrends: string;
  academicTrends: string;
  githubSections: { id: string; label: string }[];
  academicSections: { id: string; label: string }[];
}

export default function SummaryPageClient({
  summary,
  githubTrends,
  academicTrends,
  githubSections,
  academicSections,
}: SummaryPageProps) {
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set());
  const [activeSection, setActiveSection] = useState<string>('insights');

  const toggleService = (serviceKey: string) => {
    const newExpanded = new Set(expandedServices);
    if (newExpanded.has(serviceKey)) {
      newExpanded.delete(serviceKey);
    } else {
      newExpanded.add(serviceKey);
    }
    setExpandedServices(newExpanded);
  };

  // 重新组织的4大章目录导航
  const tocItems = [
    {
      id: 'chapter1',
      label: '第一章：当前云服务需求总结',
      children: [
        { id: 'insights', label: '核心洞察' },
        { id: 'storage', label: '存储服务需求' },
        { id: 'models', label: '模型服务需求' },
        { id: 'deployment', label: '部署服务需求' },
        { id: 'other', label: '其他需求' },
        { id: 'huawei-summary', label: '华为云支持总结' },
      ],
    },
    {
      id: 'chapter2',
      label: '第二章：未来需求趋势分析',
      subtitle: '(基于Top 5 GitHub项目)',
      children: [{ id: 'future-trends', label: '未来趋势概览' }, ...githubSections],
    },
    {
      id: 'chapter3',
      label: '第三章：学术创新方向',
      subtitle: '(基于前沿论文研究)',
      children: [{ id: 'academic', label: '学术研究概览' }, ...academicSections],
    },
    {
      id: 'chapter4',
      label: '第四章：云服务发展建议',
      children: [
        { id: 'recommendations-overview', label: '建议概览' },
        { id: 'recommendations-storage', label: '存储服务优化' },
        { id: 'recommendations-compute', label: '计算服务增强' },
        { id: 'recommendations-ai', label: 'AI服务完善' },
        { id: 'recommendations-ecosystem', label: '生态体系建设' },
      ],
    },
  ];

  // 监听滚动，更新当前活动章节
  useEffect(() => {
    const handleScroll = () => {
      const sections = tocItems.flatMap((item) => item.children || []);

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(sections[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 平滑滚动到指定章节
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  // 可展开的服务卡片组件
  const ExpandableServiceCard = ({ service, serviceKey, colorClass = 'blue' }: any) => {
    const isExpanded = expandedServices.has(serviceKey);
    const colors = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
      green: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' },
    };
    const color = colors[colorClass as keyof typeof colors] || colors.blue;

    return (
      <div
        className={`border rounded-lg p-3 cursor-pointer hover:${color.border} hover:shadow-md transition-all`}
        onClick={() => toggleService(serviceKey)}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium text-gray-900">{service.name}</span>
          <span className={`text-xs ${color.bg} ${color.text} px-2 py-0.5 rounded`}>{service.count}</span>
        </div>
        {service.use_for && <div className="text-xs text-gray-600">用于: {service.use_for}</div>}
        {service.extensions && service.extensions.length > 0 && (
          <div className="text-xs text-gray-600">扩展: {service.extensions.join(', ')}</div>
        )}
        {service.memory_types && <div className="text-xs text-gray-600">用途: {service.memory_types.join(', ')}</div>}
        {service.avg_dimension > 0 && (
          <div className="text-xs text-gray-500 mt-1">平均维度: {service.avg_dimension}</div>
        )}
        {service.use_cases && Array.isArray(service.use_cases) && service.use_cases.length > 0 && (
          <div className="text-xs text-gray-600">用途: {service.use_cases.join(', ')}</div>
        )}
        {isExpanded && service.projects && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="text-xs text-gray-600 mb-1">使用项目：</div>
            <div className="flex flex-wrap gap-1">
              {service.projects.map((proj: string) => (
                <span key={proj} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                  {proj}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="text-xs text-gray-400 mt-1 text-right">
          {isExpanded ? '点击收起 ▲' : '点击查看项目 ▼'}
        </div>
      </div>
    );
  };

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

      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
        {/* 左侧目录导航 */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-20">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b">📑 目录导航</h3>
              <nav className="space-y-2">
                {tocItems.map((chapter) => (
                  <div key={chapter.id} className="mb-3">
                    <div className="font-semibold text-gray-800 text-sm mb-2 px-2">
                      {chapter.label}
                      {chapter.subtitle && (
                        <div className="text-xs text-gray-500 font-normal mt-0.5">{chapter.subtitle}</div>
                      )}
                    </div>
                    {chapter.children && (
                      <div className="space-y-0.5 ml-2">
                        {chapter.children.map((child) => (
                          <button
                            key={child.id}
                            onClick={() => scrollToSection(child.id)}
                            className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors ${
                              activeSection === child.id
                                ? 'bg-blue-50 text-blue-700 font-medium'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            {child.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </div>
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 min-w-0">
          {/* Title */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">云服务需求分析报告</h2>
            <p className="text-gray-600">
              基于 {summary.metadata.total_projects_analyzed} 个 Agent Memory 项目的深度分析 | 版本{' '}
              {summary.metadata.analysis_version}
            </p>
          </div>

          {/* ==================== 第一章：当前云服务需求总结 ==================== */}
          <div className="mb-16">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold mb-2">第一章：当前云服务需求总结</h2>
              <p className="text-blue-50">分析25个主流Agent Memory开源项目的云服务需求现状</p>
            </div>

            {/* 核心洞察 */}
            <div
              id="insights"
              className="scroll-mt-20 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-12 border border-blue-100"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">💡 核心洞察</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {summary.key_insights.map((insight: string, i: number) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">▸</span>
                    <span className="text-gray-700 text-sm">{insight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 存储服务 */}
            <section id="storage" className="scroll-mt-20 mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span>💾</span>
                <span>存储服务需求</span>
              </h3>

              {/* 向量数据库 */}
              <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">🎯 向量数据库</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {summary.storage_services.vector_databases.services.slice(0, 12).map((service: any) => (
                    <ExpandableServiceCard
                      key={service.name}
                      service={service}
                      serviceKey={`vector-${service.name}`}
                      colorClass="blue"
                    />
                  ))}
                </div>
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="font-medium text-gray-900 mb-1">
                    🇨🇳 华为云支持：{summary.storage_services.vector_databases.huawei_cloud_support.service_name}
                  </div>
                  <div className="text-sm text-gray-700 mb-2">
                    {summary.storage_services.vector_databases.huawei_cloud_support.notes}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">替代方案：</span>
                    {summary.storage_services.vector_databases.huawei_cloud_support.alternatives.join(' / ')}
                  </div>
                </div>
              </div>

              {/* 图数据库 */}
              <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">🕸️ 图数据库</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {summary.storage_services.graph_databases.services.map((service: any) => (
                    <ExpandableServiceCard
                      key={service.name}
                      service={service}
                      serviceKey={`graph-${service.name}`}
                      colorClass="purple"
                    />
                  ))}
                </div>
                <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="font-medium text-gray-900 mb-1">
                    🇨🇳 华为云支持：{summary.storage_services.graph_databases.huawei_cloud_support.service_name}
                  </div>
                  <div className="text-sm text-gray-700 mb-2">
                    <span className="font-medium">替代方案：</span>
                    {summary.storage_services.graph_databases.huawei_cloud_support.alternatives.join(' / ')}
                  </div>
                  <div className="text-sm text-red-700">
                    <span className="font-medium">不足：</span>
                    {summary.storage_services.graph_databases.huawei_cloud_support.gaps.join('；')}
                  </div>
                </div>
              </div>

              {/* 关系型数据库 */}
              <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">🗄️ 关系型数据库</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {summary.storage_services.relational_databases.services.map((service: any) => (
                    <ExpandableServiceCard
                      key={service.name}
                      service={service}
                      serviceKey={`relational-${service.name}`}
                      colorClass="green"
                    />
                  ))}
                </div>
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="font-medium text-gray-900 mb-1">
                    🇨🇳 华为云支持：{summary.storage_services.relational_databases.huawei_cloud_support.service_name}
                  </div>
                  <div className="text-sm text-gray-700">
                    {summary.storage_services.relational_databases.huawei_cloud_support.notes}
                  </div>
                </div>
              </div>

              {/* KV数据库 */}
              <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">🔑 KV数据库（Key-Value）</h4>
                {summary.storage_services.kv_databases.services.map((service: any) => (
                  <div key={service.name} className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{service.name}</span>
                      <span className="text-sm text-gray-600">{service.count} 个项目</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">用于缓存: </span>
                        <span className="text-gray-900">{service.use_cases.cache.length} 项目</span>
                      </div>
                      <div>
                        <span className="text-gray-600">用于短期记忆: </span>
                        <span className="text-gray-900">{service.use_cases.short_term_memory.length} 项目</span>
                      </div>
                      <div>
                        <span className="text-gray-600">其他用途: </span>
                        <span className="text-gray-900">{service.use_cases.other.length} 项目</span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="font-medium text-gray-900 mb-1">
                    🇨🇳 华为云支持：{summary.storage_services.kv_databases.huawei_cloud_support.service_name}
                  </div>
                  <div className="text-sm text-gray-700">
                    {summary.storage_services.kv_databases.huawei_cloud_support.notes}
                  </div>
                </div>
              </div>

              {/* 对象存储 */}
              <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">📦 对象存储（S3/OBS）</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {summary.storage_services.object_storage.services.map((service: any) => (
                    <ExpandableServiceCard
                      key={service.name}
                      service={service}
                      serviceKey={`object-${service.name}`}
                      colorClass="orange"
                    />
                  ))}
                </div>
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="font-medium text-gray-900 mb-1">
                    🇨🇳 华为云支持：{summary.storage_services.object_storage.huawei_cloud_support.service_name}
                    {summary.storage_services.object_storage.huawei_cloud_support.s3_compatible && (
                      <span className="ml-2 text-xs bg-green-600 text-white px-2 py-0.5 rounded">S3兼容</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-700">
                    {summary.storage_services.object_storage.huawei_cloud_support.notes}
                  </div>
                </div>
              </div>
            </section>

            {/* 模型服务 */}
            <section id="models" className="scroll-mt-20 mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span>🤖</span>
                <span>模型服务需求</span>
              </h3>

              <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">💬 大语言模型（LLM）</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {summary.model_services.llm_requirements.providers.slice(0, 6).map((provider: any, i: number) => (
                    <div key={provider.name} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{provider.name}</span>
                        <span className="text-xl font-bold text-blue-600">#{i + 1}</span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">{provider.count} 个项目使用</div>
                      {provider.models.length > 0 && (
                        <div className="text-xs text-gray-500">
                          模型: {provider.models.slice(0, 2).join(', ')}
                          {provider.models.length > 2 && '...'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="font-medium text-gray-900 mb-2">
                    🇨🇳 华为云支持：{summary.model_services.llm_requirements.huawei_cloud_support.maas_service}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-gray-700 mb-1">✅ 支持的API：</div>
                      <ul className="text-gray-600 space-y-1">
                        {summary.model_services.llm_requirements.huawei_cloud_support.supported_apis.map(
                          (api: string) => (
                            <li key={api}>• {api}</li>
                          )
                        )}
                      </ul>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700 mb-1">📚 开源模型：</div>
                      <ul className="text-gray-600 space-y-1">
                        {summary.model_services.llm_requirements.huawei_cloud_support.open_source_models
                          .slice(0, 4)
                          .map((model: string) => (
                            <li key={model}>• {model}</li>
                          ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-700 bg-white p-3 rounded">
                    <span className="font-medium">总体评估：</span>
                    {summary.model_services.llm_requirements.huawei_cloud_support.overall_assessment}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">🎯 Embedding模型</h4>
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2">维度分布：</div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(summary.model_services.embedding_requirements.dimension_distribution).map(
                      ([dim, count]: [string, any]) => (
                        <span key={dim} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                          {dim}维 ({count} 个项目)
                        </span>
                      )
                    )}
                  </div>
                </div>
                <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="font-medium text-gray-900 mb-1">
                    🇨🇳 华为云支持：{summary.model_services.embedding_requirements.huawei_cloud_support.service_name}
                  </div>
                  <div className="text-sm text-gray-700 mb-2">
                    {summary.model_services.embedding_requirements.huawei_cloud_support.notes}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">支持模型：</span>
                    {summary.model_services.embedding_requirements.huawei_cloud_support.supported_models.join(', ')}
                  </div>
                </div>
              </div>
            </section>

            {/* 部署服务 */}
            <section id="deployment" className="scroll-mt-20 mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span>🚀</span>
                <span>部署服务需求</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">🐳 容器化</h4>
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {summary.deployment_services.containerization.docker.usage_percentage}%
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    {summary.deployment_services.containerization.docker.projects.length} 个项目支持Docker
                  </div>
                  <div className="text-xs text-gray-500">
                    平均镜像大小: {summary.deployment_services.containerization.docker.avg_image_size}
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 text-sm">
                    <div className="font-medium text-gray-900">
                      🇨🇳 {summary.deployment_services.containerization.huawei_cloud_support.service_name}
                    </div>
                    <div className="text-gray-700 mt-1">
                      {summary.deployment_services.containerization.huawei_cloud_support.notes}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">⚙️ 编排工具</h4>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Kubernetes</span>
                      <span className="font-bold text-green-600">
                        {summary.deployment_services.orchestration.kubernetes.count} 项目
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Docker Compose</span>
                      <span className="font-bold text-blue-600">
                        {summary.deployment_services.orchestration.docker_compose.count} 项目
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200 text-sm">
                    <div className="font-medium text-gray-900">
                      🇨🇳 {summary.deployment_services.orchestration.huawei_cloud_support.service_name}
                    </div>
                    <div className="text-gray-700 mt-1">
                      {summary.deployment_services.orchestration.huawei_cloud_support.notes}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 其他需求 */}
            <section id="other" className="scroll-mt-20 mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span>⚡</span>
                <span>其他需求</span>
              </h3>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">🎮 GPU/NPU 加速</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="border rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">强制需要GPU</div>
                    <div className="text-2xl font-bold text-red-600">
                      {summary.other_requirements.gpu_acceleration.required.count} 个项目
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">推荐GPU加速</div>
                    <div className="text-2xl font-bold text-orange-600">
                      {summary.other_requirements.gpu_acceleration.recommended.count} 个项目
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="font-medium text-gray-900 mb-2">🇨🇳 华为云支持</div>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div>
                      • GPU实例: {summary.other_requirements.gpu_acceleration.huawei_cloud_support.gpu_instances}
                    </div>
                    <div>
                      • 昇腾NPU: {summary.other_requirements.gpu_acceleration.huawei_cloud_support.ascend_npu}
                    </div>
                    <div>
                      • 迁移成本: {summary.other_requirements.gpu_acceleration.huawei_cloud_support.migration_effort}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 华为云整体支持总结 */}
            <section id="huawei-summary" className="scroll-mt-20 mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span>🇨🇳</span>
                <span>华为云整体支持总结</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                  <h4 className="font-semibold text-green-900 mb-3">✅ 完全支持</h4>
                  <ul className="text-sm text-green-800 space-y-2">
                    {summary.huawei_cloud_summary.fully_supported.map((item: string) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-200">
                  <h4 className="font-semibold text-yellow-900 mb-3">⚠️ 部分支持</h4>
                  <ul className="text-sm text-yellow-800 space-y-2">
                    {summary.huawei_cloud_summary.partially_supported.map((item: string) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
                  <h4 className="font-semibold text-red-900 mb-3">❌ 不支持</h4>
                  <ul className="text-sm text-red-800 space-y-2">
                    {summary.huawei_cloud_summary.not_supported.map((item: string) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
                <h4 className="text-xl font-bold mb-2">整体可行性评估</h4>
                <p className="text-lg">{summary.huawei_cloud_summary.overall_feasibility}</p>
              </div>
            </section>
          </div>

          {/* ==================== 第二章：未来需求趋势分析 ==================== */}
          <div className="mb-16">
            <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold mb-2">第二章：未来需求趋势分析</h2>
              <p className="text-green-50">基于Top 5 GitHub项目（mem0, letta, graphiti等）的Issues/PRs分析</p>
            </div>

            <section id="future-trends" className="scroll-mt-20 mb-12">
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <div className="markdown-content" dangerouslySetInnerHTML={{ __html: githubTrends }} />
              </div>
            </section>
          </div>

          {/* ==================== 第三章：学术创新方向 ==================== */}
          <div className="mb-16">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold mb-2">第三章：学术创新方向</h2>
              <p className="text-indigo-50">基于前沿学术论文的创新技术分析</p>
            </div>

            <section id="academic" className="scroll-mt-20 mb-12">
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <div className="markdown-content" dangerouslySetInnerHTML={{ __html: academicTrends }} />
              </div>
            </section>
          </div>

          {/* ==================== 第四章：云服务发展建议 ==================== */}
          <div className="mb-16">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold mb-2">第四章：云服务发展建议</h2>
              <p className="text-orange-50">基于当前需求、未来趋势和学术创新的综合建议</p>
            </div>

            {/* 建议概览 */}
            <section id="recommendations-overview" className="scroll-mt-20 bg-white rounded-xl p-8 shadow-sm mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">📋 建议概览</h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  通过对25个主流Agent Memory项目的深入分析、Top 5
                  GitHub项目的未来趋势研究，以及学术前沿创新的调研，我们发现Agent
                  Memory领域正处于快速发展阶段。为了更好地支持这一生态，云服务提供商需要在以下四个关键领域进行针对性优化和增强。
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <h4 className="font-semibold text-blue-900 mb-2">💾 存储服务优化</h4>
                    <p className="text-sm text-blue-800">
                      提供高性能向量数据库、图数据库托管服务，优化混合存储方案
                    </p>
                  </div>
                  <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                    <h4 className="font-semibold text-purple-900 mb-2">⚡ 计算服务增强</h4>
                    <p className="text-sm text-purple-800">支持GPU/NPU弹性调度，优化Serverless冷启动，提供边缘计算</p>
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                    <h4 className="font-semibold text-green-900 mb-2">🤖 AI服务完善</h4>
                    <p className="text-sm text-green-800">
                      扩展多模态模型支持，提供统一LLM接入层，优化Embedding服务
                    </p>
                  </div>
                  <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                    <h4 className="font-semibold text-orange-900 mb-2">🌐 生态体系建设</h4>
                    <p className="text-sm text-orange-800">构建开发者社区，提供最佳实践，优化成本和性能监控</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 存储服务优化 */}
            <section id="recommendations-storage" className="scroll-mt-20 bg-white rounded-xl p-8 shadow-sm mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">💾 存储服务优化建议</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">1. 托管向量数据库服务</h4>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-gray-700 mb-3">
                      <strong>现状：</strong>目前开发者需要在ECS上自建Qdrant/Milvus，运维成本高
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>建议：</strong>提供完全托管的向量数据库服务，支持一键部署、自动扩缩容、备份恢复
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• 兼容Qdrant/Milvus API，降低迁移成本</li>
                      <li>• 支持HNSW/IVF等多种索引算法</li>
                      <li>• 提供混合搜索（向量+关键词）能力</li>
                      <li>• 集成华为云ModelArts Embedding服务</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">2. 托管图数据库服务</h4>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-gray-700 mb-3">
                      <strong>现状：</strong>40%项目需要图数据库，但华为云无Neo4j托管服务
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>建议：</strong>推出Neo4j兼容的托管图数据库，或增强GES的Cypher支持
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• 完全兼容Neo4j Cypher查询语法</li>
                      <li>• 支持图算法库（PageRank、社区发现等）</li>
                      <li>• 与向量数据库深度集成（知识图谱+向量检索）</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">3. 混合存储优化方案</h4>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-gray-700 mb-3">
                      <strong>趋势：</strong>Agent Memory需要多种存储协同（向量+图+关系型+对象存储）
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• 提供统一的数据访问层，简化多存储管理</li>
                      <li>• 优化存储间数据同步（如图节点向量化）</li>
                      <li>• 提供自动化的分层存储策略（热温冷数据）</li>
                      <li>• 降低跨存储查询延迟（本地缓存、预取优化）</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* 计算服务增强 */}
            <section id="recommendations-compute" className="scroll-mt-20 bg-white rounded-xl p-8 shadow-sm mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">⚡ 计算服务增强建议</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">1. GPU/NPU弹性调度</h4>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-gray-700 mb-3">
                      <strong>现状：</strong>
                      12%项目需要GPU加速，但成本高昂且利用率不足
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• 提供按需GPU实例，支持秒级计费</li>
                      <li>• 昇腾NPU适配主流框架（vLLM、Ollama）</li>
                      <li>• GPU共享调度，提高资源利用率</li>
                      <li>• 提供GPU preemptible实例，降低成本50%+</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">2. Serverless优化</h4>
                  <div className="bg-teal-50 p-4 rounded-lg">
                    <p className="text-gray-700 mb-3">
                      <strong>痛点：</strong>FunctionGraph冷启动慢（3-5秒），不支持向量检索
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• 优化冷启动至500ms内（预热机制）</li>
                      <li>• 内置向量检索能力（无需外部数据库）</li>
                      <li>• 支持WASM运行时（消除原生依赖问题）</li>
                      <li>• 提供长连接支持（WebSocket、SSE）</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">3. 边缘计算支持</h4>
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <p className="text-gray-700 mb-3">
                      <strong>趋势：</strong>未来Agent将向边缘和移动端延伸
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• 支持边缘节点部署轻量级向量检索</li>
                      <li>• 提供端云协同的Memory同步方案</li>
                      <li>• 优化边缘LLM推理（量化模型支持）</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* AI服务完善 */}
            <section id="recommendations-ai" className="scroll-mt-20 bg-white rounded-xl p-8 shadow-sm mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">🤖 AI服务完善建议</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">1. 多模态模型支持</h4>
                  <div className="bg-pink-50 p-4 rounded-lg">
                    <p className="text-gray-700 mb-3">
                      <strong>趋势：</strong>Agent Memory正在向多模态方向发展（图片、音频、视频记忆）
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• 提供多模态Embedding服务（CLIP、ImageBind）</li>
                      <li>• 支持图片OCR+向量化存储</li>
                      <li>• 支持音频转文本+语义检索</li>
                      <li>• 提供视频关键帧提取+向量索引</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">2. 统一LLM接入层</h4>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-gray-700 mb-3">
                      <strong>痛点：</strong>项目需要支持OpenAI/Anthropic/Google等多家LLM
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• 提供统一API网关（兼容OpenAI格式）</li>
                      <li>• 自动路由到最优模型（成本/性能权衡）</li>
                      <li>• 内置Prompt缓存减少重复调用</li>
                      <li>• 支持流式输出和Function Calling</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">3. Embedding服务优化</h4>
                  <div className="bg-cyan-50 p-4 rounded-lg">
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• 支持主流Embedding模型（OpenAI、Cohere、BGE）</li>
                      <li>• 提供批量Embedding API（降低成本）</li>
                      <li>• 支持自定义模型微调和托管</li>
                      <li>• 优化中文语义理解（针对性优化）</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* 生态体系建设 */}
            <section id="recommendations-ecosystem" className="scroll-mt-20 bg-white rounded-xl p-8 shadow-sm mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">🌐 生态体系建设建议</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">1. 开发者社区与最佳实践</h4>
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• 发布Agent Memory参考架构和部署模板</li>
                      <li>• 提供主流项目（mem0、letta）的一键部署</li>
                      <li>• 建立开发者社区和技术博客</li>
                      <li>• 定期举办Hackathon和技术沙龙</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">2. 成本优化工具</h4>
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <p className="text-gray-700 mb-3">
                      <strong>痛点：</strong>LLM API成本占比60-80%，开发者需要精细化成本管理
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• 提供LLM成本分析仪表板</li>
                      <li>• 智能推荐模型切换方案（GPT-4→GPT-4o-mini）</li>
                      <li>• 实现自动化的Prompt优化（减少token消耗）</li>
                      <li>• 提供预算告警和自动限流</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">3. 性能监控与可观测性</h4>
                  <div className="bg-sky-50 p-4 rounded-lg">
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• 向量检索性能监控（QPS、延迟、召回率）</li>
                      <li>• LLM调用链路追踪（Prompt → Response）</li>
                      <li>• 记忆质量评估（准确率、相关性）</li>
                      <li>• 异常检测和自动告警</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">4. 企业级能力</h4>
                  <div className="bg-violet-50 p-4 rounded-lg">
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• 数据安全合规（数据加密、访问控制）</li>
                      <li>• 私有化部署方案（本地化模型、离线向量库）</li>
                      <li>• 多租户隔离和资源配额管理</li>
                      <li>• SLA保障和技术支持服务</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* 总结 */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">🎯 实施路线图建议</h3>
              <div className="space-y-3">
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">短期（3-6个月）</h4>
                  <p className="text-sm text-blue-50">
                    推出托管向量数据库服务、优化FunctionGraph冷启动、提供统一LLM接入层
                  </p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">中期（6-12个月）</h4>
                  <p className="text-sm text-blue-50">
                    推出托管图数据库、多模态Embedding服务、昇腾NPU适配vLLM、发布最佳实践
                  </p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">长期（12个月+）</h4>
                  <p className="text-sm text-blue-50">
                    构建完整的Agent Memory开发平台、边缘计算支持、建立开发者生态社区
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
