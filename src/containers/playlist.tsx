import * as React from 'react';

interface IState {
    playlist: any[];
    chosenVideo: string;
};

interface IProps {
    chooseVideo: any;
    playlist: any[];
    chosenVideo: string;
};

class Playlist extends React.Component<IProps, IState> {
    constructor() {
        super();

        this.state = {
            playlist: [],
            chosenVideo: ''
        };
    }

    render() {
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
            <ul className="playlist">
                { video }
            </ul>
        );
    }
}

export default Playlist;
