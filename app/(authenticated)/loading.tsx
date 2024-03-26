import { Loader2 } from "lucide-react";

export default function Loading() {
  return <div className="w-32 h-32 absolute margin-auto">
    <Loader2 className="mr-2 h-20 w-20 animate-spin" />
  </div>
}