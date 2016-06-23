/// <reference path="../../../typings/tsd.d.ts" />
declare namespace Charts {
    class HistogramChart extends AbstractHistogramChart {
        name: string;
        drawChart(chartOptions: Charts.ChartOptions, stacked?: boolean): void;
    }
}
