'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

interface SummaryPageProps {
  summary: any;
  githubTrends: string;
  academicTrends: string;
}

export default function SummaryPageClient({ summary, githubTrends, academicTrends }: SummaryPageProps) {
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

  // 目录导航项
  const tocItems = [
    { id: 'insights', label: '💡 核心洞察' },
    { id: 'storage', label: '💾 存储服务', children: [
      { id: 'storage-vector', label: '向量数据库' },
      { id: 'storage-graph', label: '图数据库' },
      { id: 'storage-relational', label: '关系型数据库' },
      { id: 'storage-kv', label: 'KV数据库' },
      { id: 'storage-object', label: '对象存储' },
    ]},
    { id: 'models', label: '🤖 模型服务', children: [
      { id: 'models-llm', label: 'LLM模型' },
      { id: 'models-embedding', label: 'Embedding模型' },
    ]},
    { id: 'deployment', label: '🚀 部署服务' },
    { id: 'other', label: '⚡ 其他需求' },
    { id: 'huawei-summary', label: '🇨🇳 华为云总结' },
    { id: 'future-trends', label: '🔮 未来需求趋势' },
    { id: 'academic', label: '🎓 学术创新方向' },
  ];

  // 监听滚动，更新当前活动章节
  useEffect(() => {
    const handleScroll = () => {
      const sections = tocItems.flatMap(item =>
        item.children ? [item, ...item.children] : [item]
      );

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
      const offset = 80; // Header高度
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
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
        {service.use_for && (
          <div className="text-xs text-gray-600">
            用于: {service.use_for}
          </div>
        )}
        {service.extensions && service.extensions.length > 0 && (
          <div className="text-xs text-gray-600">
            扩展: {service.extensions.join(', ')}
          </div>
        )}
        {service.memory_types && (
          <div className="text-xs text-gray-600">
            用途: {service.memory_types.join(', ')}
          </div>
        )}
        {service.avg_dimension > 0 && (
          <div className="text-xs text-gray-500 mt-1">
            平均维度: {service.avg_dimension}
          </div>
        )}
        {service.use_cases && Array.isArray(service.use_cases) && service.use_cases.length > 0 && (
          <div className="text-xs text-gray-600">
            用途: {service.use_cases.join(', ')}
          </div>
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
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-20">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">目录导航</h3>
              <nav className="space-y-1">
                {tocItems.map((item) => (
                  <div key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        activeSection === item.id
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {item.label}
                    </button>
                    {item.children && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <button
                            key={child.id}
                            onClick={() => scrollToSection(child.id)}
                            className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors ${
                              activeSection === child.id
                                ? 'bg-blue-50 text-blue-600 font-medium'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
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
          <div className="mb-8" id="top">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">云服务需求分析</h2>
            <p className="text-gray-600">
              基于 {summary.metadata.total_projects_analyzed} 个 Agent Memory 项目的云服务需求分析 | 版本 {summary.metadata.analysis_version}
            </p>
          </div>

          {/* Key Insights */}
          <div id="insights" className="scroll-mt-20 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-12 border border-blue-100">
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

          {/* ==================== 1. 存储服务 ==================== */}
          <section id="storage" className="scroll-mt-20 mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>💾</span>
              <span>存储服务需求</span>
            </h3>

            {/* 向量数据库 */}
            <div id="storage-vector" className="scroll-mt-20 bg-white rounded-xl p-6 shadow-sm mb-6">
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
            <div id="storage-graph" className="scroll-mt-20 bg-white rounded-xl p-6 shadow-sm mb-6">
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
            <div id="storage-relational" className="scroll-mt-20 bg-white rounded-xl p-6 shadow-sm mb-6">
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
            <div id="storage-kv" className="scroll-mt-20 bg-white rounded-xl p-6 shadow-sm mb-6">
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
            <div id="storage-object" className="scroll-mt-20 bg-white rounded-xl p-6 shadow-sm mb-6">
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

          {/* ==================== 2. 模型服务 ==================== */}
          <section id="models" className="scroll-mt-20 mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>🤖</span>
              <span>模型服务需求</span>
            </h3>

            {/* LLM需求 */}
            <div id="models-llm" className="scroll-mt-20 bg-white rounded-xl p-6 shadow-sm mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">💬 大语言模型（LLM）</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {summary.model_services.llm_requirements.providers.slice(0, 6).map((provider: any, i: number) => (
                  <div key={provider.name} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{provider.name}</span>
                      <span className="text-xl font-bold text-blue-600">#{i + 1}</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      {provider.count} 个项目使用
                    </div>
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
                      {summary.model_services.llm_requirements.huawei_cloud_support.supported_apis.map((api: string) => (
                        <li key={api}>• {api}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700 mb-1">📚 开源模型：</div>
                    <ul className="text-gray-600 space-y-1">
                      {summary.model_services.llm_requirements.huawei_cloud_support.open_source_models.slice(0, 4).map((model: string) => (
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

            {/* Embedding需求 */}
            <div id="models-embedding" className="scroll-mt-20 bg-white rounded-xl p-6 shadow-sm mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">🎯 Embedding模型</h4>
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2">维度分布：</div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(summary.model_services.embedding_requirements.dimension_distribution).map(([dim, count]: [string, any]) => (
                    <span key={dim} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                      {dim}维 ({count} 个项目)
                    </span>
                  ))}
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

          {/* ==================== 3. 部署服务 ==================== */}
          <section id="deployment" className="scroll-mt-20 mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>🚀</span>
              <span>部署服务需求</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 容器化 */}
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

              {/* 编排 */}
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

          {/* ==================== 4. 其他需求 ==================== */}
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
                  <div>• GPU实例: {summary.other_requirements.gpu_acceleration.huawei_cloud_support.gpu_instances}</div>
                  <div>• 昇腾NPU: {summary.other_requirements.gpu_acceleration.huawei_cloud_support.ascend_npu}</div>
                  <div>• 迁移成本: {summary.other_requirements.gpu_acceleration.huawei_cloud_support.migration_effort}</div>
                </div>
              </div>
            </div>
          </section>

          {/* ==================== 华为云整体支持总结 ==================== */}
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

          {/* ==================== 未来需求趋势 ==================== */}
          <section id="future-trends" className="scroll-mt-20 mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>🔮</span>
              <span>未来需求趋势 (GitHub分析)</span>
            </h3>
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="markdown-content" dangerouslySetInnerHTML={{ __html: githubTrends }} />
            </div>
          </section>

          {/* ==================== 学术创新方向 ==================== */}
          <section id="academic" className="scroll-mt-20 mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>🎓</span>
              <span>学术创新方向</span>
            </h3>
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="markdown-content" dangerouslySetInnerHTML={{ __html: academicTrends }} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
