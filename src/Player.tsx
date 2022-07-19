import { useState, useEffect } from 'react';
import { convertFileSrc } from '@tauri-apps/api/tauri';
import ReactPlayer from 'react-player';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import DesktopAccessDisabledIcon from '@mui/icons-material/DesktopAccessDisabled';

interface IProps {
  src: string | null;
}

const default_player = <Box
  display="flex"
  alignItems="center"
  justifyContent="center"
>
  <DesktopAccessDisabledIcon sx={{ fontSize: 144 }} />
</Box>;

const Player = (props: IProps) => {
  const [player, setPlayer] = useState<JSX.Element>(default_player);

  useEffect(() => {
    if (!props.src) {
      return;
    }

    const url = convertFileSrc(props.src);
    const player = url ? <ReactPlayer width="100%" height="" url={url} controls={true} /> : default_player;
    setPlayer(player);
  }, [props.src]);

  return (
    <Container maxWidth="lg">
      {player}
      <br />
      <p>Source: {props.src}</p>
    </Container>
  );
};

export default Player;