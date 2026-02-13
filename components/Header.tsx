'use client';

import Link from 'next/link';

interface HeaderProps {
  viewMode: 'category' | 'tech' | 'benchmark';
  onViewModeChange: (mode: 'category' | 'tech' | 'benchmark') => void;
}

export default function Header({ viewMode, onViewModeChange }: HeaderProps) {
  return (
    <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between">
          {/* 左侧：标题 */}
          <Link href="/">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer">
              Agent Memory 研究中心
            </h1>
          </Link>

          {/* 右侧：视图切换 + 导航 */}
          <div className="flex items-center gap-6">
            {/* 视图切换按钮 */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => onViewModeChange('category')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'category'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🗂️ 分类视图
              </button>
              <button
                onClick={() => onViewModeChange('tech')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'tech'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🛠️ 技术流派
              </button>
              <button
                onClick={() => onViewModeChange('benchmark')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'benchmark'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🏆 Benchmark排名
              </button>
            </div>

            {/* 导航链接 */}
            <nav className="flex gap-4 text-sm">
              <Link href="/compare" className="text-gray-600 hover:text-gray-900 transition">
                项目对比
              </Link>
              <Link href="/summary" className="text-gray-600 hover:text-gray-900 transition">
                云服务需求总结
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
