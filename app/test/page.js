"use client";
import { useState } from 'react';
import { useTheme } from 'next-themes';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [stdin, setStdin] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('input');
  const { theme } = useTheme();

  const languageIdMap = {
    python: 71, // Python
    javascript: 63, // JavaScript
    cpp: 54, // C++
  };

  const languageExamples = {
    python: 'print("Hello, World!")\n\n# Read input\ninput_value = input()\nprint(f"You entered: {input_value}")',
    javascript: 'console.log("Hello, World!");\n\n// Read input\nconst readline = require("readline");\nconst rl = readline.createInterface({\n  input: process.stdin,\n  output: process.stdout\n});\n\nrl.question("", (answer) => {\n  console.log(`You entered: ${answer}`);\n  rl.close();\n});',
    cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello, World!" << endl;\n  \n  // Read input\n  string input;\n  getline(cin, input);\n  cout << "You entered: " << input << endl;\n  \n  return 0;\n}'
  };

  const handleSetLanguage = (value) => {
    setLanguage(value);
    if (code === '' || Object.values(languageExamples).includes(code)) {
      setCode(languageExamples[value]);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setResult(null);
      const languageId = languageIdMap[language];
      const response = await fetch('/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, input: stdin, languageId }),
      });
      const data = await response.json();
      
      setResult(data);
      setActiveTab('output');
    } catch (error) {
      setResult({ error: "Failed to execute code. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card className="mb-8 border-none shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold">Code Runner</CardTitle>
          <CardDescription>
            Execute code in isolated Docker containers with various programming languages
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Code Editor</CardTitle>
              <Select value={language} onValueChange={handleSetLanguage}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter your code here..."
              className="font-mono h-64 resize-none"
              spellCheck="false"
            />
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <div>
              <Badge variant="outline" className="mr-2">
                {language === 'python' ? 'Python 3.9' : language === 'javascript' ? 'Node.js 16' : 'GCC latest'}
              </Badge>
            </div>
            <Button onClick={handleSubmit} disabled={isLoading || !code}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running...
                </>
              ) : (
                "Run Code"
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Input / Output</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="input">Input</TabsTrigger>
                <TabsTrigger value="output">Output</TabsTrigger>
              </TabsList>
              <TabsContent value="input" className="pt-4">
                <Textarea
                  value={stdin}
                  onChange={(e) => setStdin(e.target.value)}
                  placeholder="Enter input for your program here..."
                  className="font-mono h-32 resize-none"
                />
              </TabsContent>
              <TabsContent value="output" className="pt-4">
                {result ? (
                  result.error ? (
                    <Alert variant="destructive">
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>
                        <pre className="whitespace-pre-wrap font-mono text-sm">
                          {result.error}
                        </pre>
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="bg-muted p-4 rounded-md overflow-auto max-h-64">
                      <pre className="whitespace-pre-wrap font-mono text-sm">
                        {result.output || "No output"}
                      </pre>
                      {result.exitCode !== undefined && (
                        <div className="mt-2 text-sm">
                          Exit code: {result.exitCode === 0 ? (
                            <span className="text-green-500">0 (Success)</span>
                          ) : (
                            <span className="text-red-500">{result.exitCode} (Error)</span>
                          )}
                        </div>
                      )}
                    </div>
                  )
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Run your code to see output here
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}