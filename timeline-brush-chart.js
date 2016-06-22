var app = angular.module('myApp', ['hawkular.charts']);

app.controller('TimelineController', function ($scope, $timeout) {
    $scope.timeRangeOptions = [
        {label: '24 Hours',  value: 24, uom: 'hours' },
        {label: '7 days',  value: 7, uom: 'days' },
        {label: '30 days',  value: 30, uom: 'days' },
        {label: '60 days',  value: 60, uom: 'days' },
        {label: '90 days',  value: 90, uom: 'days' },
        {label: 'Custom....',  value: undefined, uom: undefined }
    ];

    console.log("Starting Event Timeline Tester");
    $scope.selectedEvents = [];
    $scope.timeline = {showLabels: false,
        startTime: +moment().subtract('days', 30),
        endTime: +moment(),
        timeRange: '30d'};

    $scope.$on(Charts.EventNames.TIMELINE_CHART_TIMERANGE_CHANGED, function (event, data) {
        console.info('Received TimelineChartTimeRangeChanged: ' + data[0] + ' - ' + data[1]);
        $scope.timeline.startTime = data[0];
        $scope.timeline.endTime = data[1];
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
        $scope.timeline.starTime = +moment().subtract(newVal.uom, newVal.startTimestamp);
        $scope.timeline.endTime = +moment();
        // this little hack is needed or else we get '$digets already in progress
        $timeout(function() {
            console.log('refresh with timeout fired')
            $scope.getNewData();
        }, 1000);
    };

    $scope.getNewData = function () {
        console.info('get random Event Data');
        var randomNumberOfPoints = Charts.Random.randomBetween(5, 30);

        $scope.events = Charts.TimelineEvent.buildFakeEvents(randomNumberOfPoints, $scope.timeline.startTime,
            $scope.timeline.endTime);
    };

    $scope.filterTimelineByDateRange = function () {
        console.info('filterTimelineByDateRange');

        $scope.events = $scope.events.filter(function (value) {
            return new Date(value.timestamp) >= $scope.timeline.startTime
                && new Date(value.timestamp) <= $scope.timeline.endTime;
        });
        console.log('New Timerange Events Selected: ' + $scope.events.length);
        console.table($scope.events);
        $scope.$digest();
    };

    $scope.getNewData();

});