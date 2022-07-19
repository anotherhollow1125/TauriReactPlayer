import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

interface IProp {
  dir: string | null;
  setDir: (dir: string) => void;
  setSrc: (src: string) => void;
  setName: (name: string) => void;
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

  // TODO: Parent Directory Button

  const entry_list = entries ? <>
    {entries.map(entry => {
      let item;
      if (entry.type == "dir") {
        item = (
          <ListItemButton onClick={() => props.setDir(entry.path)}>
            <ListItemText primary={entry.name} />
          </ListItemButton>
        ); //<li key={entry.path} onClick={() => props.setDir(entry.path)}>{entry.name} &gt;</li>;
      } else {
        item = (
          <ListItemButton onClick={() => {
            props.setSrc(entry.path);
            props.setName(entry.name);
          }}>
            <ListItemText primary={entry.name} />
          </ListItemButton>
        ); // <li key={entry.path} onClick={() => props.setSrc(entry.path)}>{entry.name}</li>;
      }
      return (
        <>
          <ListItem key={entry.path} disablePadding>
            {item}
          </ListItem>
          <Divider />
        </>
      );
    })}
  </> : <></>;

  return (
    <>
      <h4>{props.dir}</h4>
      <List>
        {entry_list}
      </List>
    </>
  );
}

export default FileExplorer;
