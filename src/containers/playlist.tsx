import * as React from 'react';

interface IState {
    playlist: any[];
    chosenVideo: string;
    isPlaylistVisible: string;
};

interface IProps {
    chooseVideo: any;
    playlist: any[];
    chosenVideo: string;
}

class Playlist extends React.Component<IProps, IState> {
    constructor() {
        super();

        this.state = {
            playlist: [],
            chosenVideo: '',
            isPlaylistVisible: ''
        };
    }

    togglePlaylist(): void {
        if (!this.state.isPlaylistVisible) {
            this.setState({ isPlaylistVisible: 'playlist--is-visible' });
        } else {
            this.setState({ isPlaylistVisible: '' });
        }
    }

    render() {
        const { isPlaylistVisible } = this.state
        let video = this.props.playlist.map((currentVideo, index) => {
            let highlighted = '';
            if (currentVideo.videoTitle === this.props.chosenVideo) {
                highlighted = 'playlist-item--current';
            }
            return (
                <li key={index}
                    className={`playlist-item ${highlighted} pointer`}
                    onDoubleClick={(event) => this.props.chooseVideo(event, index)}>

                    <a>{`${currentVideo.videoTitle}`}</a>
                    <span className="playlist-item-duration">{`${currentVideo.duration}`}</span>
                </li>
            );
        });

        return (
            <ul className={`playlist noselect ${isPlaylistVisible}`}>
                { video }
                <span
                    onClick={() => {this.togglePlaylist()}} 
                    className="playlist-toggle pointer">
                    <i className="icon-list"></i>
                </span>
            </ul>
        );
    }
}

export default Playlist;
