import * as React from 'react';
import Slider from 'react-rangeslider'; // https://whoisandy.github.io/react-rangeslider/

interface IState {
    togglePlayText: string;
    toggleMuteText: string;
    volumeValue: number;
    videoProgress: any; 
    volumeIconSuffix: string;
    previousVolumeValue: number;
    previousIconSuffix: string;
    isFadingDone: boolean;
    chosenVideo: string;
    chosenVideoIndex: number;
    stopped: boolean;
    resize: string;
    canPlay: boolean;
    firstFetch: boolean;
};

interface IProps {
    chosenVideo: string;
    chooseVideo: any;
    playlist: any[];
    playlistLength: number;
    chosenVideoIndex: number;
    canPlay: boolean;
    firstFetch: boolean;
    resetState: () => void; 
};

declare var document: any;
class Player extends React.Component<IProps, IState> {
    private video: any; // this must be type 'any'
    private videoContainer: any;
    private volume: HTMLInputElement;
    private progress: HTMLInputElement;
    private playPause: HTMLButtonElement;
    private timeInfo: HTMLDivElement;
    private extension: string; // extension that is playable by the browser
    public exitFullscreen: () => void;
    public mozCancelFullScreen: () => void;

    constructor() {
        super();

        this.state = {
            togglePlayText: 'Play',
            toggleMuteText: 'Mute',
            volumeValue: 1,
            videoProgress: 0,
            volumeIconSuffix: '-up',
            previousIconSuffix: '-up',
            previousVolumeValue: 1,
            isFadingDone: true,
            chosenVideo: 'Tom_Swoon_-_Wings_(Myon_and_Shane_54_Summer_of_Love_Mix)',
            chosenVideoIndex: 0,
            stopped: true,
            resize: 'Enter full screen',
            canPlay: false,
            firstFetch: true
        }
    }

    togglePlayPause(): void {
        // Fires the main play/pause button animation
        this.setState({ isFadingDone: false });

        if (this.video.paused || this.video.ended) {
            this.setState({ togglePlayText: 'Pause' });
            this.video.play();
        } else {
            this.setState({ togglePlayText: 'Play' });
            this.video.pause();
        }
    }

    toggleMute(): void {
        this.video.muted = !this.video.muted;

        if (this.video.muted) {
            this.setState({
                toggleMuteText: 'Unmute',
                volumeIconSuffix: '-off',
                volumeValue: 0
            });
        } else {
            this.setState({
                volumeValue: this.state.previousVolumeValue, // these two lines remember the previous states which is necessary
                volumeIconSuffix: this.state.previousIconSuffix // for the icon to update properly in relation to its previous volume level (when unmuted)
            });
        }
    }

    setVolume = (value: number): void => {
        this.setState({
            volumeValue: value,
            previousVolumeValue: value
        });
        let volume: number = this.state.volumeValue,
            result = '-up';

        // the statements change the volume icon class attribute name's suffix
        if (value >= 0.75) {
            result = '-up';
        } else if (value >= 0.33 && value < 0.66) {
            result = '';
        } else if (value < 0.33 && value > 0) {
            result = '-down';
        } else if (value === 0) {
            result = '-off';
        }

        // the icon class attribute gets changed to indicate the volume level on the icon itself
        this.setState({
            volumeIconSuffix: result,
            previousIconSuffix: result
        });

        // the volume of the video updates here
        this.video.volume = value;
    }

    updateProgress(): void {
        let value = 0,
            currentMins: any = Math.floor(this.video.currentTime / 60),
            currentSecs: any = Math.floor(this.video.currentTime - currentMins * 60),
            durationMins: any = Math.floor(this.video.duration / 60),
            durationSecs: any = Math.floor(this.video.duration - durationMins * 60);

        // These four lines add 0 in front of seconds and minutes if their value is less than 10.
        currentSecs < 10 && (currentSecs = `0${currentSecs}`);
        durationSecs < 10 && (durationSecs = `0${durationSecs}`);
        currentMins < 10 && (currentMins = `0${currentMins}`);
        durationMins < 10 && (durationMins = `0${durationMins}`);

        this.video.currentTime > 0 && (value = Math.floor((100 / this.video.duration) * this.video.currentTime));
        this.setState({ videoProgress: value });

        // displays the time info of the currently played video
        if (this.video.currentTime && this.video.duration) {
            this.timeInfo.innerHTML = `${currentMins}:${currentSecs} / ${durationMins}:${durationSecs}`;
        } else {
            this.timeInfo.innerHTML = '00:00 / 00:00';
        }
    }

    stop(videoId): void {
        this.video.pause();
        this.video.load(); // this forces the poster to show after clicking the stop button.
        this.setState({ 
            stopped: true,
            videoProgress: 0,
            togglePlayText: 'Play',
            canPlay: false
        });
        this.timeInfo.innerHTML = '00:00 / 00:00';
        this.props.chooseVideo(null, videoId, true);
    }

    setVideoProgress = (value: number): void => {
        if (this.state.canPlay) {
            let setProgress = this.video.duration * (value / 100);
            
            this.video.currentTime = setProgress;
            this.setState({ videoProgress: value });
        }
    }

    fadingDone(): void {
        this.setState({ isFadingDone: true });
    }

    enterFullScreen(): any {
        this.setState({ resize: 'Exit full screen' });

        if (this.videoContainer.requestFullscreen) {
            this.videoContainer.requestFullscreen();
        } else if (this.videoContainer.webkitRequestFullScreen) {
            this.videoContainer.webkitRequestFullscreen();
        } else if (this.videoContainer.mozRequestFullScreen) {
            this.videoContainer.mozRequestFullScreen();
        } else if (this.videoContainer.msRequestFullscreen) {
            this.videoContainer.msRequestFullscreen();
        }
    }

    exitFullScreen(): void {
        this.setState({ resize: 'Enter full screen' });

        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    }

    playVideo(): void {
        let isPlaying = this.video.currentTime > 0 && !this.video.paused && !this.video.ended && this.video.readyState > 2;

        if (!isPlaying && !this.state.firstFetch) {
            this.setState({ togglePlayText: 'Pause' });
            this.video.play();
        } else {
            this.setState({ togglePlayText: 'Play' });
        }
    }

    chooseNext(): void {
        if ((this.state.chosenVideoIndex < this.props.playlistLength - 1) && !this.state.firstFetch) {
            this.props.chooseVideo(null, this.state.chosenVideoIndex + 1);
        } else {
            this.setState({
                canPlay: false,
                firstFetch: true,
                togglePlayText: 'Play'
            });
            this.props.chooseVideo(null, 0);
            this.props.resetState();
        }
    }

    componentDidMount() {
        this.video.controls = false;
        
        if (this.video.canPlayType("video/mp4") != "") {
            this.extension = 'mp4';
        } else if (this.video.canPlayType("video/webm") != "") {
            this.extension = 'webm';
        } else if (this.video.canPlayType("video/ogv") != "") {
            this.extension = 'ogv';
        }
    }

    // this function receives the props from its parent element and it updates the state.
    // Update on the state fires the render() method and then the video DOM element gets rerendered with 
    // the new src attribute ( src={`../videos/${this.state.chosenVideo}.mp4`} )
    componentWillReceiveProps(props) {
        this.setState({
            chosenVideo: props.chosenVideo,
            chosenVideoIndex: props.chosenVideoIndex,
            canPlay: props.canPlay,
            firstFetch: props.firstFetch
        });
    }

    render() {
        const { volumeValue, stopped, videoProgress, firstFetch, isFadingDone, canPlay, chosenVideoIndex, chosenVideo, togglePlayText, resize, volumeIconSuffix, toggleMuteText } = this.state;
        return (
            <div
                className="player"
                ref={videoContainer => this.videoContainer = videoContainer}>
                <video
                    poster={`../videos/posters/${chosenVideo}.jpg`}
                    onLoadStart={() => canPlay && this.playVideo() }
                    onEnded={() => this.chooseNext()}
                    onTimeUpdate={() => this.updateProgress()} // timeUpdate event fires everytime the media's currentTime attribute is changed
                    ref={video => this.video = video}
                    src={`../videos/${chosenVideo}.${this.extension}`}
                    controls>
                </video>

                <button
                    className={isFadingDone ? `button button--main pointer` : `button button--main pointer fade-out`}
                    onClick={() => this.togglePlayPause()}
                    onAnimationEnd={() => this.fadingDone()}>

                    <i className={togglePlayText === 'Play' ? 'icon-pause-circled' : 'icon-play-circled'}></i>
                </button>

                <div className={togglePlayText === 'Play' ? 'player-interface player-interface--mobile-visible' : 'player-interface'}>
                    <div id="controls" className="player-interface-controls">
                        <button
                            className="button button--no-outline button--play pointer"
                            ref={playPause => this.playPause = playPause}
                            title={togglePlayText}
                            onClick={() => this.togglePlayPause()}>
                            <i className={togglePlayText === 'Play' ? 'icon-play-circled' : 'icon-pause-circled'}></i>
                        </button>
                        <button
                            className="button button--no-outline pointer"
                            title="Stop"
                            onClick={() => this.stop(0)}>
                            <i className="icon-stop-circled"></i>
                        </button>
                    </div>

                    <div
                        ref={div => this.timeInfo = div}
                        className="player-interface-timer">
                        00:00 / 00:00
                    </div>

                    <div className="slider player-interface-progress pointer">
                        <Slider
                            className="player-interface-progress-line"
                            ref={progress => this.progress = progress}
                            min={0}
                            max={100}
                            step={0.1}
                            value={videoProgress}
                            onChange={this.setVideoProgress} />
                    </div>

                    <div className="player-interface-resize">
                        <button
                            title={resize}
                            className="button button--no-outline pointer"
                            onClick={() => { resize === 'Enter full screen' ? this.enterFullScreen() : this.exitFullScreen() } }>

                            <i className={ resize === 'Enter full screen' ? `icon-resize-full` : `icon-resize-small` }></i>
                        </button>
                    </div>
                    <div className="player-interface-volume">
                        <button
                            title={toggleMuteText}
                            className="button button--no-outline pointer"
                            onClick={() => this.toggleMute()}>

                            <i className={`icon-volume${volumeIconSuffix}`}></i>
                        </button>
                        <div className="slider">
                            <div className="slider-toggle">
                                <Slider
                                    ref={input => this.volume = input}
                                    min={0}
                                    max={1}
                                    value={volumeValue}
                                    onChange={this.setVolume}
                                    step={0.01} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Player;
