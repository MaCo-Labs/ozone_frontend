export const PROJECT_BRANCHES = [
  { value: "qatar", label: "Qatar" },
  { value: "bahrain", label: "Bahrain" },
] as const;

export type ProjectBranch = (typeof PROJECT_BRANCHES)[number]["value"];

// Older API responses and the packaged company profile predate the Bahrain branch.
export function projectBranch(branch?: ProjectBranch): ProjectBranch {
  return branch === "bahrain" ? "bahrain" : "qatar";
}
