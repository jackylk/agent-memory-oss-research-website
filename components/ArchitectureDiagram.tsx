'use client';

interface Node {
  id: string;
  label: string;
}

interface Layer {
  title: string;
  icon: string;
  nodes: Node[];
  color: {
    bg: string;
    border: string;
    textColor: string;
  };
}

interface ArchitectureDiagramProps {
  layers: Layer[];
}

export function ArchitectureDiagram({ layers }: ArchitectureDiagramProps) {
  return (
    <div className="my-8 p-6 bg-white rounded-lg border border-gray-200">
      <div className="space-y-6">
        {layers.map((layer, layerIndex) => (
          <div key={layerIndex}>
            {/* Layer Container with Border */}
            <div className={`p-6 rounded-xl border-2 ${layer.color.border} ${layer.color.bg} bg-opacity-20`}>
              {/* Layer Title */}
              <div className="text-center mb-4">
                <h4 className="text-base font-bold text-gray-800 inline-flex items-center gap-2">
                  <span>{layer.icon}</span>
                  <span>{layer.title}</span>
                </h4>
              </div>

              {/* Nodes Container */}
              <div className="flex flex-wrap justify-center gap-4">
                {layer.nodes.map((node, nodeIndex) => (
                  <div
                    key={node.id}
                    className={`px-6 py-4 rounded-lg border-2 bg-white ${layer.color.border} font-semibold text-sm text-center min-w-[160px] shadow-md hover:shadow-lg transition-all hover:scale-105`}
                    style={{ color: layer.color.textColor }}
                  >
                    {node.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Arrow to next layer */}
            {layerIndex < layers.length - 1 && (
              <div className="flex justify-center my-4">
                <div className="text-gray-400 text-3xl font-bold">↓</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
