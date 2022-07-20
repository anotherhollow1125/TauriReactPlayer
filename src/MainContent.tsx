import Player from "./Player";

interface IProps {
  file: FileEntry | null;
}

const MainContent = (props: IProps) => {
  return (
    <Player file={props.file} />
  );
}

export default MainContent;
