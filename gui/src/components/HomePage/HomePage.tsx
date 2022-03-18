import React, { FunctionComponent } from 'react';
import FindFile from './FindFile';

type Props = {
    width: number
    height: number
}

const HomePage: FunctionComponent<Props> = ({width, height}) => {
    // const {signedIn} = useSignedIn()

    return (
        <div style={{margin: 20}}>
            <h2>Welcome to hashio</h2>
            <p>Find a file</p>
            <FindFile />
        </div>
    )
}

export default HomePage