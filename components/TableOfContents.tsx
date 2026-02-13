'use client';

import { useState, useEffect } from 'react';

export interface TocSection {
  id: string;
  title: string;
  icon?: string;
  children?: TocSection[];
}

interface TableOfContentsProps {
  sections: TocSection[];
}

export function TableOfContents({ sections }: TableOfContentsProps) {
  const [activeSection, setActiveSection] = useState<string>('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // Collect all section IDs (including children) for intersection observer
  const allSectionIds = sections.flatMap((s) => [
    s.id,
    ...(s.children?.map((c) => c.id) || []),
  ]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -80% 0px',
      }
    );

    allSectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [sections]);

  // Auto-expand parent when a child is active
  useEffect(() => {
    for (const section of sections) {
      if (section.children?.some((c) => c.id === activeSection)) {
        setExpandedSections((prev) => new Set(prev).add(section.id));
      }
    }
  }, [activeSection, sections]);

  const toggleExpand = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

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

  return (
    <nav className="sticky top-24 w-64 hidden xl:block max-h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          📑 目录导航
        </h3>
        <ul className="space-y-1">
          {sections.map((section) => {
            const hasChildren = section.children && section.children.length > 0;
            const isExpanded = expandedSections.has(section.id);
            const isChildActive = section.children?.some((c) => c.id === activeSection);

            return (
              <li key={section.id}>
                <div className="flex items-center">
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className={`flex-1 text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      activeSection === section.id || (isChildActive && !isExpanded)
                        ? 'bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {section.icon && <span className="mr-1.5">{section.icon}</span>}
                    {section.title}
                  </button>
                  {hasChildren && (
                    <button
                      onClick={() => toggleExpand(section.id)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-all"
                      title={isExpanded ? '收起子章节' : '展开子章节'}
                    >
                      <svg
                        className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Sub-sections */}
                {hasChildren && isExpanded && (
                  <ul className="ml-4 mt-1 space-y-0.5 border-l-2 border-gray-100">
                    {section.children!.map((child) => (
                      <li key={child.id}>
                        <button
                          onClick={() => scrollToSection(child.id)}
                          className={`w-full text-left px-3 py-1.5 rounded-r-lg text-xs transition-all ${
                            activeSection === child.id
                              ? 'bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-600 -ml-[2px]'
                              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                          }`}
                        >
                          {child.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
