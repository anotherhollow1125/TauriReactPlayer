import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { IconButton } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Grid from '@mui/material/Grid';

interface IProp {
  dir: string | null;
  setDir: (dir: string) => void;
  setFile: (file: FileEntry) => void;
  setName: (name: string) => void;
}

const FileExplorer = (props: IProp) => {
  const [parent, setParent] = useState<string | null>(props.dir);
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

      const parent = await invoke<string>("get_parent", { path: props.dir })
        .catch(_err => {
          return null;
        });

      setParent(parent);
    })();
  }, [props.dir]);

  // TODO: Parent Directory Button

  const entry_list = entries ? <>
    {entries.map(entry => {
      let item;
      if (entry.type === "dir") {
        item = (
          <ListItemButton onClick={() => props.setDir(entry.path)}>
            <ListItemText primary={entry.name} /> <ChevronRightIcon />
          </ListItemButton>
        ); //<li key={entry.path} onClick={() => props.setDir(entry.path)}>{entry.name} &gt;</li>;
      } else {
        item = (
          <ListItemButton onClick={() => {
            props.setFile(entry);
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
      <Grid container spacing={1} alignItems='center' sx={{ mx: 1 }}>
        <Grid item xs={9}>
          <h4>{props.dir}</h4>
        </Grid>
        <Grid item xs={3}>
          <IconButton onClick={() => parent && props.setDir(parent)}>
            <KeyboardArrowUpIcon />
          </IconButton>
        </Grid>
      </Grid>
      <List>
        {entry_list}
      </List>
    </>
  );
}

export default FileExplorer;
