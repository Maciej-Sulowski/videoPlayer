import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Player from './components/player';
import Playlist from './components/playlist';
import './styles/styles.scss';

class App extends React.Component {
    constructor() {
        super();
    }

    render() {
        return(
            <div>
                <Player></Player>
                <Playlist></Playlist>
            </div>
        );
    }
}

ReactDOM.render(<App/>, document.querySelector('#app'));
