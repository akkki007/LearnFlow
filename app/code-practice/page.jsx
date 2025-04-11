"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Editor from "@monaco-editor/react";
import { 
  ArrowLeft, Code2, Play, RotateCcw, Plus,
  Terminal, FileCode, Moon, Sun, AlertCircle, CheckCircle2, Download, Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle, CardFooter 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import Confetti from "react-confetti";
import { useWindowSize } from "@uidotdev/usehooks";

const LANGUAGES = [
  { id: 71, name: "Python", icon: "py" },
  { id: 54, name: "C++", icon: "cpp" },
  { id: 63, name: "JavaScript", icon: "js" },
];

export default function CodePractice() {
  // Practicals state
  const [practicals, setPracticals] = useState([]);
  const [selectedPracticalNo, setSelectedPracticalNo] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPractical, setSelectedPractical] = useState(null);

  // Code editor state
  const [code, setCode] = useState("# Write your code here");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [theme, setTheme] = useState("vs-dark");
  const [languageId, setLanguageId] = useState(LANGUAGES[0].id.toString());
  const [isExecuting, setIsExecuting] = useState(false);
  const [status, setStatus] = useState("idle");
  const [activeConsoleTab, setActiveConsoleTab] = useState("input");
  const [userId, setUserId] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();
  // Fetch practicals
  useEffect(() => {
    const fetchPracticals = async () => {
      try {
        const response = await fetch("/api/pr");
        const data = await response.json();
        setPracticals(data);
        if (data.length > 0) {
          setSelectedPracticalNo(data[0].practicalNo);
        }
        if(response.status === 404){
          toast.error("No practicals found");
        }
      } catch (error) {
        console.error("Failed to fetch practicals:", error);
        toast.error("Failed to load practicals");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPracticals();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token")
    const user = jwtDecode(token);
    
    setUserId(user.id);
  }, []);

  // Set selected practical
  useEffect(() => {
    if (practicals.length > 0) {
      const selected = practicals.find((pr) => pr.practicalNo === selectedPracticalNo);
      setSelectedPractical(selected || null);
    }
  }, [selectedPracticalNo, practicals]);

  const executeCode = async () => {
    setIsExecuting(true);
    setStatus("loading");
    setActiveConsoleTab("output");

    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          code, 
          input, 
          languageId: Number.parseInt(languageId) 
        }),
      });

      const data = await response.json();

      if (data.error) {
        setStatus("error");
        setOutput(data.error);
        toast.error(`Execution Error: ${data.error}`);
      } else {
        setStatus("success");
        setOutput(data.output);
        toast.success("Code executed successfully!");
      }
    } catch (error) {
      setStatus("error");
      setOutput(`Error: ${error instanceof Error ? error.message : "Unknown error occurred"}`);
      toast.error("Execution failed");
    } finally {
      setIsExecuting(false);
    }
  };

  const handleDownloadCode = () => {
    const selectedLanguage = LANGUAGES.find(lang => lang.id.toString() === languageId);
    if (!selectedLanguage) {
      toast.error("No language selected");
      return;
    }

    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `practical_${selectedPracticalNo}.${selectedLanguage.icon}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Code downloaded!");
  };

  const resetCode = () => {
    setOutput("");
    setStatus("idle");
  };

  const submitPractical = async () => {
    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        body: JSON.stringify({
          code,
          practicalNo: selectedPracticalNo,
          language: LANGUAGES.find(l => l.id.toString() === languageId)?.name || "Unknown",
          userId
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (response.ok) {
        // Show success animation
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
        
        toast.success("Practical submitted successfully!", {
          icon: '🎉',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
            fontSize: '1.1rem',
            padding: '16px',
          },
        });
      } else {
        const error = await response.json();
        toast.error(error.message || "Submission failed");
      }
    } catch (error) {
      toast.error("Failed to submit practical");
      console.error("Submission error:", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {showConfetti && (
      <Confetti
        width={width}
        height={height}
        recycle={false}
        numberOfPieces={500}
        gravity={0.2}
        colors={['#FFD700', '#FF69B4', '#7FFFD4', '#9370DB', '#00FF7F']}
      />
    )}

      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/student">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to Dashboard</span>
          </Link>
        </Button>
        <div className="flex items-center gap-2 font-semibold">
          <Code2 className="h-5 w-5" />
          <span className="text-sm sm:text-base">Code Practice</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Select
            value={selectedPracticalNo.toString()}
            onValueChange={(value) => setSelectedPracticalNo(Number(value))}
          >
            <SelectTrigger className="w-[180px] sm:w-[280px]">
              <SelectValue placeholder="Select Practical" />
            </SelectTrigger>
            <SelectContent>
              {practicals.length > 0 ? (
                practicals.map((pr) => (
                  <SelectItem key={pr._id} value={pr.practicalNo.toString()}>
                    PR {pr.practicalNo}: {pr.title}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>No practicals available</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </header>

      {/* Main Content */}
      <div className="grid flex-1 grid-cols-1 md:grid-cols-2">
        {/* Left Side: Problem Description */}
        <div className="border-r">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col gap-4">
              {isLoading ? (
                <p>Loading practicals...</p>
              ) : selectedPractical ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h2 className="text-xl sm:text-2xl font-bold">{selectedPractical.title}</h2>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                        {selectedPractical.difficulty || "Easy"}
                      </span>
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                        {selectedPractical.subject}
                      </span>
                    </div>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Problem Description</CardTitle>
                      <CardDescription>{selectedPractical.tags?.join(", ") || "No tags"}</CardDescription>
                    </CardHeader>
                    <CardContent className="prose max-w-none">
                      <p>{selectedPractical.description}</p>
                      <h3>Related Theory:</h3>
                      <p>{selectedPractical.relatedTheory}</p>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <p>No practical selected.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Code Editor and Output */}
        <div className="flex flex-col">
          <div className="flex-1">
            <Card className="border shadow-sm h-full flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div className="flex items-center space-x-2">
                    <FileCode className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">Code Editor</CardTitle>
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
              <CardContent className="p-0 overflow-hidden rounded-md flex-1">
                <div className="border rounded-md overflow-hidden h-full">
                  <Editor
                    height="70vh"
                    defaultLanguage="python"
                    language={LANGUAGES.find(l => l.id.toString() === languageId)?.icon.toLowerCase() || "python"}
                    value={code}
                    theme={theme}
                    onChange={(value) => setCode(value || "")}
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
                  />
                </div>
              </CardContent>
              <CardFooter className="pt-4 flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={executeCode} 
                  disabled={isExecuting} 
                  className="w-full sm:w-auto" 
                  size="lg"
                >
                  {isExecuting ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">↻</span>
                      Executing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Play className="h-4 w-4" />
                      Run Code
                    </span>
                  )}
                </Button>
                <Button 
                  onClick={submitPractical} 
                  className="w-full sm:w-auto" 
                  size="lg" 
                  variant="outline"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Submit Practical
                </Button>
                <Button 
                  onClick={handleDownloadCode} 
                  className="w-full sm:w-auto" 
                  size="lg" 
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Code
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Console Section */}
          <div className="border-t">
            <Card className="border-0 shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Console</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs value={activeConsoleTab} onValueChange={setActiveConsoleTab}>
                  <div className="px-4">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="input" className="flex items-center gap-2">
                        <Terminal className="h-4 w-4" />
                        Input
                      </TabsTrigger>
                      <TabsTrigger value="output" className="flex items-center gap-2">
                        <Code2 className="h-4 w-4" />
                        Output
                        {status === "error" && <AlertCircle className="h-4 w-4 text-destructive" />}
                        {status === "success" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value="input" className="p-4">
                    <Textarea
                      placeholder="Enter input here..."
                      className="min-h-[100px] font-mono text-sm resize-none"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    />
                  </TabsContent>
                  <TabsContent value="output" className="p-4">
                    <div className={cn(
                      "min-h-[100px] p-3 font-mono text-sm rounded-md border bg-muted/50",
                      status === "error" && "border-destructive text-destructive"
                    )}>
                      {output || "Output will appear here after execution"}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}