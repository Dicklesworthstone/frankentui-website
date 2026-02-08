import type { Metadata } from "next";
import SpecEvolutionLab from "@/components/spec-evolution-lab";

export const metadata: Metadata = {
  title: "Spec Evolution Lab",
  description:
    "Forensic visualization of the FrankenTUI spec corpus evolving over time: reconstructed from git history and annotated with manual change-group categorization.",
};

export default function SpecEvolutionLabPage() {
  return <SpecEvolutionLab />;
}
