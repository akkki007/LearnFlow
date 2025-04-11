'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import Editor from '@monaco-editor/react'
import { Toaster, toast } from 'sonner'
import { Sparkles, Code, Settings, Loader2, Zap, ZapOff } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

export default function CodeEditor() {
  const searchParams = useSearchParams()
  const workspaceId = searchParams.get('monospaceUid') || 'local'
  const editorRef = useRef(null)
  const timeoutRef = useRef(null)
  const abortControllerRef = useRef(null)
  const suggestionRef = useRef(null)
  
  const [code, setCode] = useState(`// Workspace: ${workspaceId}\n// Start typing...`)
  const [language, setLanguage] = useState('javascript')
  const [isLoading, setIsLoading] = useState(false)
  const [key, setKey] = useState(0)
  const [modelInfo, setModelInfo] = useState('llama3-8b-8192')
  const [showSuggestion, setShowSuggestion] = useState(false)
  const [aiEnabled, setAiEnabled] = useState(true) // Toggle state for AI completion

  // Handle ResizeObserver errors
  useEffect(() => {
    const handleError = (e) => {
      if (e.message.includes('ResizeObserver')) {
        e.stopImmediatePropagation()
      }
    }
    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor
    
    // Configure editor
    editor.updateOptions({
      scrollBeyondLastLine: false,
      minimap: { enabled: false },
      fontSize: 14,
      wordWrap: 'on',
      automaticLayout: true,
      quickSuggestions: false
    })

    // Add Tab key listener for accepting suggestions
    editor.addCommand(monaco.KeyCode.Tab, () => {
      if (showSuggestion && suggestionRef.current) {
        insertSuggestion(suggestionRef.current)
        setShowSuggestion(false)
        suggestionRef.current = null
      } else {
        editor.trigger('keyboard', 'tab', { text: '\t' })
      }
    })
  }

  const fetchCompletion = useCallback(async () => {
    if (!aiEnabled || !editorRef.current || !code.trim() || code.trim().length < 5) return
    
    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    
    abortControllerRef.current = new AbortController()
    setIsLoading(true)
    setShowSuggestion(false)
    
    try {
      const response = await fetch('/api/index', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, workspaceId }),
        signal: abortControllerRef.current.signal
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }
      
      const { suggestion, model, latency } = await response.json()
      if (model) setModelInfo(model)
      
      // Store the suggestion and show preview
      suggestionRef.current = suggestion
      setShowSuggestion(true)
      
      toast.info('Suggestion available', {
        description: 'Press Tab to accept • Esc to dismiss',
        duration: 3000,
        action: {
          label: 'Accept',
          onClick: () => {
            insertSuggestion(suggestion)
            setShowSuggestion(false)
          }
        }
      })
    } catch (error) {
      if (error.name !== 'AbortError') {
        toast.error('AI Suggestion Failed', {
          description: error.message.includes('model_decommissioned') 
            ? 'Please update your model configuration' 
            : error.message
        })
      }
    } finally {
      setIsLoading(false)
    }
  }, [code, workspaceId, modelInfo, aiEnabled])

  const insertSuggestion = (text) => {
    const editor = editorRef.current
    if (!editor || !text) return
    
    const position = editor.getPosition()
    const range = {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: position.column,
      endColumn: position.column
    }
    
    editor.pushUndoStop()
    editor.executeEdits('ai-completion', [{
      range,
      text: text + '\n',
      forceMoveMarkers: true
    }])
    editor.pushUndoStop()
    
    // Move cursor to end of inserted text
    const newPosition = {
      lineNumber: position.lineNumber,
      column: position.column + text.length + 1
    }
    editor.setPosition(newPosition)
    editor.focus()
  }

  const handleChange = (value) => {
    setCode(value)
    if (!aiEnabled) return
    
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      const cursorPosition = editorRef.current?.getPosition()
      const lineContent = editorRef.current?.getModel().getLineContent(cursorPosition.lineNumber)
      
      // Only trigger completion if we're at the end of a line
      if (cursorPosition.column >= lineContent.length) {
        fetchCompletion()
      } else {
        // Hide suggestion if user moves cursor away
        setShowSuggestion(false)
        suggestionRef.current = null
      }
    }, 1500)
  }

  const handleLanguageChange = (lang) => {
    setLanguage(lang)
    setKey(prev => prev + 1)
    toast.info(`Language changed to ${lang.toUpperCase()}`)
  }

  const handleManualTrigger = () => {
    if (!aiEnabled) {
      toast.warning('Enable AI suggestions first');
      return;
    }
    clearTimeout(timeoutRef.current)
    fetchCompletion()
  }

  const toggleAiCompletion = () => {
    const newState = !aiEnabled;
    setAiEnabled(newState);
    toast.success(`AI suggestions ${newState ? 'enabled' : 'disabled'}`);
    
    // Clear any pending suggestions when disabling
    if (!newState) {
      setShowSuggestion(false);
      suggestionRef.current = null;
      clearTimeout(timeoutRef.current);
    }
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showSuggestion) {
        setShowSuggestion(false)
        suggestionRef.current = null
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showSuggestion])

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current)
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return (
    <div className="flex flex-col h-screen bg-[#1e1e1e] text-gray-100">
      <header className="flex items-center justify-between p-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5 text-blue-400" />
          <h1 className="font-mono font-bold">Groq Code Companion</h1>
          <span className="text-xs bg-gray-800 px-2 py-1 rounded">
            {workspaceId} • {modelInfo}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-gray-800 text-sm rounded px-3 py-1 focus:outline-none"
          >
            {['javascript', 'typescript', 'python', 'java', 'go', 'rust', 'html', 'css'].map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>

          {/* AI Toggle Button */}
          <button
            onClick={toggleAiCompletion}
            className={`flex items-center gap-1 px-3 py-1 text-sm rounded transition-colors ${
              aiEnabled 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            aria-label={aiEnabled ? 'Disable AI suggestions' : 'Enable AI suggestions'}
          >
            {aiEnabled ? (
              <Zap className="h-4 w-4" />
            ) : (
              <ZapOff className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">AI</span>
          </button>
          
          <button 
            onClick={handleManualTrigger}
            disabled={isLoading || !aiEnabled}
            className={`flex items-center gap-1 px-3 py-1 text-sm rounded transition-colors ${
              aiEnabled 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-700'
            } disabled:opacity-50`}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Suggest</span>
          </button>
        </div>
      </header>

      <div className="flex-1 relative">
        <Editor
          key={key}
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={handleChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            automaticLayout: true,
            quickSuggestions: false,
            suggestOnTriggerCharacters: false,
            tabCompletion: false
          }}
        />
        
        {isLoading && (
          <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-full text-sm">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>AI Thinking...</span>
          </div>
        )}

        {showSuggestion && suggestionRef.current && (
          <div className="absolute bottom-4 left-4 right-4 bg-gray-800 border border-gray-700 rounded p-2 text-sm">
            <div className="flex justify-between items-center mb-1">
              <span className="text-blue-400">AI Suggestion (Press Tab to accept)</span>
              <button 
                onClick={() => {
                  setShowSuggestion(false)
                  suggestionRef.current = null
                }}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <pre className="font-mono text-gray-300 overflow-x-auto">
              {suggestionRef.current}
            </pre>
          </div>
        )}
      </div>

      <Toaster 
        position="bottom-right"
        theme="dark"
        richColors
        closeButton
        duration={3000}
      />
    </div>
  )
}