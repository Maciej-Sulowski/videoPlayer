import * as React from 'react';

interface IState {
    playlist: any[];
    chosenVideo: string;
};

interface IProps {
    chooseVideo: any;
    playlist: any[];
};

class Playlist extends React.Component<IProps, IState> {
    private getPlaylist;

    constructor() {
        super();

        this.state = {
            playlist: [],
            chosenVideo: ''
        };
    }

    render() {
        let video = this.props.playlist.map((currentVideo, index) => {
            return (
                <div key={index}>
                    <a
                        className="playlist-item pointer"
                        onDoubleClick={(event) => this.props.chooseVideo(event, index)}>

                        {`${currentVideo.videoTitle}`}
                    </a>
                </div>
            );
        });

        return (
            <div className="playlist">
                { video }
            </div>
        );
    }
}

export default Playlist;
