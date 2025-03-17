"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Code2, Play, RotateCcw, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CodeSpace from "@/components/CodeSpace";

export default function CodePractice() {
  const [output, setOutput] = useState("");
  const [practicals, setPracticals] = useState([]);
  const [selectedPracticalNo, setSelectedPracticalNo] = useState(1); // Default to the first practical
  const [isLoading, setIsLoading] = useState(true); // Loading state for fetching practicals

  // Fetch practicals data from the backend
  useEffect(() => {
    const fetchPracticals = async () => {
      try {
        const response = await fetch("/api/practicals");
        const data = await response.json();
        setPracticals(data);
        if (data.length > 0) {
          setSelectedPracticalNo(data[0].practicalNo); // Set the default practicalNo
        }
      } catch (error) {
        console.error("Failed to fetch practicals:", error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching
      }
    };

    fetchPracticals();
  }, []);

  // Find the selected practical based on the Practical No
  const selectedPractical = practicals.find((pr) => pr.practicalNo === selectedPracticalNo);

  const runCode = () => {
    setOutput("Running code...\n\nTest cases passed: 2/5");
  };

  const resetCode = () => {
    setOutput("");
  };

  // Handle creating a new practical
  const handleCreatePractical = async () => {
    const newPractical = {
      subject: "React",
      practicalNo: practicals.length + 1, // Auto-increment practical number
      title: `New Practical ${practicals.length + 1}`,
      description: "This is a new practical description.",
      relatedTheory: "This is the related theory for the new practical.",
    };

    try {
      const response = await fetch("/api/practicals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPractical),
      });

      if (response.ok) {
        const createdPractical = await response.json();
        setPracticals([...practicals, createdPractical]); // Update the practicals list
        setSelectedPracticalNo(createdPractical.practicalNo); // Select the newly created practical
      } else {
        console.error("Failed to create practical:", await response.json());
      }
    } catch (error) {
      console.error("Failed to create practical:", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
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
          {/* Dropdown to select practical */}
          <Select
            value={selectedPracticalNo.toString()}
            onValueChange={(value) => setSelectedPracticalNo(Number(value))}
          >
            <SelectTrigger className="w-[180px] sm:w-[280px]">
              <SelectValue placeholder="Select Practical" />
            </SelectTrigger>
            <SelectContent>
              {practicals.map((pr) => (
                <SelectItem key={pr._id} value={pr.practicalNo.toString()}>
                  PR {pr.practicalNo}: {pr.title}
                </SelectItem>
              ))}
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
            <CodeSpace />
          </div>
        </div>
      </div>
    </div>
  );
}