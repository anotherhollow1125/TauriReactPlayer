import { useState, useEffect } from 'react';
import MainContent from './MainContent';
import FileExplorer from './FileExplorer';
import { invoke } from '@tauri-apps/api/tauri';
import { getVersion } from '@tauri-apps/api/app';

import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const drawerWidth = 360;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
}));

const App = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(true);

  const [version, setVersion] = useState<string>("");

  const [name, setName] = useState('React Player by Tauri Apps');
  const [file, setFile] = useState<FileEntry | null>(null);
  const [dir, setDir] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const appVersion = await getVersion();
      setVersion(appVersion);

      const init_entry = await invoke<Entry | undefined>('get_initial_path');

      let set_dir_flag = false;
      if (init_entry && init_entry.type === "dir") {
        setDir(init_entry.path);
        set_dir_flag = true;
      } else if (init_entry && init_entry.type === "file") {
        setFile(init_entry);
        setName(init_entry.name);
        const parent = await invoke<string>("get_parent", { path: init_entry.path })
          .catch(_err => {
            return null;
          });
        if (parent != null) {
          setDir(parent);
          set_dir_flag = true;
        }
      }

      if (set_dir_flag) {
        return;
      }

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

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {name}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <Typography variant="h6" noWrap>
            React Player v.{version}
          </Typography>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <FileExplorer dir={dir} setDir={setDir} setFile={setFile} setName={setName} />
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <MainContent file={file} />
      </Main>
    </Box>
  );
}

export default App;
