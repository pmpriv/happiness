import React, { useEffect } from 'react';
import { scaleQuantize } from '@visx/scale';
import { Mercator, Graticule } from '@visx/geo';
import { withTooltip, Tooltip } from '@visx/tooltip';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { FeatureShape, loadWorldTopology, selectGeoMap } from './GeoMapSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';

export const background = '#f9f7e8';

export type GeoMapProps = {
  width: number;
  height: number;
  /** Map from iso_a3 to value */
  data: Map<string, number>;
  getTooltip: (id: string) => string[] | null;
  onClick?: (country_iso_a3: string) => void;
};

interface TooltipData {
  id: string;
  header: string;
  details: string[];
}

const tooltip = {
  defaultMargin: { top: 40, left: 50, right: 40, bottom: 100 },
  styles: {
    minWidth: 60,
    backgroundColor: 'rgba(0,0,0,0.9)',
    color: 'white',
  },
};

let tooltipTimeout: number;

export const GeoMap = withTooltip<GeoMapProps, TooltipData>(function GeoMap({
  width,
  height,
  data,
  onClick,
  getTooltip,
  tooltipOpen,
  tooltipLeft,
  tooltipTop,
  tooltipData,
  hideTooltip,
  showTooltip,
}: GeoMapProps & WithTooltipProvidedProps<TooltipData>) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadWorldTopology());
  }, [dispatch]);

  const { status, world } = useAppSelector(selectGeoMap);
  const centerX = width / 2;
  const centerY = height / 2;
  const scale = (width / 630) * 100;

  const color = React.useMemo(() => 
    scaleQuantize({
        domain: [
            Math.min(...data.values()),
            Math.max(...data.values()),
        ],
        range: ['#124962', '#189586', '#1DCA6C', '#20E16B', '#2EF468', '#45FF66'],
    }),
    [data],
  );

  return (
    status === 'loading' ?
      <div>Loading</div>
    : status === 'failed' ?
      <div>Failed to load world map</div>
    : world && data ?
      <div>
        <svg width={width} height={height}>
          <rect x={0} y={0} width={width} height={height} fill={background} rx={14} />
          <Mercator<FeatureShape>
            data={world.features as FeatureShape[]}
            scale={scale}
            translate={[centerX, centerY + 50]}
          >
            {(mercator) => (
              <g>
                <Graticule graticule={(g) => mercator.path(g) || ''} stroke="rgba(33,33,33,0.05)" />
                {
                  mercator.features.map(({ feature, path, centroid }) => (
                    <path
                        key={`map-feature-${feature.id}`}
                        d={path || ''}
                        fill={color(data.get(feature.id) ?? 0)}
                        stroke={background}
                        strokeWidth={0.5}
                        onClick={() => {
                            if (onClick) {
                                onClick(feature.id);
                            }
                        }}
                        onMouseLeave={() => {
                          tooltipTimeout = window.setTimeout(() => {
                            hideTooltip();
                          }, 100);
                        }}
                        onMouseMove={() => {
                          if (tooltipTimeout) clearTimeout(tooltipTimeout);
                            const tooltipStrings = getTooltip(feature.id);
                          if (tooltipStrings && tooltipStrings.length >= 0) {
                            const [header, ...details] = tooltipStrings;
                            const [x, y] = centroid;
                            const top = y + tooltip.defaultMargin.top;
                            const left = x + width + tooltip.defaultMargin.left;
                            showTooltip({
                              tooltipData: { id: feature.id, header, details },
                              tooltipTop: top,
                              tooltipLeft: left,
                            });
                          }
                        }}
                    />
                  ))
                }
              </g>
            )}
          </Mercator>
        </svg>
        {tooltipOpen && tooltipData && (
          <Tooltip top={tooltipTop} left={tooltipLeft} style={tooltip.styles}>
            <div>
              <strong>{tooltipData.header}</strong>
            </div>
            {
              tooltipData.details.map((d, i) => <div key={i}>{d}</div>)
            }
          </Tooltip>
        )}
      </div>
    : null
  );
});
