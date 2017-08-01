import React from 'react';

export default class Video extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
        paused: true,
        seekBarValue: 0,
        currentTime: 0,
        duration: 0
    };
    this.startedSeek = false;
  }

  componentDidMount() {
      this.volumeCheck();
  }

  toHumanTime(time) {
      let minutes = parseInt(time / 60);
      let seconds = parseInt(time % 60);
      if (seconds < 10) {
          seconds = `0${seconds}`;
      }
      if (minutes < 10) {
          minutes = `0${minutes}`;
      }
      return `${minutes}:${seconds}`;
  }

    playPause() {
        this.state.paused ? this.play() : this.pause();
    }

    pause() {
        this.refs.player.pause();
        this.setState({paused: true});
    }

    play() {
        this.refs.player.play();
        this.setState({paused: false});
    }

    next() {
        let player = this.refs.player;
        let time = player.currentTime + 10;
        player.currentTime = time;
        this.setState({
            currentTime: time
        });
    }

    prev() {
        let player = this.refs.player;
        let time = player.currentTime - 10;
        player.currentTime = time;
        this.setState({
            currentTime: time
        });
    }

    fullScreen() {
        let player = this.refs.player;

        if (player.requestFullscreen) {
            player.requestFullscreen();
        } else if (player.mozRequestFullScreen) {
            player.mozRequestFullScreen();
        } else if (player.webkitRequestFullscreen) {
            player.webkitRequestFullscreen();
        }
    }

    onChange() {
        let player = this.refs.player;

        // If video finished
        if (player.currentTime === player.duration) {
          this.setState({ paused: true });
        }

        this.setState({
            currentTime: player.currentTime,
            duration: player.duration
        });

        if (!this.startedSeek) {
            this.refs.videoTime.style.width = player.currentTime / player.duration * 100 + '%';
        }
    }

    move(e) {
        let player = this.refs.player;
        let time = player.duration * e.target.value;
        player.currentTime = time;
        this.setState({
            seekBarValue: e.target.value
        });

    }

    volumeCheck() {
        let $el = $(this.refs.volumeBackground);
        let width = $el.width();
        this.refs.volumeProgress.style.width = (width *  this.refs.player.volume) + 'px';
    }

    volumeChange(e) {
      let $el = $(e.target);
      let width = $el.width();
      let volume = (e.pageX - $el.offset().left)/width;

      this.refs.player.volume = volume;
      this.refs.volumeProgress.style.width = (width * volume) + 'px';
    }

    startMove(e) {
        this.seekBarUpdateWidth(e);
        this.startedSeek = true;
    }

    seek(e) {
        if (this.startedSeek)
            this.seekBarUpdateWidth(e);
    }

    stopMove(e) {
        if (!this.startedSeek) {
            return;
        }
        this.startedSeek = false;
        let toPart = this.seekBarUpdateWidth(e);

        this.refs.player.currentTime = this.refs.player.duration * toPart;
    }

    seekBarUpdateWidth(e) {
        let $el = $(e.target);
        let width = $(this.refs.videoTimeBackground).width();
        let toPart = (e.pageX - $el.offset().left)/width;

        this.refs.videoTime.style.width = (width * toPart) + 'px';
        return toPart;
    }

    get controls() {
        return (
            <div className="video-controls">
                <div className="video-progress-background"
                     onMouseDown={this.startMove.bind(this)}
                     onMouseMove={this.seek.bind(this)}
                     onMouseUp={this.stopMove.bind(this)}
                     onMouseLeave={this.stopMove.bind(this)}
                     ref="videoTimeBackground"
                ></div>
                <div className="video-progress" ref="videoTime"></div>
                {this.time}
                <div className="video-play-buttons">
                    <div className="video-prev-button" onClick={this.prev.bind(this)}></div>
                    <div className={"video-play-player".concat(this.state.paused ? '' : ' paused')} onClick={this.playPause.bind(this)}></div>
                    <div className="video-next-player" onClick={this.next.bind(this)}></div>
                </div>

                <div className="video-volume">
                    <div className="video-volume-background"  ref="volumeBackground" onClick={this.volumeChange.bind(this)}></div>
                    <div className="video-volume-progress" ref="volumeProgress"></div>
                </div>
                <div className="video-full-screen" onClick={this.fullScreen.bind(this)}></div>
            </div>
        );
    }

    get time() {
        return (
            <div className="video-time noselect">
                {this.toHumanTime(this.state.currentTime)} / {this.toHumanTime(this.state.duration)}
            </div>
        );
    }

    render() {
      return (
          <div className="video-container">

             <video width="100%"
                poster={ this.props.poster }
                onClick={this.playPause.bind(this)}
                onTimeUpdate={this.onChange.bind(this)} ref="player">
                <source src={this.props.step.body} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
           
              {this.controls}
          </div>
      );
    }
}
