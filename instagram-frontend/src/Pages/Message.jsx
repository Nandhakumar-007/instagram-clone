import React from "react";
import Layout from "../components/Layout";
import Messages from "../components/Messages";

// This assumes your other pages (Home.jsx, Profile.jsx, etc.) are also
// wrapped with your Layout component (Sidebar/Navbar). If Home.jsx does it
// differently (e.g. renders <Sidebar /> and <Navbar /> directly instead of
// a <Layout>), just mirror that same pattern here instead.

export default function Message() {
  return (
    <div className="Message">
        <Layout>
         <Messages />
         </Layout>
    </div>
  );
}