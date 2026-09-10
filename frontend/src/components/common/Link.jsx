import { forwardRef } from "react";
import { Link as RouterLink, NavLink as RouterNavLink } from "react-router-dom";
import { toSlashed } from "@/lib/links";

// Drop-in replacements for react-router's Link and NavLink that normalise
// internal paths to the trailing-slash form the CDN actually serves — see
// lib/links.js. Import these instead of react-router-dom's in components.
export const Link = forwardRef(function Link({ to, ...props }, ref) {
  return <RouterLink ref={ref} to={toSlashed(to)} {...props} />;
});

export const NavLink = forwardRef(function NavLink({ to, ...props }, ref) {
  return <RouterNavLink ref={ref} to={toSlashed(to)} {...props} />;
});
