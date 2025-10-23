// components/SiteHeaderServer.tsx
// Static version: no Sanity import, no fetching. Just render the client header.

import SiteHeaderClient from "./SiteHeaderClient";

export default function SiteHeaderServer() {
  return <SiteHeaderClient />;
}