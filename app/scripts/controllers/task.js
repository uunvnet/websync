/**
 * Created by furier on 06/04/14.
 */
'use strict';

app.controller('TaskCtrl', function ($scope, taskManager, socket) {

    var timeout = null;
    var task = $scope.task;
    var log = $scope.log = [];
    $scope.logCollapsed = false;

    var save = function (newVal, oldVal) {
        if (newVal != oldVal) {
            if (task.first) {
                task.first = false;
                return;
            }
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(function () {
                taskManager.saveTask(task);
            }, 5000);
        }
    };

    socket.on('task.finished.' + task.id, function (data) {
        if (data && data.error)
            log.push({
                type: 'list-group-item-danger',
                msg: data.error
            });
        else
            log.push({
                type: 'list-group-item-success',
                msg: 'Task finished Successfully!'
            });
    });

    socket.on('task.progress.' + task.id, function (data) {
        log.push({
            type: 'list-group-item-info',
            msg: data
        });
    });

    socket.on('task.error.' + task.id, function (data) {
        log.push({
            type: 'list-group-item-danger',
            msg: data
        });
    });

    $scope.$watch('task.name', save);
    $scope.$watch('task.source', save);
    $scope.$watch('task.destination', save);
    $scope.$watch('task.shell', save);
    $scope.$watchCollection('task.flags', save);

});