import React, { FunctionComponent, useCallback } from 'react';
import ApplicationBar from '../ApplicationBar/ApplicationBar';
import HomePage from '../HomePage/HomePage';
import useWindowDimensions from '../misc/useWindowDimensions';
import useRoute from '../useRoute';

type Props = {

}

const MainWindow: FunctionComponent<Props> = () => {
    const {setRoute} = useRoute()
    const {width, height} = useWindowDimensions()

    const handleHome = useCallback(() => {
        setRoute({routePath: '/home'})
    }, [setRoute])

    return (
        <div>
            <div>
            <ApplicationBar
                title={"hashio"}
                onHome={handleHome}
                logo={undefined}
            />
            </div>
            <HomePage
                width={width}
                height={height - 50}
            />
        </div>
    )
}

export default MainWindow