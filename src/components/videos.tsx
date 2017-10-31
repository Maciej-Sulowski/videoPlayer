import * as React from 'react';

interface IProps {
    props: string[];
}


const videos: React.StatelessComponent<IProps> = (props):any => {
    console.log(props);
    let playlist = [1, 2, 3, 4];

    let video = playlist.map((videoTitle, index) => {
        console.log(video);
        return (
            <a key={index} href="">{videoTitle}</a>
        );
    });

    return (
        <div className="pointer">{ video }</div>
    );
}

export default videos;