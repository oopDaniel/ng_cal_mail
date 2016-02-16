angular.module('calculatorApp')
    .service('demoObjectFactory', function() {
        var NVRObj={
          itemName:'',
          storage:960,
          bandwidth:64,
          cameras:16,
          bitRate:4,
          bitRateData: {
            codec:'H.264',
            quality:'Medium',
            resolution:'Full HD (1920 x 1080)',
            FPS:30
            },
          rDays:30,
          rHours:16,
          motion:50,
          RAID:5,
          HDDsize:3
        };

        var CMSObj={
          itemName:'',
          storage:'-',
          bandwidth:64,
          cameras:16,
          bitRate:4,
          bitRateData: {
            codec:'H.264',
            quality:'Medium',
            resolution:'Full HD (1920 x 1080)',
            FPS:30
            },
          local:true,
          remoteUsers:10
        };

        this.getNVRObj = function() {
            return NVRObj;
        }

        this.getCMSObj = function() {
            return CMSObj;
        }

        this.setNVRObj = function(obj) {
            NVRObj = obj;
        }

        this.setCMSObj = function(obj) {
            CMSObj = obj;
        }

    });
