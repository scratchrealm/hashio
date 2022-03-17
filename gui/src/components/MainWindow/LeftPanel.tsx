import React, { FunctionComponent } from 'react';

type Props = {
    onCancel: () => void
}

const LeftPanel: FunctionComponent<Props> = ({onCancel}) => {
    return (
        <div>
            Left panel
        </div>
    )
}

export default LeftPanel