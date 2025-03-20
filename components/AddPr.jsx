"use client";

import { useState, useEffect } from "react";
import { Plus, Trash, Edit, Loader2 } from "lucide-react"; // Added Loader2 for loading animation
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import toast from "react-hot-toast"; // Import toast for notifications
import {jwtDecode} from "jwt-decode";

export default function AddPr() {
  const [practicals, setPracticals] = useState([]); // To store created practicals
  const [formData, setFormData] = useState({
    subject: "",
    practicalNo: "",
    title: "",
    description: "",
    relatedTheory: "",
    difficulty: "Easy",
    tags: "",
    examples: "",
    constraints: "",
  });
  const [isLoading, setIsLoading] = useState(false); // Loading state for form submission
  const [userId, setUserId] = useState(null);
  // Fetch practicals on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.id);
    }
    fetchPracticals();
  }, []);

  // Fetch all practicals from the backend
  const fetchPracticals = async (userId) => {
    try {
      const response = await fetch(`/api/practicals?tid=${userId}`);
      const data = await response.json();
      setPracticals(data);
    } catch (error) {
      console.error("Error fetching practicals:", error);
      toast.error("Failed to fetch practicals"); // Show error toast
    }
  };

  // Handle form submission to create a new practical
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading animation

    try {
      const response = await fetch("/api/practicals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tid: userId,
          subject: formData.subject,
          practicalNo: Number(formData.practicalNo), // Convert to number
          title: formData.title,
          description: formData.description,
          relatedTheory: formData.relatedTheory,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create practical");
      }

      const newPractical = await response.json();
      setPracticals([...practicals, newPractical]); // Update the list of practicals
      setFormData({
        subject: "",
        practicalNo: "",
        title: "",
        description: "",
        relatedTheory: "",
        difficulty: "Easy",
        tags: "",
        examples: "",
        constraints: "",
      }); // Reset form
      toast.success("Practical created successfully!"); // Show success toast
    } catch (error) {
      console.error("Error creating practical:", error);
      toast.error("Failed to create practical"); // Show error toast
    } finally {
      setIsLoading(false); // Stop loading animation
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle difficulty selection (optional field)
  const handleDifficultyChange = (value) => {
    setFormData({
      ...formData,
      difficulty: value,
    });
  };

  return (
    <div className="p-6">
      <div className="flex w-[80vw]">
        {/* Form to create a new practical */}
        <Card className="mb-6 w-[30vw]">
          <CardHeader>
            <CardTitle>Create New Practical</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Subject</Label>
                <Input
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Enter subject"
                  required
                />
              </div>
              <div>
                <Label>Practical Number</Label>
                <Input
                  name="practicalNo"
                  value={formData.practicalNo}
                  onChange={handleChange}
                  placeholder="Enter practical number"
                  type="number"
                  required
                />
              </div>
              <div>
                <Label>Title</Label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter practical title"
                  required
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter practical description"
                  required
                />
              </div>
              <div>
                <Label>Related Theory</Label>
                <Textarea
                  name="relatedTheory"
                  value={formData.relatedTheory}
                  onChange={handleChange}
                  placeholder="Enter related theory"
                  required
                />
              </div>
              {/* Optional Fields (not in schema) */}
              <div>
                <Label>Difficulty</Label>
                <Select value={formData.difficulty} onValueChange={handleDifficultyChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {/* Loading spinner */}
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

        {/* List of created practicals */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Created Practicals</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Practical No</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Related Theory</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {practicals.map((pr) => (
                  <TableRow key={pr._id}>
                    <TableCell>{pr.subject}</TableCell>
                    <TableCell>{pr.practicalNo}</TableCell>
                    <TableCell>{pr.title}</TableCell>
                    <TableCell>{pr.description}</TableCell>
                    <TableCell>{pr.relatedTheory}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}