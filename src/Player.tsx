import { useState, useEffect } from 'react';
import { convertFileSrc } from '@tauri-apps/api/tauri';
import ReactPlayer from 'react-player';

interface IProps {
  src: string | null;
}

const Player = (props: IProps) => {
  const [player, setPlayer] = useState<JSX.Element>(<></>);

  useEffect(() => {
    if (!props.src) {
      return;
    }

    const url = convertFileSrc(props.src);
    const player = url ? (
      <>
        <ReactPlayer url={url} controls={true} />
        <br />
        <p>Source: {props.src}</p>
      </>
    ) : <></>;
    setPlayer(player);
  }, [props.src]);

  return player;
};

export default Player;