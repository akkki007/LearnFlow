"use client";

import { useState, useEffect } from "react";
import { Plus, Trash, Edit, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

export default function AddPr() {
  const [practicals, setPracticals] = useState([]);
  const [formData, setFormData] = useState({
    subject: "",
    practicalNo: "",
    title: "",
    description: "",
    relatedTheory: "",
    difficulty: "Easy",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.id);
      fetchPracticals(decodedToken.id);
    }
  }, []);

  const fetchPracticals = async (teacherId) => {
    setIsFetching(true);
    try {
      const response = await fetch(`/api/practicals?tid=${teacherId}`);
      if (!response.ok) throw new Error("Failed to fetch practicals");
      const { data } = await response.json();
      setPracticals(data || []);
    } catch (error) {
      toast.error(error.message || "Failed to fetch practicals");
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/practicals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tid: userId,
          ...formData,
          practicalNo: Number(formData.practicalNo),
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to create practical");

      setPracticals([...practicals, result.data]);
      setFormData({
        subject: "",
        practicalNo: "",
        title: "",
        description: "",
        relatedTheory: "",
        difficulty: "Easy",
      });
      toast.success("Practical created successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to create practical");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDifficultyChange = (value) => {
    setFormData({ ...formData, difficulty: value });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Practicals</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border rounded-lg w-[40vw] shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Create New Practical</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Enter subject"
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Practical Number</Label>
                <Input
                  name="practicalNo"
                  value={formData.practicalNo}
                  onChange={handleChange}
                  placeholder="Enter practical number"
                  type="number"
                  min="1"
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter practical title"
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter practical description"
                  className="w-full min-h-[100px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Related Theory</Label>
                <Textarea
                  name="relatedTheory"
                  value={formData.relatedTheory}
                  onChange={handleChange}
                  placeholder="Enter related theory"
                  className="w-full min-h-[100px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Select 
                  value={formData.difficulty} 
                  onValueChange={handleDifficultyChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full mt-4" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Practical
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Created Practicals Card */}
        <Card className="border rounded-lg w-[30vw] mx-[30vw] shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Created Practicals</CardTitle>
          </CardHeader>
          <CardContent>
            {isFetching ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : practicals.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                <FileText className="h-8 w-8 mb-2" />
                <p>No practicals created yet</p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="w-[100px]">No.</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {practicals.map((pr) => (
                      <TableRow key={pr._id}>
                        <TableCell className="font-medium">{pr.practicalNo}</TableCell>
                        <TableCell className="truncate max-w-[150px]">{pr.title}</TableCell>
                        <TableCell>{pr.subject}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-500">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}