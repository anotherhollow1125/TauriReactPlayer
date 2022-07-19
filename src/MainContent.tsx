import Player from "./Player";

interface IProps {
  src: string | null;
}

const MainContent = (props: IProps) => {
  return (
    <Player src={props.src} />
  );
}

export default MainContent;
