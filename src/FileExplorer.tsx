import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

interface IProp {
  dir: string | null;
  setDir: (dir: string) => void;
  setSrc: (src: string) => void;
}

const FileExplorer = (props: IProp) => {
  const [entries, setEntries] = useState<Entries | null>(null);

  useEffect(() => {
    (async () => {
      if (!props.dir) {
        return;
      }

      const entries = await invoke<Entries>("get_entries", { path: props.dir })
        .catch(err => {
          console.error(err);
          return null;
        });

      setEntries(entries);
    })();
  }, [props.dir]);

  const entry_list = entries ? <ul>
    {entries.map(entry => {
      if (entry.type == "dir") {
        return <li key={entry.path} onClick={() => props.setDir(entry.path)}>{entry.name} &gt;</li>;
      } else {
        return <li key={entry.path} onClick={() => props.setSrc(entry.path)}>{entry.name}</li>;
      }
    })}
  </ul> : null;

  return (
    <>
      <h4>{props.dir}</h4>
      {entry_list}
    </>
  );
}

export default FileExplorer;
