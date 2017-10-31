import * as React from 'react';
import * as ReactDOM from 'react-dom';
import CommunicationService from './services/CommunicationService';
import Player from './containers/player';
import Playlist from './containers/playlist';
import './styles/styles.scss';

interface IState {
    playlist?: any[];
    chosenVideo: string;
};

interface IProps {};

class App extends React.Component<IProps, IState> {
    private getPlaylist;

    constructor() {
        super();

        this.state = {
            playlist: [],
            chosenVideo: ''
        }
        this.getPlaylist = () => {
            CommunicationService.getHTTP('./src/playlist.json').then((response) => {
                this.setState({
                    playlist: response.videos,
                    chosenVideo: response.videos[0].videoTitle
                });
            });
            
        }
        this.getPlaylist();
        this.chooseVideo = this.chooseVideo.bind(this);
    }

    chooseVideo(event, videoId?: any) {
        if (!videoId) {
            this.setState({ chosenVideo: event.target.innerHTML });
        } else {
            // this forEach goes through every video inside the playlist and 
            // matches the clicked video to be rendered on the screen.
            // it updates the state (this.state.chosenVideo) then it gets passed as props to the Player component
            // when Player component receives the chosenVideo then it rerenders the video DOM element 
            // with the proper link
            // find componentWillReceiveProps(props) inside player.tsx to read more.
            this.state.playlist.forEach((currentVideo) => {
                if (currentVideo.id === videoId) {
                    this.setState({ chosenVideo: currentVideo.videoTitle });
                }
            });
        }
    }

    render() {
        return(
            <div>
                <Player chosenVideo={this.state.chosenVideo}></Player>
                <Playlist chooseVideo={this.chooseVideo} playlist={this.state.playlist}></Playlist>
            </div>
        );
    }
}

ReactDOM.render(<App/>, document.querySelector('#app'));
