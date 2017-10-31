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
    // private getPlaylist;

    constructor() {
        super();

        this.state = {
            playlist: [],
            chosenVideo: ''
        };
    }

    playlistManager = () => {
        let index = 0,
            playlist = this.props.playlist,
            length = this.props.playlist.length;

        return {
            next: () => {
                let element;
                if (index >= length) {
                    return null;
                }
                element = playlist[index];
                index = index + 2;
                return element;
            },
            hasNext: () => {
                return index < length;
            },
            rewind: () => {
                index = 0;
            },
            current: () => {
                return playlist[index];
            }
        }
    }

    render() {
        const playlistManager = this.playlistManager();

        let video = this.props.playlist.map((currentVideo, index) => {
            let highlighted = '';
            if (currentVideo.videoTitle === this.props.chosenVideo) {
                highlighted = 'playlist-item--current';
            }
            return (
                <li key={index}>
                    <a
                        className={`playlist-item ${highlighted} pointer`}
                        onDoubleClick={(event) => this.props.chooseVideo(event, index)}>

                        {`${currentVideo.videoTitle}`}
                    </a>
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
