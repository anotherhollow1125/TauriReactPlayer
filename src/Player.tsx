import { useState, useEffect } from 'react';
import { convertFileSrc } from '@tauri-apps/api/tauri';
import ReactPlayer from 'react-player';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import DesktopAccessDisabledIcon from '@mui/icons-material/DesktopAccessDisabled';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Switch from '@mui/material/Switch';

interface IProps {
  file: FileEntry | null;
}

const default_player = <Box
  display="flex"
  alignItems="center"
  justifyContent="center"
>
  <DesktopAccessDisabledIcon sx={{ fontSize: 144 }} />
</Box>;

const Player = (props: IProps) => {
  const [loop, setLoop] = useState<boolean>(false);
  // const [rate, setRate] = useState<number>(1);
  const [player, setPlayer] = useState<JSX.Element>(default_player);

  useEffect(() => {
    if (!props.file) {
      return;
    }

    const url = convertFileSrc(props.file.path);
    const player = url ? <ReactPlayer width="100%" height="" url={url} controls={true} loop={loop} /> : default_player;
    setPlayer(player);
  }, [props.file, loop]);

  return (
    <Container maxWidth="lg">
      {player}
      <Card>
        <CardContent>
          ファイル名: {props.file?.path ?? ""}
          <br />
          ファイルサイズ: {props.file?.size ?? ""} bytes
          <br />
          ループ <Switch checked={loop} onChange={(e) => setLoop(e.target.checked)} />
          {/*
          <br />
          <Box sx={{ width: 300 }}>
            <Stack spacing={2} direction="row" alignItems="center">
              <Box>再生速度</Box>
              <Slider value={rate} min={-2} max={2} onChange={(e, v) => setRate(v as number)} />
              <Box>{rate}</Box>
            </Stack>
          </Box>
          */}
        </CardContent>
      </Card>
    </Container>
  );
};

export default Player;