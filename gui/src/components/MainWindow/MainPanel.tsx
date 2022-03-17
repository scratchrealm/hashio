import React, { FunctionComponent } from 'react';

type Props = {
    width: number
    height: number
}

const MainPanel: FunctionComponent<Props> = ({width}) => {
    return (
        <div style={{marginLeft: 10}}>
            Test
        </div>
    )
}

export default MainPanel