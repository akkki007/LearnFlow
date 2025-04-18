"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Play, Code, Terminal, FileCode, Moon, Sun, AlertCircle, CheckCircle2, Download, Upload } from "lucide-react";

const LANGUAGES = [
  { id: 71, name: "Python", icon: "py" },
  { id: 54, name: "C++", icon: "cpp" },
  { id: 63, name: "JavaScript", icon: "js" },
];

export default function CodeSpace() {
  const [code, setCode] = useState("# Write your code here");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [theme, setTheme] = useState("vs-dark");
  const [languageId, setLanguageId] = useState(LANGUAGES[0].id.toString()); // Default to Python
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("idle");
  const [activeTab, setActiveTab] = useState("input");

  const executeCode = async () => {
    setIsLoading(true);
    setStatus("loading");
    setActiveTab("output");

    try {
      const response = await fetch("/api/test", {
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
        toast.success("Code Executed: Your code ran successfully!");
      }
    } catch (error) {
      setStatus("error");
      setOutput(`Error: ${error instanceof Error ? error.message : "Unknown error occurred"}`);
      toast.error(`Execution Failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedLanguage = LANGUAGES.find((lang) => lang.id.toString() === languageId);

  // Function to handle downloading the code
  const handleDownloadCode = () => {
    if (!selectedLanguage) {
      toast.error("No language selected.");
      return;
    }

    // Create a Blob with the code content
    const blob = new Blob([code], { type: "text/plain" });

    // Create a temporary <a> element to trigger the download
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${selectedLanguage.icon}`; // Set the file name with the selected language's extension
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Code downloaded successfully!");
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4">
      {/* Header */}
      <div className="flex flex-col text-center space-y-2 px-2 sm:px-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">AI-Powered Code Editor</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Write, execute, and debug code seamlessly with our intelligent editor.
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-6">
        {/* Code Editor Section */}
        <div className="flex-1 space-y-6">
          <Card className="border shadow-sm">
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
                          <div className="flex items-center">
                            <span>{lang.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden rounded-md">
              <div className="border rounded-md overflow-hidden">
                <Editor
                  height="50vh"
                  defaultLanguage="python"
                  language={selectedLanguage?.icon.toLowerCase() || "python"}
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
                  className="min-h-[300px] sm:min-h-[400px]"
                />
              </div>
            </CardContent>
            <CardFooter className="pt-4 flex flex-col sm:flex-row gap-2">
              <Button onClick={executeCode} disabled={isLoading} className="w-full sm:w-auto" size="lg">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Executing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Run Code
                  </span>
                )}
              </Button>
              <Button onClick={handleDownloadCode} className="w-full sm:w-auto" size="lg" variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Submit Practical
              </Button>
              <Button onClick={handleDownloadCode} className="w-full sm:w-auto" size="lg" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Code
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Console Section */}
        <div className="w-full lg:w-full space-y-6">
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Console</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="px-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="input" className="flex items-center gap-2">
                      <Terminal className="h-4 w-4" />
                      Input
                    </TabsTrigger>
                    <TabsTrigger value="output" className="flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      Output
                      {status === "error" && <AlertCircle className="h-4 w-4 text-destructive" />}
                      {status === "success" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="input" className="p-4">
                  <Textarea
                    placeholder="Enter input here..."
                    className="min-h-[150px] sm:min-h-[200px] font-mono text-sm resize-none"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                </TabsContent>
                <TabsContent value="output" className="p-4">
                  <div
                    className={cn(
                      "min-h-[150px] sm:min-h-[200px] p-3 font-mono text-sm rounded-md border bg-muted/50",
                      status === "error" && "border-destructive text-destructive"
                    )}
                  >
                    {output || "Output will appear here after execution"}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="pt-2 text-xs text-muted-foreground">
              {status === "success" && "Code executed successfully"}
              {status === "error" && "Execution encountered errors"}
              {status === "loading" && "Executing code..."}
              {status === "idle" && "Ready to execute"}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}