import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export default function SummaryPage() {
  const summaryPath = path.join(process.cwd(), 'data/aggregated/cloud-services-summary.json');
  const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'));

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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">云服务需求总结</h2>
          <p className="text-gray-600">
            基于 {summary.metadata.total_projects_analyzed} 个 Agent Memory 项目的云服务需求分析汇总
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {summary.metadata.total_projects_analyzed}
            </div>
            <div className="text-sm text-gray-600">分析项目数</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {summary.cloud_service_usage_statistics.vector_database.usage_percentage}%
            </div>
            <div className="text-sm text-gray-600">向量数据库采用率</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {summary.deployment_patterns.containerization.docker.percentage}%
            </div>
            <div className="text-sm text-gray-600">Docker 采用率</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-3xl font-bold text-orange-600 mb-1">
              {summary.cost_analysis.cost_breakdown_by_category.avg_percentages.llm_api}
            </div>
            <div className="text-sm text-gray-600">LLM API 成本占比</div>
          </div>
        </div>

        {/* Vector DB Ranking */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">🗄️ 向量数据库使用排名</h3>
          <div className="space-y-3">
            {summary.popular_tech_choices.vector_db_ranking.map((db: any) => (
              <div key={db.name} className="flex items-center gap-4">
                <div className="text-2xl font-bold text-gray-300 w-8">#{db.rank}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">{db.name}</span>
                    <span className="text-sm text-gray-600">{db.count} 个项目</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(db.count / summary.metadata.total_projects_analyzed) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-sm text-gray-600 min-w-[200px] text-right">
                  {db.reason}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LLM Providers */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">🤖 LLM 提供商使用情况</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {summary.popular_tech_choices.llm_provider_ranking.map((provider: any) => (
              <div key={provider.name} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{provider.name}</span>
                  <span className="text-xl font-bold text-blue-600">#{provider.rank}</span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {provider.count}/{summary.metadata.total_projects_analyzed} 个项目
                </div>
                <div className="text-xs text-gray-500">
                  热门模型: {provider.popular_model}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Analysis */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">💰 成本分析</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">部署规模</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">说明</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">月度成本范围</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">小型部署</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{summary.cost_analysis.deployment_size_ranges.small.description}</td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900 text-right">{summary.cost_analysis.deployment_size_ranges.small.total_monthly_cost_range}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">中型部署</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{summary.cost_analysis.deployment_size_ranges.medium.description}</td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900 text-right">{summary.cost_analysis.deployment_size_ranges.medium.total_monthly_cost_range}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">大型部署</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{summary.cost_analysis.deployment_size_ranges.large.description}</td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900 text-right">{summary.cost_analysis.deployment_size_ranges.large.total_monthly_cost_range}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">📊 成本构成</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {Object.entries(summary.cost_analysis.cost_breakdown_by_category.avg_percentages).map(([key, value]) => {
              const labels: Record<string, string> = {
                llm_api: 'LLM API',
                compute: '计算资源',
                database: '数据库',
                vector_db: '向量数据库',
                storage: '存储',
                monitoring_and_logs: '监控日志',
                network: '网络'
              };
              return (
                <div key={key} className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{String(value)}</div>
                  <div className="text-xs text-gray-600">{labels[key]}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cloud Provider Preferences */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">☁️ 云服务商偏好</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(summary.popular_tech_choices.cloud_provider_preferences)
              .filter(([key]) => key !== 'multi_cloud_hybrid')
              .map(([key, provider]: [string, any]) => (
                <div key={key} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{provider.count ? `${key.toUpperCase()}` : key}</span>
                    <span className="text-lg font-bold text-blue-600">{provider.percentage}%</span>
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    {provider.count}/{summary.metadata.total_projects_analyzed} 个项目
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    优势: {provider.strengths?.join(', ')}
                  </div>
                  <div className="text-xs text-gray-400">
                    热门服务: {provider.popular_services?.join(', ')}
                  </div>
                </div>
              ))}
          </div>
          {summary.popular_tech_choices.cloud_provider_preferences.multi_cloud_hybrid && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="font-medium text-gray-900 mb-2">
                🌐 多云/混合部署 ({summary.popular_tech_choices.cloud_provider_preferences.multi_cloud_hybrid.percentage}%)
              </div>
              <div className="text-sm text-gray-600 mb-1">
                优势: {summary.popular_tech_choices.cloud_provider_preferences.multi_cloud_hybrid.strengths?.join(', ')}
              </div>
              <div className="text-sm text-gray-500">
                典型组合: {summary.popular_tech_choices.cloud_provider_preferences.multi_cloud_hybrid.typical_combo}
              </div>
            </div>
          )}
        </div>

        {/* Optimization Strategies */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">💡 优化策略</h3>

          {/* Cost Optimization */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">💰 成本优化</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <div className="font-medium text-gray-900 mb-2">🤖 LLM 成本优化</div>
                <ul className="text-sm text-gray-600 space-y-1">
                  {summary.optimization_strategies.cost_optimization.llm_cost.map((item: string, i: number) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <div className="font-medium text-gray-900 mb-2">💾 存储成本优化</div>
                <ul className="text-sm text-gray-600 space-y-1">
                  {summary.optimization_strategies.cost_optimization.storage_cost.map((item: string, i: number) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <div className="font-medium text-gray-900 mb-2">⚡ 计算成本优化</div>
                <ul className="text-sm text-gray-600 space-y-1">
                  {summary.optimization_strategies.cost_optimization.compute_cost.map((item: string, i: number) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <div className="font-medium text-gray-900 mb-2">🌐 网络成本优化</div>
                <ul className="text-sm text-gray-600 space-y-1">
                  {summary.optimization_strategies.cost_optimization.network_cost.map((item: string, i: number) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Performance Optimization */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">🚀 性能优化</h4>
            <div className="border rounded-lg p-4">
              <ul className="text-sm text-gray-600 space-y-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                {summary.optimization_strategies.performance_optimization.map((item: string, i: number) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Reliability Optimization */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">🛡️ 可靠性优化</h4>
            <div className="border rounded-lg p-4">
              <ul className="text-sm text-gray-600 space-y-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                {summary.optimization_strategies.reliability_optimization.map((item: string, i: number) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
