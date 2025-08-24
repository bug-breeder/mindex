import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import MapsPage from "@/pages/maps/index";
import MapEditorPage from "@/pages/maps/[id]";
import ImportPage from "@/pages/import";
import SettingsPage from "@/pages/settings";
import LoginPage from "@/pages/auth/login";
import SignUpPage from "@/pages/auth/signup";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<MapsPage />} path="/maps" />
      <Route element={<MapEditorPage />} path="/maps/:id" />
      <Route element={<ImportPage />} path="/import" />
      <Route element={<SettingsPage />} path="/settings" />
      <Route element={<LoginPage />} path="/auth/login" />
      <Route element={<SignUpPage />} path="/auth/signup" />
    </Routes>
  );
}

export default App;
