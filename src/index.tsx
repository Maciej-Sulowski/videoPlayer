import * as React from 'react';
import * as ReactDOM from 'react-dom';
import CommunicationService from './services/CommunicationService';
import Player from './containers/player';
import Playlist from './containers/playlist';
import './styles/styles.scss';

interface IState {
    playlist?: any[];
    chosenVideo: string;
    videoIndex: number;
    canVideosBePlayed: boolean;
};

interface IProps {};

class App extends React.Component<IProps, IState> {
    private getPlaylist;

    constructor() {
        super();

        this.state = {
            playlist: [],
            chosenVideo: '',
            videoIndex: 0,
            canVideosBePlayed: false
        }
        this.getPlaylist = () => {
            CommunicationService.getHTTP('./src/playlist.json').then((response) => {
                this.setState({
                    playlist: response.videos,
                    chosenVideo: response.videos[0].videoTitle,
                    videoIndex: 0
                });
            });
        }
        this.getPlaylist();
        this.chooseVideo = this.chooseVideo.bind(this);
    }

    chooseVideo(event: any, videoId: number) {
        this.state.playlist.forEach((currentVideo) => {
            // this forEach goes through every video inside the playlist and 
            // matches the clicked video to be rendered on the screen.
            // it updates the state (this.state.chosenVideo) then it gets passed as props to the Player component
            // when Player component receives the chosenVideo then it rerenders the video DOM element 
            // with the proper link
            // find componentWillReceiveProps(props) inside player.tsx to read more.
            if (currentVideo.id === videoId) {
                this.setState({
                    chosenVideo: currentVideo.videoTitle,
                    videoIndex: videoId                    
                });

                if (currentVideo.id < (this.state.playlist.length - 1)) {
                    this.setState({ canVideosBePlayed: false });
                } else {
                    this.setState({ canVideosBePlayed: true });
                }
            }
        });
    }

    
    render() {
        return(
            <div>
                <Player
                    canVideosBePlayed={this.state.canVideosBePlayed}
                    playlistLength={this.state.playlist.length}
                    chosenVideo={this.state.chosenVideo}
                    chosenVideoIndex={this.state.videoIndex}
                    chooseVideo={this.chooseVideo}
                    playlist={this.state.playlist}>
                </Player>
                <Playlist
                    chosenVideo={this.state.chosenVideo}
                    chooseVideo={this.chooseVideo}
                    playlist={this.state.playlist}>
                </Playlist>
            </div>
        );
    }
}

ReactDOM.render(<App/>, document.querySelector('#app'));
