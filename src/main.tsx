import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import archiveData from "../app/data/archive.generated.json";
import { XiaohongshuArchive, type Archive } from "./XiaohongshuArchive";
import "./styles.css";
import "./audio.css";
import "./xhs.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <XiaohongshuArchive data={archiveData as Archive} />
  </StrictMode>,
);
