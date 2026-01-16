
import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Simple regex-based line processing for better aesthetics without heavy libs
  const lines = content.split('\n');

  return (
    <div className="prose prose-indigo max-w-none text-slate-700">
      {lines.map((line, idx) => {
        // Headers
        if (line.startsWith('### ')) return <h3 key={idx} className="text-xl font-bold mt-6 mb-2 text-indigo-700">{line.replace('### ', '')}</h3>;
        if (line.startsWith('## ')) return <h2 key={idx} className="text-2xl font-bold mt-8 mb-4 text-indigo-800 border-b pb-2">{line.replace('## ', '')}</h2>;
        if (line.startsWith('# ')) return <h1 key={idx} className="text-3xl font-black mt-10 mb-6 text-indigo-900">{line.replace('# ', '')}</h1>;
        
        // Bullet points
        if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
          return (
            <div key={idx} className="flex items-start space-x-2 ml-4 mb-1">
              <span className="text-indigo-500 mt-1.5 text-[8px]">●</span>
              <span>{line.trim().substring(2)}</span>
            </div>
          );
        }

        // Numbered list
        if (/^\d+\./.test(line.trim())) {
          return (
            <div key={idx} className="flex items-start space-x-2 ml-4 mb-1">
              <span className="font-bold text-indigo-600">{line.trim().split('.')[0]}.</span>
              <span>{line.trim().substring(line.trim().indexOf('.') + 1)}</span>
            </div>
          );
        }

        // Bold text
        if (line.includes('**')) {
          const parts = line.split('**');
          return (
            <p key={idx} className="mb-3 leading-relaxed">
              {parts.map((part, i) => (i % 2 === 1 ? <strong key={i} className="font-bold text-slate-900">{part}</strong> : part))}
            </p>
          );
        }

        // Empty line
        if (line.trim() === '') return <div key={idx} className="h-2"></div>;

        return <p key={idx} className="mb-3 leading-relaxed">{line}</p>;
      })}
    </div>
  );
};

export default MarkdownRenderer;
