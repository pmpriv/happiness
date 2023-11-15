import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select/SelectInput";
import React from "react";
import { VictoryAxis, VictoryChart, VictoryScatter, VictoryTooltip } from "victory";
import "./BubbleVis.css";

type Data = Record<string, unknown>;

interface BubbleVisProps {
    data: Record<string, unknown>[];
    getLabel: (datum: Data) => string[];

    /* Map of dimension field to name */
    dimensions: Record<string, string>;
    yAxisProperty: string;
    defaultXAxisProperty: string;
}

/** Bubble Visualization with Dimensions Picker */
export function BubbleVis({ defaultXAxisProperty, data, dimensions, yAxisProperty, getLabel }: BubbleVisProps) {
    const [xAxisProperty, setXAxisProperty] = React.useState(defaultXAxisProperty);
    const [bubbleOption, setBubbleOption] = React.useState('none');

    const bubbleOptions: Record<string, string> = { none: 'None', ...dimensions };
    const bubbleProperty = bubbleOption !== 'none' ? bubbleOption : undefined;

    const xAxisDescription = dimensions[xAxisProperty] ?? xAxisProperty;
    const bubblePropertyDescription = bubbleOptions[bubbleOption] ?? bubbleOption;

    const handleXChange = React.useCallback((ev: SelectChangeEvent<string>) => {
        setXAxisProperty(ev.target.value)
    }, []);
    const handleBubbleChange = React.useCallback((ev: SelectChangeEvent<string>) => {
        setBubbleOption(ev.target.value)
    }, []);


    return (
        <div className="bubblevis">
            <div className="bubblevis_row" style={{ display: 'flex' }}>
                <FormControl>
                    <InputLabel>xAxis</InputLabel>
                    <Select
                        value={xAxisProperty}
                        label={xAxisDescription}
                        onChange={handleXChange}
                    >
                        {
                            Object.entries(dimensions).map(([field, desc]) =>
                                <MenuItem key={field} value={field}>{desc}</MenuItem>
                            )
                        }
                    </Select>
                </FormControl>
                <FormControl>
                    <InputLabel>Bubble</InputLabel>
                    <Select
                        value={bubbleOption}
                        label={bubblePropertyDescription}
                        onChange={handleBubbleChange}
                    >
                        {
                            Object.entries(bubbleOptions).map(([opt, desc]) =>
                                <MenuItem key={opt} value={opt}>{desc}</MenuItem>
                            )
                        }
                    </Select>
                </FormControl>
            </div>
            {
            data.length &&
                <VictoryChart>
                    <VictoryAxis
                        label={xAxisDescription}
                        style={{
                            axis: { stroke: "#756f6a" },
                            axisLabel: { fontSize: 8 },
                            ticks: { stroke: "grey", size: 5 },
                            tickLabels: { fontSize: 8, padding: 5 }
                        }}
                    />
                    <VictoryAxis
                        dependentAxis
                        label={yAxisProperty}
                        style={{
                            axis: { stroke: "#756f6a" },
                            axisLabel: { fontSize: 8, padding: 35 },
                            ticks: { stroke: "grey", size: 5 },
                            tickLabels: { fontSize: 8, padding: 5 }
                        }}
                    />
                    <VictoryScatter
                        style={{
                            data: { fill: "#c1e80787", stroke: "#c1e807", strokeWidth: 1 },
                        }}
                        labels={({ datum }: { datum: Data }) => getLabel(datum)}
                        labelComponent={<VictoryTooltip style={{ fontSize: 5 }} />}
                        x={xAxisProperty}
                        y={yAxisProperty}
                        bubbleProperty={bubbleProperty}
                        maxBubbleSize={7}
                        minBubbleSize={1}
                        data={data}
                    />
                </VictoryChart>
            }
        </div>
    );
}
