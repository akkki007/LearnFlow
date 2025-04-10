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
// import { toast } from "@/components/ui/use-toast";

export default function SubmissionsDashboard() {
  const searchParams = useSearchParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const practicalNo = searchParams.get('practicalNo');

  const updateSubmissionStatus = async (submissionId, newStatus) => {
    try {
      const response = await fetch("/api/submissions/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          submissionId,
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmissions(submissions.map(sub => 
          sub._id === submissionId ? data : sub
        ));
        toast({
          title: "Status updated",
          description: `Submission status changed to ${newStatus}`,
        });
      } else {
        throw new Error(data.error || "Failed to update status");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        let url = '/api/submissions';
        const params = new URLSearchParams();

        if (practicalNo) params.append("practicalNo", practicalNo);
        if (statusFilter) params.append("status", statusFilter);

        if (params.toString()) url += `?${params.toString()}`;

        const response = await fetch(url);
        const data = await response.json();
        console.log("Fetched submissions:", data);
        
        setSubmissions(data.submissions);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [practicalNo, statusFilter]);

  console.log("Submissions:", submissions);
  

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = 
      submission.studentId.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.studentId.enrollmentNo?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "Issue":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <AppSidebar/>
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem>All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Issue">Issue</SelectItem>
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
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((submission) => (
                  <TableRow key={submission._id}>
                    <TableCell className="font-medium">{submission.studentId.fullname}</TableCell>
                    <TableCell>{submission.studentId.enrollmentNo}</TableCell>
                    <TableCell>Practical {submission.practicalId.practicalNo}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{submission.language}</Badge>
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
          <DropdownMenuItem onClick={() => updateSubmissionStatus(submission._id, "Pending")}>
            <Clock className="mr-2 h-4 w-4 text-yellow-500" />
            Pending
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => updateSubmissionStatus(submission._id, "Completed")}>
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            Completed
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => updateSubmissionStatus(submission._id, "Issue")}>
            <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
            Issue
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </TableCell>
                    <TableCell>{new Date(submission.createdAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => setSelectedSubmission(submission)}>
                        View Code
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {selectedSubmission && (
        <CodeEditorModal
          code={selectedSubmission.code}
          language={selectedSubmission.language}
          studentName={selectedSubmission.studentId.fullname}
          practicalNo={selectedSubmission.practicalId.practicalNo}
          onClose={() => setSelectedSubmission(null)}
        />
      )}
    </div>
  );
}