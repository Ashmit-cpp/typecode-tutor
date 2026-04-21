import { useNavigate } from "react-router-dom";
import { KeyClashLandingSectionsGrid } from "@/components/landing/keyclash-landing";

interface KeyClashPageProps {
  onEnterQueue: () => void;
}

export default function KeyClashPage({ onEnterQueue }: KeyClashPageProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col overflow-x-hidden">
      <KeyClashLandingSectionsGrid
        onFindMatch={onEnterQueue}
        onPracticeSolo={() => navigate("/practice")}
        onStartDueling={onEnterQueue}
      />
    </div>
  );
}
