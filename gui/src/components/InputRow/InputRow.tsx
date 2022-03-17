import { TableCell, TableRow } from "@material-ui/core"
import { FunctionComponent, useCallback } from "react"

type InputRowProps = {
    label: string
    value: string
    onChange: (newValue: string) => void
}

const InputRow: FunctionComponent<InputRowProps> = ({label, value, onChange}) => {
    const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
        onChange(e.target.value as string)
    }, [onChange])
    return (
        <TableRow>
            <TableCell>{label}</TableCell>
            <TableCell>
                <input type="text" value={value} onChange={handleChange} />
            </TableCell>
        </TableRow>
    )
}

export default InputRow