import { Tab, Tabs } from '@material-ui/core';
import React, { FunctionComponent, ReactChild, useCallback, useState } from 'react';

type Props = {
    tabLabels: string[]
}

const TabWidget: FunctionComponent<Props> = ({tabLabels, children}) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const c = children as any as ReactChild[]
    const currentChild = c[currentIndex]
    return (
        <div>
            <Header
                tabLabels={tabLabels}
                currentIndex={currentIndex}
                onChange={setCurrentIndex}
            />
            {
                currentChild
            }
        </div>
    )
}

const Header: FunctionComponent<{tabLabels: string[], currentIndex: number, onChange: (index: number) => void}> = ({tabLabels, currentIndex, onChange}) => {
    const handleChange = useCallback((event, newValue) => {
        onChange(newValue)
    }, [onChange])
    return (
        <div>
            <Tabs value={currentIndex} onChange={handleChange} variant="fullWidth">
                {
                    tabLabels.map(label => (
                        <Tab key={label} label={` ${label} `} />
                    ))
                }
            </Tabs>
            <hr />
        </div>
    )
}

export default TabWidget