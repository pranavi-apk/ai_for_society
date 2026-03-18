import fs from 'fs';
import path from 'path';
import 'katex/dist/katex.min.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { BookOpen, Download } from 'lucide-react';

export default function MethodologyPage() {
  const filePath = path.join(process.cwd(), 'src', 'data', 'academic_paper.md');
  const markdownContent = fs.readFileSync(filePath, 'utf8');

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 block print:hidden">
        <div>
          <h1 className="text-4xl font-extrabold text-[#00385e] flex items-center gap-3">
            <BookOpen className="text-[#0072B7] w-10 h-10" />
            Methodology & Research
          </h1>
          <p className="text-xl text-slate-600 mt-4 leading-relaxed">
            The complete academic pre-print detailing the algorithmic and architectural foundation of the Synthetic Population Generator.
          </p>
        </div>
      </div>

      <div className="bg-white p-8 md:p-14 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 mb-12">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm, remarkMath]} 
          rehypePlugins={[rehypeKatex]}
          components={{
            h1: ({node, ...props}) => <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 border-b border-slate-200 pb-6 mb-8 tracking-tight" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mt-14 mb-6 tracking-tight bg-slate-50 px-4 py-2 rounded-lg border-l-4 border-blue-500" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-xl font-semibold text-slate-700 mt-10 mb-4 flex items-center gap-2 before:content-[''] before:w-2 before:h-2 before:bg-blue-400 before:rounded-full" {...props} />,
            p: ({node, ...props}) => <p className="text-lg text-slate-600 leading-relaxed mb-6" {...props} />,
            a: ({node, ...props}) => <a className="text-blue-600 hover:text-blue-800 underline decoration-blue-300 underline-offset-4" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-8 space-y-3 text-lg text-slate-600 marker:text-blue-400" {...props} />,
            ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-8 space-y-3 text-lg text-slate-600" {...props} />,
            li: ({node, ...props}) => <li className="pl-2" {...props} />,
            strong: ({node, ...props}) => <strong className="font-semibold text-slate-800" {...props} />,
            blockquote: ({node, ...props}) => <blockquote className="p-6 my-8 bg-blue-50/50 border-l-4 border-blue-500 rounded-r-xl italic text-slate-700 text-lg shadow-sm" {...props} />,
            hr: ({node, ...props}) => <hr className="my-14 border-slate-200" {...props} />,
            table: ({node, ...props}) => (
              <div className="overflow-x-auto mb-10 mt-6 rounded-xl border border-slate-200 shadow-sm">
                <table className="min-w-full divide-y divide-slate-200 bg-white" {...props} />
              </div>
            ),
            thead: ({node, ...props}) => <thead className="bg-slate-50" {...props} />,
            th: ({node, ...props}) => <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200" {...props} />,
            tbody: ({node, ...props}) => <tbody className="divide-y divide-slate-100" {...props} />,
            td: ({node, ...props}) => <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600" {...props} />,
            code: ({node, inline, ...props}: any) => 
              inline ? 
                <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono border border-slate-200" {...props} /> :
                <div className="bg-[#0f172a] rounded-xl p-6 mb-8 overflow-x-auto shadow-inner"><code className="text-slate-50 text-sm font-mono leading-relaxed" {...props} /></div>
          }}
        >
          {markdownContent}
        </ReactMarkdown>
      </div>
    </div>
  );
}
