"use client";

import { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Play, Code, Terminal, FileCode, Moon, Sun, AlertCircle, CheckCircle2, Download, Sparkles, Lightbulb, Wand2, X } from "lucide-react";
import { Badge } from "./ui/badge";

const LANGUAGES = [
  { id: 71, name: "Python", icon: "py" },
  { id: 54, name: "C++", icon: "cpp" },
  { id: 63, name: "JavaScript", icon: "js" },
];

export default function CodeEditor() {
  const [code, setCode] = useState("# Write your code here");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [theme, setTheme] = useState("vs-dark");
  const [languageId, setLanguageId] = useState(LANGUAGES[0].id.toString());
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("idle");
  const [activeTab, setActiveTab] = useState("input");
  const [aiCompletionEnabled, setAiCompletionEnabled] = useState(true);
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [lastCompletionTime, setLastCompletionTime] = useState(0);
  const [isAiThinking, setIsAiThinking] = useState(false);
  
  const editorRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    editor.updateOptions({
      scrollBeyondLastLine: false,
      minimap: { enabled: false },
      fontSize: 14,
      wordWrap: 'on',
      automaticLayout: true,
      quickSuggestions: false
    });
  };

  // Add this function somewhere in your component file
function stripAnsiCodes(str) {
  return str.replace(
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    ''
  );
}

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showSuggestion) {
        rejectSuggestion();
      } else if (e.key === 'Tab' && showSuggestion) {
        e.preventDefault();
        acceptSuggestion();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSuggestion, aiSuggestion]);

  const fetchAiCompletion = async () => {
    if (!aiCompletionEnabled || !code.trim() || code.trim().length < 5) return;
    
    const now = Date.now();
    const timeSinceLastCompletion = now - lastCompletionTime;
    const minDelay = 30000; // 30 seconds
    
    if (timeSinceLastCompletion < minDelay) {
      return;
    }

    setIsAiThinking(true);
    try {
      const response = await fetch('/api/index', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          code, 
          language: LANGUAGES.find(lang => lang.id.toString() === languageId)?.name || "Python"
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }
      
      const { suggestion } = await response.json();
      if (suggestion) {
        setAiSuggestion(suggestion);
        setShowSuggestion(true);
        setLastCompletionTime(Date.now());
      }
    } catch (error) {
      console.error("AI Completion Error:", error);
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleCodeChange = (value) => {
    setCode(value || "");
    
    if (showSuggestion) {
      setShowSuggestion(false);
      setAiSuggestion("");
    }
    
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(fetchAiCompletion, 1000);
  };

  const acceptSuggestion = () => {
    if (!aiSuggestion || !editorRef.current) return;
    
    const editor = editorRef.current;
    const position = editor.getPosition();
    const range = {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: position.column,
      endColumn: position.column
    };
    
    editor.executeEdits('ai-completion', [{
      range,
      text: aiSuggestion,
      forceMoveMarkers: true
    }]);
    
    const newPosition = {
      lineNumber: position.lineNumber,
      column: position.column + aiSuggestion.length
    };
    editor.setPosition(newPosition);
    editor.focus();
    
    setShowSuggestion(false);
    setAiSuggestion("");
  };

  const rejectSuggestion = () => {
    setShowSuggestion(false);
    setAiSuggestion("");
  };

  const executeCode = async () => {
    setIsLoading(true);
    setStatus("loading");
    setActiveTab("output");

    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, input, languageId: Number.parseInt(languageId) }),
      });

      const data = await response.json();

      if (data.error) {
        setStatus("error");
        setOutput(data.error);
        toast.error(`Execution Error: ${data.error}`);
      } else {
        setStatus("success");
        setOutput(data.output);
        toast.success("Code Executed Successfully!");
      }
    } catch (error) {
      setStatus("error");
      setOutput(`Error: ${error instanceof Error ? error.message : "Unknown error occurred"}`);
      toast.error(`Execution Failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const explainCode = async () => {
    if (!code.trim()) {
      toast.error("Please write some code first");
      return;
    }

    setIsExplaining(true);
    try {
      const response = await fetch('/api/ai/explain', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          code,
          language: LANGUAGES.find(lang => lang.id.toString() === languageId)?.name || "Python"
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }
      
      const { explanation } = await response.json();
      setExplanation(explanation);
      setActiveTab("explanation");
      toast.success("Explanation Generated!");
    } catch (error) {
      toast.error(`Explanation Failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsExplaining(false);
    }
  };

  const handleDownloadCode = () => {
    const selectedLanguage = LANGUAGES.find((lang) => lang.id.toString() === languageId);
    if (!selectedLanguage) {
      toast.error("No language selected.");
      return;
    }

    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${selectedLanguage.icon}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Code Downloaded!");
  };

  const selectedLanguage = LANGUAGES.find((lang) => lang.id.toString() === languageId);

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">AI Code Companion</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Write, execute, and understand code with AI assistance
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-2">
                  <FileCode className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Editor</CardTitle>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center space-x-2">
                    <Sun className="h-4 w-4 text-muted-foreground" />
                    <Switch
                      checked={theme === "vs-dark"}
                      onCheckedChange={() => setTheme(theme === "vs-dark" ? "vs-light" : "vs-dark")}
                    />
                    <Moon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-4 w-4 text-muted-foreground" />
                    <Switch
                      checked={aiCompletionEnabled}
                      onCheckedChange={() => {
                        setAiCompletionEnabled(!aiCompletionEnabled);
                        if (showSuggestion) rejectSuggestion();
                      }}
                    />
                    <span className="text-sm hidden sm:inline">AI Assist</span>
                  </div>
                  <Select value={languageId} onValueChange={setLanguageId}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.id} value={lang.id.toString()}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden rounded-md">
              <div className="border rounded-md overflow-hidden relative">
                <Editor
                  height="60vh"
                  defaultLanguage="python"
                  language={selectedLanguage?.icon.toLowerCase() || "python"}
                  value={code}
                  theme={theme}
                  onChange={handleCodeChange}
                  onMount={handleEditorDidMount}
                  options={{
                    fontSize: 14,
                    fontFamily: "JetBrains Mono, Menlo, Monaco, Consolas, monospace",
                    minimap: { enabled: false },
                    lineNumbers: "on",
                    glyphMargin: false,
                    lineDecorationsWidth: 10,
                    lineNumbersMinChars: 3,
                    padding: { top: 16, bottom: 16 },
                  }}
                  className="min-h-[400px]"
                />
                
                {showSuggestion && aiSuggestion && (
                  <div className="absolute bottom-0 left-0 right-0 bg-blue-50 border-t border-blue-200 p-3">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">
                          AI Suggestion
                        </span>
                        {isAiThinking && (
                          <span className="text-xs text-blue-600">Thinking...</span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          onClick={acceptSuggestion} 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700 text-white h-8 px-3"
                        >
                          Accept (Tab)
                        </Button>
                        <Button 
                          onClick={rejectSuggestion} 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 px-3 text-blue-600 hover:bg-blue-100"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <pre className="font-mono text-sm bg-white p-2 rounded border border-blue-100 overflow-x-auto text-blue-900">
                      {aiSuggestion}
                    </pre>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-4 flex flex-col sm:flex-row gap-2">
              <Button 
                onClick={executeCode} 
                disabled={isLoading} 
                className="w-full sm:w-auto" 
                size="lg"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    </svg>
                    Running...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Run Code
                  </span>
                )}
              </Button>
              <Button 
                onClick={explainCode} 
                disabled={isExplaining} 
                className="w-full sm:w-auto" 
                size="lg" 
                variant="outline"
              >
                {isExplaining ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    </svg>
                    Explaining...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Explain
                  </span>
                )}
              </Button>
              <Button 
                onClick={handleDownloadCode} 
                className="w-full sm:w-auto" 
                size="lg" 
                variant="outline"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="w-full lg:w-[400px] space-y-6">
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Console</CardTitle>
                <Badge variant="outline" className="capitalize">
                  {status === "idle" && "Ready"}
                  {status === "loading" && "Running"}
                  {status === "success" && "Success"}
                  {status === "error" && "Error"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="px-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="input">
                      <Terminal className="h-4 w-4 mr-2" />
                      Input
                    </TabsTrigger>
                    <TabsTrigger value="output">
                      <Code className="h-4 w-4 mr-2" />
                      Output
                    </TabsTrigger>
                    <TabsTrigger value="explanation">
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Explain
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="input" className="p-4">
                  <Textarea
                    placeholder="Enter input here..."
                    className="min-h-[200px] font-mono text-sm resize-none"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                </TabsContent>
                <TabsContent value="output" className="p-4">
  <div
    className={cn(
      "min-h-[200px] p-3 font-mono text-sm rounded-md border bg-muted/50",
      status === "error" && "border-destructive/50 text-destructive"
    )}
  >
    {status === "loading" ? (
      <div className="flex items-center justify-center h-full">
        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        </svg>
        Running code...
      </div>
    ) : output ? (
      stripAnsiCodes(output)
    ) : (
      "Output will appear here after execution"
    )}
  </div>
</TabsContent>
                <TabsContent value="explanation" className="p-4">
                  <div className="min-h-[200px] p-3 text-sm rounded-md border bg-muted/50">
                    {isExplaining ? (
                      <div className="flex items-center justify-center h-full">
                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        </svg>
                        Generating explanation...
                      </div>
                    ) : explanation ? (
                      explanation
                    ) : (
                      "Code explanation will appear here"
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}