import { useState, useEffect } from 'react';
import ReactPlayer from "react-player";
import { desktopDir, join } from '@tauri-apps/api/path';
import { convertFileSrc } from '@tauri-apps/api/tauri';

const App = () => {
  const [src, setSrc] = useState<string>('');
  const [player, setPlayer] = useState<JSX.Element>();

  useEffect(() => {
    const fn = async () => {
      const desktopDirPath = await desktopDir();
      const url = convertFileSrc(await join(desktopDirPath, src));
      const player = <ReactPlayer url={url} controls={true} />;
      setPlayer(player);
    };
    fn();
  }, [src]);

  return (
    <>
      <h1>React Player</h1>
      {player}
      <br />
      {src}
      <br />
      <br />
      <input type="text" value={src} onChange={e => setSrc(e.target.value)} />
    </>
  );
}

export default App;
