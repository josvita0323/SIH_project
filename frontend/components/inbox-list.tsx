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
const ROLE_USER_MAP: Record<RoleKey, number> = {
  "rolling-stock-manager": 1,
  "procurement-officer": 2,
  "hr-safety-coordinator": 3,
  "executive-director": 4,
};

// Dummy API fetch hook
function useUserData(userId: number) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/user/${userId}/documents`)
      .then((res) => res.json())
      .then((json) => setData(json))
      .finally(() => setLoading(false));
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
        {docs.map((doc: any) => {
          const formattedDate =
            typeof window !== "undefined"
              ? new Date(doc.uploadedAt).toLocaleDateString()
              : doc.uploadedAt;

          return (
            <div key={doc.id} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{doc.title}</h4>
                <Badge
                  variant={
                    doc.status === "urgent" ? "destructive" : "secondary"
                  }
                >
                  {doc.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {doc.summary}
              </p>
              <div className="text-xs text-muted-foreground mt-2">
                {formattedDate} • Source: {doc.source}
              </div>
              <div className="mt-2">
                <Button size="sm" variant="outline">
                  View
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
