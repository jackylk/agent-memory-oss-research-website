import { loadAllProjects } from '@/lib/data';
import CompareView from '@/components/CompareView';

export default function ComparePage() {
  const projects = loadAllProjects();

  return <CompareView projects={projects} />;
}
