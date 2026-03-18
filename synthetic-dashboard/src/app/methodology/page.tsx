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

      <div className="prose prose-slate prose-lg max-w-none 
          prose-headings:text-[#00385e] prose-a:text-[#0072B7]
          prose-table:w-full prose-td:border prose-th:bg-slate-100 prose-th:border
          bg-white p-8 md:p-14 rounded-3xl shadow-lg border border-slate-200">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm, remarkMath]} 
          rehypePlugins={[rehypeKatex]}
        >
          {markdownContent}
        </ReactMarkdown>
      </div>
    </div>
  );
}
