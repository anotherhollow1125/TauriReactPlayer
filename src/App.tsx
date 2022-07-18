import { useState, useEffect } from 'react';
import ReactPlayer from "react-player";
import { join } from '@tauri-apps/api/path';
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { invoke } from '@tauri-apps/api/tauri';

type Entry = {
  type: 'dir' | 'file';
  name: string;
  path: string;
};

type Entries = Array<Entry>;

const App = () => {
  const [src, setSrc] = useState<string | null>(null);
  const [dir, setDir] = useState<string | null>(null);
  const [player, setPlayer] = useState<JSX.Element | null>(null);
  const [entries, setEntries] = useState<Entries | null>(null);

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

  useEffect(() => {
    if (!src) {
      return;
    }

    const url = convertFileSrc(src);
    const player = <ReactPlayer url={url} controls={true} />;
    setPlayer(player);
  }, [src]);

  useEffect(() => {
    (async () => {
      const entries = await invoke<Entries>("get_entries", { path: dir })
        .catch(err => {
          console.error(err);
          return null;
        });

      setEntries(entries);
    })();
  }, [dir]);

  const entry_list = entries ? <ul>
    {entries.map(entry => {
      if (entry.type == "dir") {
        return <li key={entry.path} onClick={() => setDir(entry.path)}>{entry.name}</li>;
      } else {
        return <li key={entry.path} onClick={() => setSrc(entry.path)}>{entry.name}</li>;
      }
    })}
  </ul> : null;

  return (
    <>
      <h1>React Player</h1>
      {player}
      <br />
      src: {src ?? '(not selected)'}
      <br />
      dir: {dir ?? ''}
      <br />
      {entry_list}
    </>
  );
}

export default App;
