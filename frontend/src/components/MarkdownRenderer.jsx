import ReactMarkdown from "react-markdown";

function MarkdownRenderer({ content }) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => (
          <h1 className="text-lg font-bold text-[#22c55e] mt-4 mb-3 pb-2 border-b border-[#27272a]">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-base font-semibold text-[#22c55e] mt-4 mb-2">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-sm font-semibold text-[#d1d5db] mt-3 mb-1">
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="mb-3 leading-relaxed text-[#d1d5db]">
            {children}
          </p>
        ),
        ul: ({ children }) => <ul className="mb-3 space-y-1">{children}</ul>,
        ol: ({ children }) => (
          <ol className="mb-3 space-y-1 list-decimal list-inside">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="ml-4 text-[#d1d5db] leading-relaxed">
            • {children}
          </li>
        ),
        code: ({ inline, children }) =>
          inline ? (
            <code className="px-1.5 py-0.5 rounded bg-[#27272a] text-[#22c55e] text-xs font-mono">
              {children}
            </code>
          ) : (
            <code className="block p-3 my-2 rounded-lg bg-[#18181b] border border-[#27272a] text-[#9ca3af] text-xs font-mono overflow-x-auto">
              {children}
            </code>
          ),
        pre: ({ children }) => (
          <pre className="mb-3 p-3 rounded-lg bg-[#18181b] border border-[#27272a] overflow-x-auto">
            {children}
          </pre>
        ),
        blockquote: ({ children }) => (
          <blockquote className="pl-4 border-l-2 border-[#22c55e] text-[#9ca3af] italic my-3">
            {children}
          </blockquote>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-[#22c55e]">
            {children}
          </strong>
        ),
        em: ({ children }) => (
          <em className="italic text-[#d1d5db]">
            {children}
          </em>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#22c55e] hover:text-[#16a34a] underline decoration-dotted"
          >
            {children}
          </a>
        ),
        hr: () => <hr className="my-4 border-[#27272a]" />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export default MarkdownRenderer;
