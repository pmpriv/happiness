import React from "react";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button, ButtonGroup } from '@mui/material';
import { useHappinessByYearQuery } from "./HappinessAPI";
import { GeoMap } from "../geo-map/GeoMap";
import { DataRecord } from "../../model/model";
import { BubbleVis } from "../bubble-vis/BubbleVis";
import "./HappinessView.css";
import { selectHappiness, years, HappinessSlice } from "./HappinessSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

const columns = getGridColumnsConfig();

/** Secondary dimensions (other than score) for Bubble Visualization */
const dimensions = {
    GDPpercapita: 'GDP per capita',
    Socialsupport: 'Social support',
    Healthylifeexpectancy: 'Healthy life expectancy',
    Freedomtomakelifechoices: 'Freedom to make life choices',
    Generosity: 'Social support',
    Perceptionsofcorruption: 'Perceptions of corruption',
};

function getRowId(row: DataRecord) {
    return row.ISO_A3;
}

export function HappinessView() {
    const dispatch = useAppDispatch();
    const { year } = useAppSelector(selectHappiness);
    const { data, isLoading, isFetching } = useHappinessByYearQuery(year);

    const inProgress = isLoading || isFetching;
    const progressIndicator = inProgress &&
        <img style={{ marginLeft: '4px' }} width={14} src="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.3/images/loading.gif" />;

    const bubbleData = React.useMemo(() => (data ?? []), [data]);
    const mapData = React.useMemo(() => new Map(data?.map(r => [r.ISO_A3, r.Score])), [data]);

    const setYear = (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>, year: number) => {
        ev.stopPropagation();
        dispatch(HappinessSlice.actions.setYear(year));
    };

    const getMapTooltip = React.useCallback((id: string) => {
        const datum = data?.find(d => d.ISO_A3 === id);
        return datum ? getLabel(datum) : null;
    }, [data]);

    return (
        <div className="happiness-view">
            <ButtonGroup variant="outlined" aria-label="outlined primary button group">
                {years.map(y => (
                    <Button
                        variant={y === year ? 'contained' : 'outlined'}
                        onClick={ev => setYear(ev, y)}
                    >{y} {y === year && progressIndicator}</Button>
                ))}
            </ButtonGroup>
            <div className="section">
                <GeoMap
                    width={800}
                    height={400}
                    data={mapData}
                    getTooltip={getMapTooltip}
                />
            </div>

            <div className="section">
                <DataGrid
                    loading={inProgress}
                    rows={data ?? []} 
                    getRowId={getRowId}
                    columns={columns}
                    density="compact"
                    pagination={true}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 30 } }
                    }}
                />
            </div>

            <div className="section" style={{ minWidth: '90%' }}>
                <BubbleVis
                    data={bubbleData as unknown[] as Array<Record<string, unknown>>}
                    dimensions={dimensions}
                    defaultXAxisProperty="GDPpercapita"
                    yAxisProperty="Score"
                    getLabel={getLabel}
                />
            </div>
        </div>
    );
}

function getFlagUrl(isoA2: string) {
    return `https://unpkg.com/flagpack@1.0.5/flags/1x1/${isoA2.toLowerCase()}.svg`;
}

function getLabel(datum: Record<string, unknown> | DataRecord) {
    const r = datum as unknown as DataRecord;
    return [
        `Country: ${r.Countryorregion}`,
        `Score: ${r.Score}`,
        ...Object.entries(dimensions).map(([key, desc]) => `${desc}: ${datum[key as keyof DataRecord]}`),
    ];
}

function getGridColumnsConfig(): GridColDef[] {
    return [
        {
            field: 'Overallrank',
            headerName: 'Rank',
            type: 'number',
            width: 110,
        },
        {
            field: 'Countryorregion',
            headerName: 'Country',
            renderCell: (c) => <>{ c.row['ISO_A2'] && <img style={{ marginRight: '4px' }} src={getFlagUrl(c.row['ISO_A2']) } /> }{c.value}</>,
            width: 230,
        },
        {
            field: 'Score',
            headerName: 'Score',
            description: 'Happiness Score',
            type: 'number',
            width: 110,
        },
        {
            field: 'GDPpercapita',
            headerName: 'GDP/cap.',
            description: 'GDP per capita',
            type: 'number',
            width: 130,
        },
        {
            field: 'Socialsupport',
            headerName: 'Social support',
            type: 'number',
            width: 160,
        },
        {
            field: 'Healthylifeexpectancy',
            headerName: 'Health',
            description: 'Healthy life expectancy',
            type: 'number',
            width: 110,
        },
        {
            field: 'Freedomtomakelifechoices',
            headerName: 'Freedom',
            description: 'Freedom to make life choices',
            type: 'number',
            width: 130,
        },
        {
            field: 'Generosity',
            headerName: 'Generosity',
            type: 'number',
            width: 140,
        },
        {
            field: 'Perceptionsofcorruption',
            headerName: 'Corruption (perc.)',
            description: 'Perceptions of corruption',
            type: 'number',
            width: 200,
        },
    ];
}
