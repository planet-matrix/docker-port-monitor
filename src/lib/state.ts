export interface PS {
  Command: string
  CreatedAt: string
  ID: string
  Image: string
  Labels: string
  LocalVolumes: string
  Mounts: string
  Names: string
  Networks: string
  Ports: string
  RunningFor: string
  Size: string
  State: string
  Status: string
}

export const psRowInfo = [
  "Command",
  "CreatedAt",
  "ID",
  "Image",
  "Labels",
  "LocalVolumes",
  "Mounts",
  "Names",
  "Networks",
  "Ports",
  "RunningFor",
  "Size",
  "State",
  "Status",
]
export const usefulPsRowInfo = ["Image", "Names", "Ports", "Status"]
