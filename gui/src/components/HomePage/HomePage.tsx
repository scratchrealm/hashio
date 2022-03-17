import React, { FunctionComponent } from 'react';
import { useSignedIn } from '../googleSignIn/GoogleSignIn';
import MainPanel from '../MainWindow/MainPanel';
import Splitter from '../Splitter/Splitter';

type Props = {
    width: number
    height: number
}

const HomePage: FunctionComponent<Props> = ({width, height}) => {
    const {signedIn} = useSignedIn()

    return (
        <div>
            <Splitter
                width={width}
                height={height}
                initialPosition={Math.min(400, width/3)}
            >
                {
                    signedIn ? (
                        <MainPanel
                            key="main"
                            width={0}
                            height={0}
                        />
                    ) : <span>Sign in</span>
                }
            </Splitter>
        </div>
    )
}

export default HomePage