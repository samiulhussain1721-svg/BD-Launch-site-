import React from 'react';

interface GazetteMarkdownRendererProps {
  content: string;
}

export const GazetteMarkdownRenderer: React.FC<GazetteMarkdownRendererProps> = ({ content }) => {
  // Parse markdown lines into structured elements
  const renderFormattedText = (text: string) => {
    // Process bold **text**
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="text-[#FFFFFF] font-medium">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <em key={i} className="text-[#ECE5DA] italic font-serif">
            {part.slice(1, -1)}
          </em>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded-xs bg-[#10191D] border border-white/10 text-xs font-mono text-[#ECE5DA]">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  // Check for table blocks
  const lines = content.split('\n');
  const renderedElements: React.ReactNode[] = [];

  let inList = false;
  let listItems: string[] = [];
  let isNumberedList = false;
  let inTable = false;
  let tableRows: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      if (isNumberedList) {
        renderedElements.push(
          <ol key={`list-${renderedElements.length}`} className="my-6 space-y-3 pl-6 list-decimal marker:text-[#ECE5DA] text-sm sm:text-base text-[#E2E8F0]/85 font-light leading-relaxed">
            {listItems.map((item, idx) => (
              <li key={idx} className="pl-2">
                {renderFormattedText(item)}
              </li>
            ))}
          </ol>
        );
      } else {
        renderedElements.push(
          <ul key={`list-${renderedElements.length}`} className="my-6 space-y-3 pl-2 text-sm sm:text-base text-[#E2E8F0]/85 font-light leading-relaxed">
            {listItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ECE5DA] mt-2.5 shrink-0" />
                <span>{renderFormattedText(item)}</span>
              </li>
            ))}
          </ul>
        );
      }
      listItems = [];
      inList = false;
    }
  };

  const flushTable = () => {
    if (tableRows.length > 0) {
      const headerRow = tableRows[0];
      const dataRows = tableRows.slice(2); // Skip separator |:---|:---|

      const parseRow = (rowStr: string) => 
        rowStr
          .split('|')
          .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1)
          .map(cell => cell.trim());

      const headers = parseRow(headerRow);

      renderedElements.push(
        <div key={`table-${renderedElements.length}`} className="my-8 overflow-x-auto rounded-xs border border-white/10 bg-[#10191D]/80">
          <table className="w-full text-left text-xs sm:text-sm font-mono">
            <thead className="bg-[#172227] text-[#ECE5DA] uppercase tracking-wider border-b border-white/10">
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className="py-3.5 px-4 font-normal">
                    {renderFormattedText(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[#E2E8F0]/80">
              {dataRows.map((row, rIdx) => {
                const cells = parseRow(row);
                return (
                  <tr key={rIdx} className="hover:bg-white/5 transition-colors">
                    {cells.map((c, cIdx) => (
                      <td key={cIdx} className="py-3 px-4">
                        {renderFormattedText(c)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Table detection
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      flushList();
      inTable = true;
      tableRows.push(trimmed);
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Horizontal Rule
    if (trimmed === '---' || trimmed === '***') {
      flushList();
      renderedElements.push(
        <div key={`hr-${i}`} className="my-10 flex items-center justify-center gap-4">
          <div className="h-px bg-white/10 grow max-w-xs" />
          <span className="text-[#ECE5DA]/40 text-xs font-mono tracking-widest">✦</span>
          <div className="h-px bg-white/10 grow max-w-xs" />
        </div>
      );
      continue;
    }

    // Headings
    if (trimmed.startsWith('## ')) {
      flushList();
      renderedElements.push(
        <h2 key={`h2-${i}`} className="text-xl sm:text-2xl lg:text-3xl font-display text-[#FFFFFF] font-light tracking-wide mt-12 mb-6 border-b border-white/10 pb-3">
          {trimmed.replace('## ', '')}
        </h2>
      );
      continue;
    }

    if (trimmed.startsWith('### ')) {
      flushList();
      renderedElements.push(
        <h3 key={`h3-${i}`} className="text-lg sm:text-xl font-display text-[#ECE5DA] font-normal tracking-wide mt-8 mb-4">
          {trimmed.replace('### ', '')}
        </h3>
      );
      continue;
    }

    // Blockquote / Pull Quote
    if (trimmed.startsWith('> ')) {
      flushList();
      const quoteText = trimmed.replace(/^>\s*/, '');
      renderedElements.push(
        <blockquote key={`quote-${i}`} className="my-8 pl-6 sm:pl-8 border-l-2 border-[#ECE5DA] bg-[#ECE5DA]/5 py-4 px-6 rounded-r-xs italic font-serif text-base sm:text-lg text-[#ECE5DA] leading-relaxed relative">
          <span className="text-2xl text-[#ECE5DA]/30 font-serif absolute -top-2 left-2">“</span>
          {renderFormattedText(quoteText)}
        </blockquote>
      );
      continue;
    }

    // Unordered List (* or -)
    if (/^[\*\-]\s+/.test(trimmed)) {
      if (!inList || isNumberedList) {
        flushList();
        inList = true;
        isNumberedList = false;
      }
      listItems.push(trimmed.replace(/^[\*\-]\s+/, ''));
      continue;
    }

    // Numbered List (1. or 2.)
    if (/^\d+\.\s+/.test(trimmed)) {
      if (!inList || !isNumberedList) {
        flushList();
        inList = true;
        isNumberedList = true;
      }
      listItems.push(trimmed.replace(/^\d+\.\s+/, ''));
      continue;
    }

    // Regular Paragraph
    if (trimmed.length > 0) {
      flushList();
      renderedElements.push(
        <p key={`p-${i}`} className="my-4 text-sm sm:text-base text-[#E2E8F0]/85 font-light leading-relaxed">
          {renderFormattedText(trimmed)}
        </p>
      );
    }
  }

  flushList();
  flushTable();

  return <div className="gazette-prose space-y-2">{renderedElements}</div>;
};
