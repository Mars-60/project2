import { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Sparkles, Settings, User, ChevronRight, ChevronDown, FileText, Folder, Send, MessageSquare } from "lucide-react";

// ============================================
// PARSE GITHUB URL
// ============================================
function parseGitHubUrl(url) {
  // Remove trailing slash
  url = url.replace(/\/$/, '');
  
  // Extract owner/repo from various formats
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (match) {
    return { 
      owner: match[1], 
      repo: match[2].replace(/\.git$/, '') 
    };
  }
  
  // Direct format: owner/repo
  const directMatch = url.match(/^([^\/]+)\/([^\/]+)$/);
  if (directMatch) {
    return { owner: directMatch[1], repo: directMatch[2] };
  }
  
  return null;
}

// ============================================
// WORKSPACE NAVBAR
// ============================================
function WorkspaceNavbar({ repoUrl, onRepoChatClick, isRepoChat }) {
  return (
    <nav className="h-16 flex items-center justify-between px-6 bg-[#0b0b0f]/90 backdrop-blur-md border-b border-[#27272a]/50 sticky top-0 z-50">
      {/* Left: Brand */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center shadow-lg shadow-[#22c55e]/20">
          <Sparkles size={18} className="text-[#0b0b0f]" strokeWidth={2.5} />
        </div>
        <span className="text-lg font-semibold text-[#e5e7eb] tracking-tight">
          Gitzy
        </span>
      </div>

      {/* Center: Repo URL */}
      <div className="max-w-md px-4 py-2 rounded-lg bg-[#18181b]/60 border border-[#27272a]/40">
        <div className="flex items-center gap-2 text-xs text-[#9ca3af]">
          <span className="opacity-60">Repository:</span>
          <span className="text-[#d1d5db] font-mono truncate">{repoUrl}</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button 
          onClick={onRepoChatClick}
          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
            isRepoChat
              ? 'bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/30 shadow-lg shadow-[#22c55e]/5'
              : 'bg-[#27272a]/40 text-[#9ca3af] hover:text-[#e5e7eb] hover:bg-[#27272a]/60 border border-transparent'
          }`}
        >
          <MessageSquare size={16} />
          <span>Repo Chat</span>
        </button>
        <button className="p-2 rounded-lg hover:bg-[#27272a]/40 transition-colors text-[#9ca3af] hover:text-[#e5e7eb]">
          <Settings size={18} />
        </button>
        <button className="p-2 rounded-lg hover:bg-[#27272a]/40 transition-colors text-[#9ca3af] hover:text-[#e5e7eb]">
          <User size={18} />
        </button>
      </div>
    </nav>
  );
}

// ============================================
// FILE/FOLDER ITEM COMPONENT
// ============================================
function FileTreeItem({ item, level, selectedFile, onFileSelect, onFolderToggle, expandedFolders }) {
  const isDir = item.type === "dir";
  const isExpanded = expandedFolders.has(item.path);
  const isSelected = selectedFile?.path === item.path;

  return (
    <div>
      {/* File/Folder Button */}
      <button
        onClick={() => {
          if (isDir) {
            onFolderToggle(item);
          } else {
            onFileSelect(item);
          }
        }}
        style={{ paddingLeft: `${level * 12 + 12}px` }}
        className={`
          w-full flex items-center gap-2 py-2 pr-3 rounded-md text-left
          transition-all duration-150 group relative
          ${isSelected 
            ? 'bg-[#22c55e]/10 text-[#22c55e]' 
            : 'text-[#d1d5db] hover:bg-[#27272a]/40 hover:text-[#e5e7eb] cursor-pointer'
          }
        `}
      >
        {/* Active indicator */}
        {isSelected && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-[#22c55e] rounded-r" />
        )}

        {/* Chevron for folders */}
        {isDir && (
          <div className="w-4 flex items-center justify-center">
            {isExpanded ? (
              <ChevronDown size={14} className="flex-shrink-0 opacity-60" />
            ) : (
              <ChevronRight size={14} className="flex-shrink-0 opacity-60" />
            )}
          </div>
        )}

        {/* Icon */}
        {isDir ? (
          <Folder size={16} className="flex-shrink-0 opacity-60 text-[#22c55e]" />
        ) : (
          <FileText size={16} className="flex-shrink-0 opacity-60" />
        )}

        {/* Name */}
        <span className="text-xs font-mono truncate flex-1">
          {item.name}
        </span>
      </button>

      {/* Children (if folder is expanded) */}
      {isDir && isExpanded && item.children && (
        <div>
          {item.children.map((child, idx) => (
            <FileTreeItem
              key={idx}
              item={child}
              level={level + 1}
              selectedFile={selectedFile}
              onFileSelect={onFileSelect}
              onFolderToggle={onFolderToggle}
              expandedFolders={expandedFolders}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// REPO SIDEBAR
// ============================================
function RepoSidebar({ tree, loading, selectedFile, onFileSelect, onFolderToggle, expandedFolders }) {
  return (
    <aside className="w-64 bg-[#0f0f11] border-r border-[#27272a]/50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[#27272a]/30">
        <h2 className="text-[10px] uppercase tracking-[0.1em] text-[#6b7280] font-semibold mb-3">
          EXPLORER
        </h2>
        <div className="flex items-center gap-2 text-[#9ca3af]">
          <Folder size={16} className="text-[#22c55e]" />
          <span className="text-xs font-medium">Repository Files</span>
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {loading ? (
          <div className="p-4 text-center">
            <div className="w-5 h-5 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-[#6b7280]">Loading files...</p>
          </div>
        ) : tree.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-xs text-[#6b7280]">No files found</p>
          </div>
        ) : (
          tree.map((item, idx) => (
            <FileTreeItem
              key={idx}
              item={item}
              level={0}
              selectedFile={selectedFile}
              onFileSelect={onFileSelect}
              onFolderToggle={onFolderToggle}
              expandedFolders={expandedFolders}
            />
          ))
        )}
      </div>
    </aside>
  );
}

// ============================================
// WELCOME VIEW
// ============================================
function WelcomeView({ onSuggestionClick }) {
  const suggestions = [
    "What is this repo about?",
    "Explain the folder structure",
    "Which file should I start with?",
  ];

  return (
    <div className="flex items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Hero */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#22c55e] via-[#86efac] to-[#22c55e] bg-clip-text text-transparent animate-gradient">
            Welcome to Gitzy ✨
          </h1>
          <p className="text-[#9ca3af] text-base leading-relaxed max-w-lg">
            Select a file from the repository explorer to dive deep into the code, or ask Gitzy anything about this codebase to get started.
          </p>
        </div>

        {/* Suggestions */}
        <div className="space-y-3">
          <p className="text-xs text-[#6b7280] uppercase tracking-wider font-medium">
            TRY ASKING:
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => onSuggestionClick(suggestion)}
                className="px-4 py-2.5 rounded-full bg-gradient-to-b from-[#18181b] to-[#0f0f11] 
                         border border-[#27272a] text-[#d1d5db] text-sm
                         hover:border-[#22c55e]/50 hover:text-[#22c55e] hover:shadow-lg hover:shadow-[#22c55e]/10
                         transition-all duration-200 cursor-pointer"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Visual accent */}
        <div className="pt-8 opacity-40">
          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[#22c55e] to-transparent rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ============================================
// FILE VIEW
// ============================================
function FileView({ file, messages, fileContent, loadingContent }) {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const userScrolledUpRef = useRef(false);

  // Detect manual scroll
  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;

    const isNearBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < 80;

    userScrolledUpRef.current = !isNearBottom;
  };

  // Auto-scroll on NEW messages (user OR assistant)
  useEffect(() => {
    if (!containerRef.current) return;
    if (userScrolledUpRef.current) return;

    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  return (
    <div className="h-full flex flex-col min-h-0">
      {/* File Header */}
      <div className="px-6 py-4 bg-[#0f0f11]/40 border-b border-[#27272a]/30">
        <h2 className="text-sm font-semibold text-[#e5e7eb] font-mono">
          {file.path}
        </h2>
      </div>

      {/* Unified Scroll Area */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-6 py-4 space-y-6"
      >
        {/* Code Preview */}
        <div className="bg-[#18181b] rounded-lg border border-[#27272a]/40 p-4">
          {loadingContent ? (
            <div className="h-10 w-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto" />
          ) : (
            <pre className="text-xs text-[#9ca3af] font-mono whitespace-pre-wrap">
              <code>{fileContent || "// No content available"}</code>
            </pre>
          )}
        </div>

        {/* Chat */}
       {messages.map((msg, idx) => (
  <div
    key={idx}
    className={`flex ${msg.role === "user" ? "justify-end" : ""}`}
  >
    <div
      className={`max-w-2xl px-4 py-3 rounded-2xl text-sm ${
        msg.role === "user"
          ? "bg-[#27272a]/40 text-[#d1d5db]"
          : "bg-[#22c55e]/10 border border-[#22c55e]/20"
      }`}
    >
      {msg.role === "assistant" ? (
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
            ul: ({ children }) => (
              <ul className="mb-3 space-y-1">
                {children}
              </ul>
            ),
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
            hr: () => (
              <hr className="my-4 border-[#27272a]" />
            ),
          }}
        >
          {msg.content}
        </ReactMarkdown>
      ) : (
        <span className="text-[#d1d5db]">{msg.content}</span>
      )}
    </div>
  </div>
))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}



// ============================================
// CHAT INPUT BAR
// ============================================
function ChatInputBar({ onSend, placeholder = "Ask Gitzy about this repository…" }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input.trim());
      setInput("");
    }
  };

  return (
    <div className="px-6 py-4 border-t border-[#27272a]/30 bg-[#0b0b0f]/40 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="relative flex items-center gap-2 bg-[#18181b] border border-[#27272a] rounded-2xl px-4 py-3 focus-within:border-[#22c55e]/50 focus-within:shadow-lg focus-within:shadow-[#22c55e]/5 transition-all duration-200">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-transparent border-none outline-none text-sm text-[#e5e7eb] placeholder:text-[#6b7280]"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-8 h-8 rounded-lg bg-[#22c55e] hover:bg-[#16a34a] disabled:bg-[#27272a] disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            <Send size={16} className="text-[#0b0b0f]" />
          </button>
        </div>
      </form>
    </div>
  );
}

// ============================================
// REPO CHAT VIEW (Full Screen)
// ============================================
function RepoChatView({ messages }) {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto px-6 py-6"
    >
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-3">
            <MessageSquare size={48} className="mx-auto text-[#22c55e]/40" />
            <h3 className="text-lg font-semibold text-[#e5e7eb]">Repository Chat</h3>
            <p className="text-sm text-[#9ca3af] max-w-md">
              Ask questions about the entire repository structure, architecture, or general overview.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : ""}`}
            >
              <div
                className={`max-w-2xl px-4 py-3 rounded-2xl text-sm ${
                  msg.role === "user"
                    ? "bg-[#27272a]/40 text-[#d1d5db]"
                    : "bg-[#22c55e]/10 border border-[#22c55e]/20"
                }`}
              >
                {msg.role === "assistant" ? (
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
                      p: ({ children }) => (
                        <p className="mb-3 leading-relaxed text-[#d1d5db]">
                          {children}
                        </p>
                      ),
                      ul: ({ children }) => (
                        <ul className="mb-3 space-y-1">
                          {children}
                        </ul>
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
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
}

// ============================================
// MAIN WORKSPACE VIEW
// ============================================
function WorkspaceView({ repoUrl }) {
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileChats, setFileChats] = useState({});
  const [fileContent, setFileContent] = useState("");
  const [loadingContent, setLoadingContent] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [isRepoChat, setIsRepoChat] = useState(false); // NEW STATE

  const messages = isRepoChat
    ? fileChats.__general__ || []
    : selectedFile
    ? fileChats[selectedFile.path] || []
    : fileChats.__general__ || [];

  // Parse the GitHub URL
  const parsedRepo = parseGitHubUrl(repoUrl);

  // Fetch root tree on mount
  useEffect(() => {
    async function fetchTree() {
      if (!parsedRepo) {
        console.error("Invalid repo URL");
        setLoading(false);
        return;
      }

      const { owner, repo } = parsedRepo;

      try {
        console.log("Fetching repo:", owner, repo);

        const res = await fetch(
          `http://localhost:5000/api/repo/${owner}/${repo}`
        );

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        console.log("API Response:", data);

        setTree(data.data || []);
      } catch (err) {
        console.error("Failed to load repo:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTree();
  }, [repoUrl]);

  // Toggle folder expansion
  const handleFolderToggle = async (folder) => {
    const newExpanded = new Set(expandedFolders);

    if (newExpanded.has(folder.path)) {
      // Collapse
      newExpanded.delete(folder.path);
    } else {
      // Expand
      newExpanded.add(folder.path);

      // Fetch children if not already loaded
      if (!folder.children || folder.children.length === 0) {
        await fetchFolderContents(folder);
      }
    }

    setExpandedFolders(newExpanded);
  };

  // Fetch folder contents
  const fetchFolderContents = async (folder) => {
    if (!parsedRepo) return;

    const { owner, repo } = parsedRepo;

    try {
      console.log("Fetching folder:", folder.path);

      const res = await fetch(
        `http://localhost:5000/api/repo/${owner}/${repo}/contents/${folder.path}`
      );

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      console.log("Folder contents:", data);

      // Update tree with children
      setTree((prevTree) => {
        const updateTreeWithChildren = (items) => {
          return items.map((item) => {
            if (item.path === folder.path) {
              return { ...item, children: data.data || [] };
            }
            if (item.children) {
              return {
                ...item,
                children: updateTreeWithChildren(item.children),
              };
            }
            return item;
          });
        };

        return updateTreeWithChildren(prevTree);
      });
    } catch (err) {
      console.error("Failed to load folder:", err);
    }
  };

  // Select file and fetch content
  const handleFileSelect = async (file) => {
    if (!parsedRepo) return;

    // Exit repo chat mode when selecting a file
    setIsRepoChat(false);
    setSelectedFile(file);
    setFileContent("");
    setLoadingContent(true);

    const { owner, repo } = parsedRepo;

    try {
      // 1️⃣ Fetch file content
      const res = await fetch(
        `http://localhost:5000/api/repo/${owner}/${repo}/file?path=${encodeURIComponent(
          file.path
        )}`
      );

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      setFileContent(data.code || "// No content available");

      // 2️⃣ Auto-analyze file with AI
      console.log("🤖 Analyzing file:", file.path);
      const analyzeRes = await fetch(
        `http://localhost:5000/api/ai/${owner}/${repo}/analyze-file`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: file.path }),
        }
      );

      if (!analyzeRes.ok) {
        throw new Error(`AI analysis failed: ${analyzeRes.status}`);
      }

      const aiData = await analyzeRes.json();
      console.log("✅ AI Analysis:", aiData);

      // Initialize chat if first visit
      setFileChats((prev) => {
        if (prev[file.path]) return prev;

        return {
          ...prev,
          [file.path]: [
            {
              role: "assistant",
              content: "✅ I've analyzed this file. Ask me anything about it!",
            },
          ],
        };
      });
    } catch (err) {
      console.error("❌ Failed to load file:", err);
      setFileContent(`// Error loading file: ${err.message}`);
      
      // Show error in chat
      setFileChats((prev) => ({
        ...prev,
        [file.path]: [
          {
            role: "assistant",
            content: `⚠️ Error: ${err.message}`,
          },
        ],
      }));
    } finally {
      setLoadingContent(false);
    }
  };

  // Handle Repo Chat button click
  const handleRepoChatClick = () => {
    setIsRepoChat(true);
    setSelectedFile(null);
  };

  const handleSendMessage = async (content) => {
    // REPO-LEVEL QUESTION
    if (!selectedFile || isRepoChat) {
      console.log("💬 Repo-level question:", content);

      // 1️⃣ Add user message
      setFileChats((prev) => ({
        ...prev,
        __general__: [...(prev.__general__ || []), { role: "user", content }],
      }));

      // 2️⃣ Add thinking message
      setFileChats((prev) => ({
        ...prev,
        __general__: [
          ...(prev.__general__ || []),
          { role: "assistant", content: "🤔 Thinking..." },
        ],
      }));

      try {
        const res = await fetch("http://localhost:5000/api/ai/repo/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: content,
            repoTree: tree,
          }),
        });

        const data = await res.json();

        setFileChats((prev) => {
          const msgs = [...(prev.__general__ || [])];
          msgs[msgs.length - 1] = {
            role: "assistant",
            content: data.answer || "No response",
          };
          return { ...prev, __general__: msgs };
        });
      } catch (err) {
        console.error(err);
        setFileChats((prev) => {
          const msgs = [...(prev.__general__ || [])];
          msgs[msgs.length - 1] = {
            role: "assistant",
            content: `⚠️ Error: ${err.message}`,
          };
          return { ...prev, __general__: msgs };
        });
      }

      return;
    }

    // FILE-LEVEL QUESTION (existing code)
    if (!selectedFile || !parsedRepo) return;

    const filePath = selectedFile.path;
    const { owner, repo } = parsedRepo;

    console.log("💬 Sending message:", content);

    // 1️⃣ Add user message
    setFileChats((prev) => ({
      ...prev,
      [filePath]: [...(prev[filePath] || []), { role: "user", content }],
    }));

    // 2️⃣ Add empty assistant message (for streaming)
    setFileChats((prev) => ({
      ...prev,
      [filePath]: [
        ...(prev[filePath] || []),
        { role: "assistant", content: "" },
      ],
    }));

    try {
      const res = await fetch(
        `http://localhost:5000/api/ai/${owner}/${repo}/ask-stream`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: filePath, question: content }),
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let accumulatedResponse = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (!line.trim()) continue;
          
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data.trim() === '[DONE]') {
              console.log("✅ Stream complete");
              return;
            }
            
            try {
              const parsed = JSON.parse(data);
              const chunk = parsed.chunk || '';
              
              console.log("📤 Token:", JSON.stringify(chunk));
              
              accumulatedResponse += chunk;
              
              setFileChats((prev) => {
                const msgs = [...(prev[filePath] || [])];
                if (msgs.length > 0) {
                  msgs[msgs.length - 1] = {
                    role: "assistant",
                    content: accumulatedResponse
                  };
                }
                return { ...prev, [filePath]: msgs };
              });
              
            } catch (parseError) {
              console.warn("⚠️ Not JSON, treating as plain text:", data);
              accumulatedResponse += data;
              
              setFileChats((prev) => {
                const msgs = [...(prev[filePath] || [])];
                if (msgs.length > 0) {
                  msgs[msgs.length - 1] = {
                    role: "assistant",
                    content: accumulatedResponse
                  };
                }
                return { ...prev, [filePath]: msgs };
              });
            }
          }
        }
      }
      
      console.log("✅ Stream finished, final length:", accumulatedResponse.length);
      
    } catch (err) {
      console.error("❌ Stream error:", err);
      
      setFileChats((prev) => {
        const msgs = [...(prev[filePath] || [])];
        if (msgs.length > 0) {
          msgs[msgs.length - 1] = {
            role: "assistant",
            content: `⚠️ Error: ${err.message}`
          };
        }
        return { ...prev, [filePath]: msgs };
      });
    }
  };

  return (
    <div className="h-screen bg-[#0b0b0f] text-[#e5e7eb] flex flex-col">
      <WorkspaceNavbar 
        repoUrl={repoUrl} 
        onRepoChatClick={handleRepoChatClick}
        isRepoChat={isRepoChat}
      />

      <div className="flex-1 flex min-h-0">
        <RepoSidebar
          tree={tree}
          loading={loading}
          selectedFile={selectedFile}
          onFileSelect={handleFileSelect}
          onFolderToggle={handleFolderToggle}
          expandedFolders={expandedFolders}
        />
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
            {isRepoChat ? (
              <RepoChatView messages={messages} />
            ) : selectedFile ? (
              <FileView
                file={selectedFile}
                messages={messages}
                fileContent={fileContent}
                loadingContent={loadingContent}
              />
            ) : (
              <div className="flex-1 min-h-0 overflow-y-auto bg-[#0b0b0f]">
                <WelcomeView onSuggestionClick={handleSendMessage} />

                {messages.length > 0 && (
                  <div className="px-6 py-6">
                    <RepoChatView messages={messages} />
                  </div>
                )}
              </div>
            )}
          </div>

          <ChatInputBar 
            onSend={handleSendMessage}
            placeholder={
              isRepoChat 
                ? "Ask about the repository..." 
                : selectedFile 
                ? `Ask about ${selectedFile.name}...`
                : "Ask Gitzy about this repository…"
            }
          />
        </div>
      </div>

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 4s ease infinite;
        }
      `}</style>
    </div>
  );
}

export default WorkspaceView;