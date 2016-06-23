var app = angular.module('myApp', ['hawkular.charts']);

app.controller('TimelineController', function ($scope, $timeout) {

    var numberOfWindows = 30;
    $scope.timeRangeOptions = [
        {label: '24 Hours',  value: 24, uom: 'hours' },
        {label: '7 days',  value: 7, uom: 'days' },
        {label: '30 days',  value: 30, uom: 'days' },
        {label: '60 days',  value: 60, uom: 'days' },
        {label: '90 days',  value: 90, uom: 'days' },
        {label: 'Custom....',  value: undefined, uom: undefined }
    ];

    var eventColors = [
        '#ce8888', '#0088ce', '#ec7a08', '#88ce88', '#ceab88'
    ];

    $scope.selectedEvents = [];
    $scope.timeline = {showLabels: false,
        startTime: +moment().subtract(30, 'days'),
        endTime: +moment(),
        timeRange: '30d'};
    $scope.contextTime = {
        startTime: +moment().subtract(30, 'days'),
        endTime: +moment()
    };

    $scope.$on(Charts.EventNames.TIMELINE_CHART_TIMERANGE_CHANGED, function (event, data) {
        console.info('Received TimelineChartTimeRangeChanged: ' + data[0] + ' - ' + data[1]);
        $scope.contextTime.startTime = new Date(data[0]).getTime();
        $scope.contextTime.endTime = new Date(data[1]).getTime();
        $scope.$digest();
    });

    $scope.$on(Charts.EventNames.CONTEXT_CHART_TIMERANGE_CHANGED, function (event, data) {
        $scope.timeline.startTime = new Date(data[0]).getTime();
        $scope.timeline.endTime = new Date(data[1]).getTime();
        $scope.filterTimelineByDateRange();
    });
    function eventAlreadySelected(event) {
        for (var i = 0; i < $scope.selectedEvents.length; i++) {
            if (event.resource === $scope.selectedEvents[i].resource) {
                return true;
            }
        }
        return false;
    }

    $scope.$on(Charts.EventNames.TIMELINE_CHART_DOUBLE_CLICK_EVENT, function (event, data) {
        console.info('Received TimelineChartDoubleClickEvent: ' + data.resource);
        if (!eventAlreadySelected(data)) {
            $scope.selectedEvents.push(data);
            console.table($scope.selectedEvents);
        }
        $scope.$digest();
    });

    $scope.timeChange = function () {
        var newVal = $scope.timeline.timeRange;
        console.log('ng-change');
        console.dir(newVal);
        $scope.timeline.startTime = +moment().subtract(newVal.value, newVal.uom);
        $scope.timeline.endTime = +moment();
        $scope.contextTime.startTime = +moment().subtract(newVal.value, newVal.uom);
        $scope.contextTime.endTime = +moment();

        // this little hack is needed or else we get '$digets already in progress
        $timeout(function() {
            console.log('refresh with timeout fired');
            $scope.getNewData();
        });
    };

    $scope.getNewData = function () {
        console.info('get random Event Data');
        var randomNumberOfPoints = Charts.Random.randomBetween(5, 30);

        $scope.timelineEvents = Charts.TimelineEvent.buildFakeEvents(randomNumberOfPoints, $scope.timeline.startTime,
            $scope.timeline.endTime);
        angular.forEach($scope.timelineEvents, function (event) {
            event.color = eventColors[event.row - 1];
            event.eventSource = 'test resource';
        });
        $scope.events = $scope.timelineEvents;
        initOverviewData();
    };

    $scope.formatData = function(jsonData) {
        return jsonData.map(function (obj) {
            return obj.data.map(function (dataObject) {
                var details = dataObject.details;
                return {
                    timestamp: new Date(dataObject.date).getTime(),
                    eventSource: details.object,
                    resource: details.event,
                    message: 'No message given'
                }
            });
        });
    };

    $scope.filterTimelineByDateRange = function () {
        console.info('filterTimelineByDateRange');

        $scope.events = $scope.timelineEvents.filter(function (value) {
            return value.timestamp >= $scope.timeline.startTime
                && value.timestamp <= $scope.timeline.endTime;
        });
        console.log('New Timerange Events Selected: ' + $scope.events.length);
        $scope.$digest();
    };

    function initOverviewData () {
        var overviewData = [];
        var diffTime = $scope.timeline.endTime - $scope.timeline.startTime;
        var separTime = Math.round(diffTime / numberOfWindows);
        for (var i=0; i<= numberOfWindows; i++) {
            overviewData.push(createItem($scope.timeline.startTime + separTime*i, 0, false));
        }
        angular.forEach($scope.timelineEvents, function(item) {
            var index = Math.round((item.timestamp - $scope.timeline.startTime)/(separTime));
            overviewData[index] = incrementValue(overviewData[index]);
        });
        $scope.overviewData = overviewData;
    }

    function createItem(timestamp, value, empty) {
        return {
            timestamp: timestamp,
            value: value,
            avg: value,
            min: value,
            max: value,
            percentile95th: value,
            median: value,
            empty: empty
        };
    }

    function incrementValue(item) {
        item.value++;
        item.avg++;
        item.max++;
        item.min++;
        item.percentile95th++;
        item.median++;
        return item;
    }

    $scope.getNewData();

});