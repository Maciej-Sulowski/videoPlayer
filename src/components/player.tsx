
import * as React from 'react';
import Slider from 'react-rangeslider'; // https://whoisandy.github.io/react-rangeslider/

interface IState {
    togglePlayText: string;
    toggleMuteText: string;
    volumeValue: number;
    videoProgress: any;
    volumeIconSuffix: string;
    previousVolumeValue: number;
    isFadingDone: boolean;
};

interface IProps {};

class Player extends React.Component<IProps, IState> {
    private video: HTMLVideoElement;
    private volume: HTMLInputElement;
    private progress: HTMLInputElement;
    private playPause: HTMLButtonElement;
    private timeInfo: HTMLDivElement;

    constructor() {
        super();

        this.state = {
            togglePlayText: 'Play',
            toggleMuteText: 'Mute',
            volumeValue: 1,
            videoProgress: 0,
            volumeIconSuffix: '-up',
            previousVolumeValue: 1,
            isFadingDone: true
        }
    }

    togglePlayPause():void {        
        // Fires the main play/pause button animation
        this.setState({ isFadingDone: false });

		if (this.video.paused || this.video.ended) {
            this.setState({ togglePlayText: 'Pause' })
			this.video.play();
		} else {
            this.setState({ togglePlayText: 'Play' })
			this.video.pause();
		}
    }

    toggleMute():void {
        this.video.muted = !this.video.muted;

        if (this.video.muted) {
            this.setState({
                toggleMuteText: 'Unmute',
                volumeIconSuffix: '-off',
                volumeValue: 0
            });
        } else {
            this.setState({
                toggleMuteText: 'Mute',
                volumeValue: this.state.previousVolumeValue
            });
        }
    }

    setVolume = (value: number):any => {
        this.setState({ 
            volumeValue: value,
            previousVolumeValue: value         
        });
        let volume:number = this.state.volumeValue,
            result = '-up';
        
        // the statements change the volume icon class attribute name's suffix
        if (volume >= 0.75) {
            result = '-up';
        } else if (volume >= 0.33 && volume < 0.66) {
            result = '';
        } else if (volume < 0.33 && volume > 0) {
            result = '-down';
        } else if (volume === 0) {
            result = '-off';
        }
        
        // the icon class attribute gets changed to indicate the volume level on the icon itself
        this.setState({ volumeIconSuffix: result });

        // the volume of the video updates here
        this.video.volume = this.state.volumeValue;
    }

    updateProgress():void {
        let value = 0,
            currentMins:any = Math.floor(this.video.currentTime / 60),
            currentSecs:any = Math.floor(this.video.currentTime - currentMins * 60),
            durationMins:any = Math.floor(this.video.duration / 60),
            durationSecs:any = Math.floor(this.video.duration - durationMins * 60);
        
        // These four lines add 0 in front of seconds and minutes if their value is less than 10.
        currentSecs < 10 && (currentSecs = `0${currentSecs}`);
        durationSecs < 10 && (durationSecs = `0${durationSecs}`);
        currentMins < 10 && (currentMins = `0${currentMins}`);
        durationMins < 10 && (durationMins = `0${durationMins}`);

        this.video.currentTime > 0 && ( value = Math.floor((100 / this.video.duration) * this.video.currentTime) );
        this.setState({ videoProgress: value });

        // displays the time info of the currently played video
        this.timeInfo.innerHTML = `${currentMins}:${currentSecs} / ${durationMins}:${durationSecs}`;
    }

    setVideoProgress = (value: number):void => {
        let setProgress = this.video.duration * (value / 100);
    
        this.video.currentTime = setProgress;
    
        this.setState({ videoProgress: value });
    }

    fadingDone() {
        this.setState({ isFadingDone: true });
    }

    componentDidMount() {
        this.video.controls = false;
    }

    render() {
        const { volumeValue, videoProgress, isFadingDone } = this.state;
        return (
            <div className="player">
                <video 
                    // https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events
                    onTimeUpdate={() => this.updateProgress()} // timeUpdate event fires everytime the media's currentTime attribute is changed
                    ref={video => this.video = video}
                    loop
                    controls>
                    <source src="http://techslides.com/demos/sample-videos/small.webm" type="video/webm" />Your browser does not support the video tag. I suggest you upgrade your browser. 
                    <source src="http://techslides.com/demos/sample-videos/small.ogv" type="video/ogg" />Your browser does not support the video tag. I suggest you upgrade your browser. 
                    <source src="http://techslides.com/demos/sample-videos/small.mp4" type="video/mp4" />Your browser does not support the video tag. I suggest you upgrade your browser.
                    <source src="http://techslides.com/demos/sample-videos/small.3gp" type="video/3gp" />Your browser does not support the video tag. I suggest you upgrade your browser.
                </video>

                <button 
                    className={isFadingDone ? `button button--main pointer` : `button button--main pointer fade-out`}
                    onClick={() => this.togglePlayPause()}
                    onAnimationEnd={() => this.fadingDone()}
                    >
                    <i className={this.state.togglePlayText === 'Play' ? 'icon-pause-circled' : 'icon-play-circled'}></i>
                </button>

                <div className="player-interface">
                    <div id="controls">
                        <button
                            className="button button--no-outline button--play pointer"
                            ref={playPause => this.playPause = playPause}
                            title={this.state.togglePlayText}
                            onClick={() => this.togglePlayPause()}>
                            <i className={this.state.togglePlayText === 'Play' ? 'icon-play-circled' : 'icon-pause-circled'}></i>
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
                            onChange={this.setVideoProgress}
                            />
                    </div>

                    <div className="player-interface-volume">
                        <button
                            title={ this.state.toggleMuteText }
                            className="button button--no-outline pointer"
                            onClick={() => this.toggleMute()}>
                            
                            <i className={`icon-volume${this.state.volumeIconSuffix}`}></i>
                        </button>

                        <div className="slider">
                            <div className="slider-toggle">
                                <Slider
                                    ref={input => this.volume = input}
                                    min={0}
                                    max={1}
                                    value={volumeValue}
                                    onChange={this.setVolume}
                                    step={0.01}
                                    />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Player;
