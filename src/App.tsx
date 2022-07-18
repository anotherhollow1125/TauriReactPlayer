import { useState, useEffect } from 'react';
import Player from "./Player";
import { invoke } from '@tauri-apps/api/tauri';
import FileExplorer from './FileExplorer';

const App = () => {
  const [src, setSrc] = useState<string | null>(null);
  const [dir, setDir] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const homeDir = await invoke<string>("get_home_dir")
        .catch(err => {
          console.error(err);
          return null;
        });

      if (!homeDir) {
        return;
      }

      setDir(homeDir);
    })();
  }, []);

  return (
    <>
      <h1>React Player</h1>
      <Player src={src} />
      <br />
      <FileExplorer dir={dir} setDir={setDir} setSrc={setSrc} />
    </>
  );
}

export default App;
