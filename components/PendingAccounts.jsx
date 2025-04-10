"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function PendingAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchPendingAccounts() {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        setLoading(true);
        const res = await fetch("/api/admin/approve", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            toast.error("Session expired. Please login again.");
            router.push("/login");
            return;
          }
          throw new Error("Failed to fetch accounts");
        }

        const data = await res.json();
        setAccounts([...data.students, ...data.teachers]);
      } catch (error) {
        console.error("Error fetching accounts:", error.message);
        toast.error(error.message || "Failed to load pending accounts");
      } finally {
        setLoading(false);
      }
    }

    fetchPendingAccounts();
  }, [router]);

  const handleApprove = async (account) => {
    const token = localStorage.getItem("token");
  
    try {
      console.log("Approving account:", account); // ✅ Debug log
  
      setApprovingId(account.id);
  
      const res = await fetch("/api/admin/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: account.id,
          role: account.role,
        }),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Approval failed");
      }
  
      setAccounts((prev) => prev.filter((acc) => acc._id !== account._id));
      toast.success(`${account.role} account approved successfully!`);
    } catch (error) {
      console.error("Error approving account:", error.message);
      toast.error(error.message || "Failed to approve account");
    } finally {
      setApprovingId(null);
    }
  };
  

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
    toast.success("Logged out successfully");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Pending Accounts</h1>
        <Button
          variant="destructive"
          onClick={handleLogout}
          className="hover:bg-red-600"
        >
          Logout
        </Button>
      </div>

      {/* Pending Accounts List */}
      <div className="grid gap-4">
        {accounts.length > 0 ? (
          accounts.map((account) => (
            <Card
              key={account._id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  {account.email}{" "}
                  <span className="text-muted-foreground">
                    ({account.role})
                  </span>
                </CardTitle>
                {account.fullname && (
                  <p className="text-sm text-muted-foreground">
                    {account.fullname}
                  </p>
                )}
              </CardHeader>
              <CardContent className="flex justify-end">
                <Button
                  onClick={() => handleApprove(account)} // ✅ Fixed here
                  className="bg-emerald-600 hover:bg-emerald-700"
                  disabled={approvingId === account._id}
                >
                  {approvingId === account._id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Approving...
                    </>
                  ) : (
                    "Approve"
                  )}
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No pending accounts found
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
