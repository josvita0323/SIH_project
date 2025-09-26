"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type RoleKey =
  | "rolling-stock-manager"
  | "procurement-officer"
  | "hr-safety-coordinator"
  | "executive-director";

// Map roles to user IDs
const ROLE_USER_MAP: Record<RoleKey, string> = {
  "rolling-stock-manager": "rolling_stock_operations",
  "procurement-officer": "procurement",
  "hr-safety-coordinator": "hr_safety",
  "executive-director": "executive_management",
};

// Dummy API fetch hook
function useUserData(userId: string) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:8000/summarized-content/department/${userId}`
        );
        if (!res.ok) throw new Error("Bad response");

        let json: any;
        try {
          json = await res.json();
          if (!Array.isArray(json)) throw new Error("Not array JSON");
        } catch {
          json = [];
        }

        if (!cancelled) {
          setData(json);
        }
      } catch {
        if (!cancelled) {
          setData([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { data, loading };
}
export function InboxList({ role }: { role: RoleKey }) {
  const userId = ROLE_USER_MAP[role];
  const { data: docs, loading } = useUserData(userId);

  if (loading) {
    return (
      <p className="p-4 text-sm text-muted-foreground">Loading inbox...</p>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Inbox</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {docs.length === 0 && (
          <p className="text-sm text-muted-foreground">No notices yet.</p>
        )}
        {docs.map((doc) => (
          <div key={doc.id} className="p-3 border rounded-lg">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{doc.title}</h4>
              {/* No status in model → default */}
              <Badge variant="secondary">info</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {doc.description}
            </p>
            {/* No uploadedAt or source in model → placeholder */}

            <div className="mt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  window.open(
                    `http://localhost:8000/file/${doc.upload_id}`,
                    "_blank"
                  )
                }
              >
                View
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
