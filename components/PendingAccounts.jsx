"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function PendingAccounts() {
  const [accounts, setAccounts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchPendingAccounts() {
      const token = localStorage.getItem("token"); // Get token from local storage
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("/api/admin/approve", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch accounts");

        const data = await res.json();
        setAccounts([...data.students, ...data.teachers]);
      } catch (error) {
        console.error("Error fetching accounts:", error.message);
      }
    }

    fetchPendingAccounts();
  }, [router]);

  const handleApprove = async (id, role) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/admin/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, role }),
      });

      if (!res.ok) throw new Error("Approval failed");

      setAccounts((prev) => prev.filter((acc) => acc._id !== id));
    } catch (error) {
      console.error("Error approving account:", error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="p-6 space-y-6">
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
              </CardHeader>
              <CardContent className="flex justify-end">
                <Button
                  onClick={() => handleApprove(account._id, account.role)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Approve
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-muted-foreground">
            No pending accounts found.
          </p>
        )}
      </div>
    </div>
  );
}
