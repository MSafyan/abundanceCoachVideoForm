import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const VimeoPlayer = () => {
  return (
    <Card className="w-full">
      {/* <CardContent className="p-0 relative pt-[56.25%]"> */}
      <iframe
        src="https://player.vimeo.com/video/1017010145?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=478322"
        width="640"
        height="360"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
        title="trainer"
      />
      <iframe
        src="https://player.vimeo.com/video/1017010145?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=478322"
        width="640"
        height="360"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
        title="trainer"
      />
      {/* </CardContent>÷ */}
    </Card>
  );
};

export default VimeoPlayer;
