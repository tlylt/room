import {
    Avatar, AvatarBadge, AvatarGroup, Button, Popover,
    PopoverArrow, PopoverBody, PopoverCloseButton,
    PopoverContent, PopoverHeader, PopoverTrigger, Tooltip
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
const defaultGrid = () => {
    const initialGrid = []
    for (let i = 0; i < 10; i++) {
        initialGrid[i] = []
        for (let j = 0; j < 10; j++) {
            initialGrid[i][j] = {
                row: i,
                col: j,
                occupied: false,
                name: '',
            }
        }
    }
    return initialGrid
}

function makeGrid(row, col, occupied) {
    const initialGrid = []
    for (let i = 0; i < row; i++) {
        initialGrid[i] = []
        for (let j = 0; j < col; j++) {
            initialGrid[i][j] = {
                row: i,
                col: j,
                occupied: false,
                name: '',
            }
        }
    }
    occupied.forEach(occupied => {
        if (occupied.row !== -1 && occupied.col !== -1) {
            initialGrid[occupied.row][occupied.col].occupied = true
            initialGrid[occupied.row][occupied.col].name = occupied.name
        }
    })
    return initialGrid
}

const initialGrid = defaultGrid()
export default function FloorPlan({ data, gap, handleClick, name, locked, location }) {
    const getBg = (row, col) => {
        if (location.row === row && location.col === col) {
            return 'teal.300'
        } else {
            return 'teal'
        }
    }
    const [grid, setGridData] = useState(initialGrid)
    useEffect(() => {
        if (data) {
            setGridData(makeGrid(data.row, data.col, data.occupied))
        }
    }, [data])
    return (
        grid.map((row, rowIdx) => {
            return <AvatarGroup spacing='1rem' key={"row" + rowIdx}>
                {row.map((col, colIdx) => {
                    return <Popover key={"col" + colIdx} >
                        <PopoverTrigger>
                            <div className={`${colIdx === gap.col ? 'pl-10' : ''}`}>
                                {col.occupied ?
                                    <Tooltip label={col.name} hasArrow placement='auto'>
                                        <Avatar textColor={'white'} name={col.name ? col.name : rowIdx + ' ' + colIdx} bg={getBg(rowIdx, colIdx)} >
                                            <AvatarBadge boxSize='1.25em' bg='green.500' />
                                        </Avatar>
                                    </Tooltip> : <Avatar />}
                            </div>
                        </PopoverTrigger>
                        <PopoverContent>
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverHeader>Row {rowIdx + 1} Column {colIdx + 1}</PopoverHeader>
                            <PopoverBody>
                                <div>{col.name ? `Occupant: ${col.name}` : ''}</div>
                                {col.occupied ? undefined : name === '' ? <div>Enter your name below first!</div> :
                                    locked ? <div>Exit seat before you can switch!</div> :
                                        <Button onClick={() => handleClick(rowIdx, colIdx)} className="text-blue-500">Sit</Button>}
                            </PopoverBody>
                        </PopoverContent>
                    </Popover>;
                })}
            </AvatarGroup>
        })
    )
}