import { useNavigate } from "react-router-dom";
import { KeyClashLandingSectionsGrid } from "@/components/landing/keyclash-landing";

interface KeyClashPageProps {
  onEnterQueue: () => void;
}

export default function KeyClashPage({ onEnterQueue }: KeyClashPageProps) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <KeyClashLandingSectionsGrid
        onFindMatch={onEnterQueue}
        onPracticeSolo={() => navigate("/practice")}
        onStartDueling={onEnterQueue}
      />
    </div>
  );
}
