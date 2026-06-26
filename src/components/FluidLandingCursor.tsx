import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

interface FluidLandingCursorProps {
  theme: "wedding" | "vacation" | "textile" | "food" | "insider" | "hotels";
}

export function FluidLandingCursor({ theme }: FluidLandingCursorProps) {
  // Return null to ensure all deeper subpages and sections default to the standard native browser cursor
  return null;
}
