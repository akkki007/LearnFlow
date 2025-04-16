"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  BookOpen,
  Percent,
  School,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Search,
  Filter,
  ChevronDown,
  Sparkles,
  Bot,
  User,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeEditorModal } from "@/components/code-editor-modal";
import { AppSidebar } from "@/components/app-sidebar";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export default function SubmissionsDashboard() {
  const searchParams = useSearchParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [aiDetectionLoading, setAiDetectionLoading] = useState(false);
  const [aiResults, setAiResults] = useState({});

  const practicalNo = searchParams.get('practicalNo');

  const getStudentInfo = (submission) => {
    return {
      fullname: submission.studentId?.fullname || 'Unknown',
      enrollmentNo: submission.studentId?.enrollmentNo || 'N/A'
    };
  };

  const getPracticalInfo = (submission) => {
    return {
      practicalNo: submission.practicalId?.practicalNo || 'N/A'
    };
  };

  const updateSubmissionStatus = async (submissionId, newStatus) => {
    try {
      const response = await fetch("/api/submissions/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId, status: newStatus }),
      });

      if (!response.ok) throw new Error("Update failed");

      setSubmissions(submissions.map(sub => 
        sub._id === submissionId ? { ...sub, status: newStatus } : sub
      ));

      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Update failed: " + error.message);
    }
  };

  const detectAI = async (submissionId) => {
    try {
      setAiDetectionLoading(true);
      const submission = submissions.find(s => s._id === submissionId);
      if (!submission) return;

      const response = await fetch("/api/ai-detection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: submission.code }),
      });

      if (!response.ok) throw new Error("AI detection failed");

      const result = await response.json();
      setAiResults(prev => ({ ...prev, [submissionId]: result }));

      // Update status if AI detected
      if (result.isAiGenerated) {
        await updateSubmissionStatus(submissionId, "AI Detected");
      }

      if (result.isAiGenerated) {
        toast.error(`AI Content Detected (${Math.round(result.probability * 100)}% probability)`, {
          description: "This submission appears to be AI-generated"
        });
      } else {
        toast.success("Human-written Content", {
          description: "This appears to be human-written"
        });
      }
    } catch (error) {
      toast.error("AI Detection Error: " + error.message);
    } finally {
      setAiDetectionLoading(false);
    }
  };

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        let url = '/api/submissions';
        const params = new URLSearchParams();

        if (practicalNo) params.append("practicalNo", practicalNo);
        if (statusFilter && statusFilter !== "all") params.append("status", statusFilter);

        if (params.toString()) url += `?${params.toString()}`;

        const response = await fetch(url);
        const data = await response.json();
        
        setSubmissions(data.submissions || []);
      } catch (error) {
        console.error("Error fetching submissions:", error);
        toast.error("Failed to load submissions");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [practicalNo, statusFilter]);

  const filteredSubmissions = submissions.filter(submission => {
    const student = getStudentInfo(submission);
    const matchesSearch = 
      student.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.enrollmentNo.toLowerCase().includes(searchTerm.toLowerCase());
      
    return matchesSearch;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "Issue":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "AI Detected":
        return <Bot className="h-4 w-4 text-purple-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Fixed sidebar */}
      <div className="hidden md:block fixed h-full w-64 border-r">
        <AppSidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 md:ml-64 p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              {practicalNo ? `Submissions for Practical ${practicalNo}` : "All Submissions"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by student name or enrollment number..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select 
                value={statusFilter} 
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Issue">Issue</SelectItem>
                  <SelectItem value="AI Detected">AI Detected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 w-full rounded-md bg-muted animate-pulse" />
                ))}
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground">
                <FileText className="h-12 w-12" />
                <p>No submissions found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Enrollment No.</TableHead>
                    <TableHead>Practical</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>AI Detection</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.map((submission) => {
                    const student = getStudentInfo(submission);
                    const practical = getPracticalInfo(submission);
                    const aiResult = aiResults[submission._id];
                    
                    return (
                      <TableRow key={submission._id}>
                        <TableCell className="font-medium">{student.fullname}</TableCell>
                        <TableCell>{student.enrollmentNo}</TableCell>
                        <TableCell>Practical {practical.practicalNo}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {submission.language}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(submission.status)}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 px-2">
                                  <Badge variant="outline" className="cursor-pointer">
                                    {submission.status}
                                    <ChevronDown className="ml-1 h-3 w-3" />
                                  </Badge>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                  onClick={() => updateSubmissionStatus(submission._id, "Pending")}
                                >
                                  <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                                  Pending
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => updateSubmissionStatus(submission._id, "Completed")}
                                >
                                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                  Completed
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => updateSubmissionStatus(submission._id, "Issue")}
                                >
                                  <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                                  Issue
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => updateSubmissionStatus(submission._id, "AI Detected")}
                                >
                                  <Bot className="mr-2 h-4 w-4 text-purple-500" />
                                  AI Detected
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                        <TableCell>
                          {aiResult ? (
                            <div className="flex items-center gap-2">
                              {aiResult.isAiGenerated ? (
                                <Bot className="h-4 w-4 text-purple-500" />
                              ) : (
                                <User className="h-4 w-4 text-green-500" />
                              )}
                              <Progress 
                                value={aiResult.probability * 100} 
                                className="w-24 h-2"
                                indicatorColor={
                                  aiResult.isAiGenerated ? "bg-purple-500" : "bg-green-500"
                                }
                              />
                              <span className="text-xs w-8">
                                {Math.round(aiResult.probability * 100)}%
                              </span>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => detectAI(submission._id)}
                              disabled={aiDetectionLoading}
                            >
                              <Sparkles className="h-4 w-4 mr-2" />
                              {aiDetectionLoading ? "Analyzing..." : "Check AI"}
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(submission.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => setSelectedSubmission(submission)}
                            >
                              View Code
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {selectedSubmission && (
          <CodeEditorModal
            code={selectedSubmission.code}
            language={selectedSubmission.language}
            studentName={getStudentInfo(selectedSubmission).fullname}
            practicalNo={getPracticalInfo(selectedSubmission).practicalNo}
            onClose={() => setSelectedSubmission(null)}
            onDetectAI={() => detectAI(selectedSubmission._id)}
            aiResult={aiResults[selectedSubmission._id]}
          />
        )}
      </div>
    </div>
  );
} 