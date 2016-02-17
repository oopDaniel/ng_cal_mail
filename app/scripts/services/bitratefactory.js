'use strict';

/**
 * @ngdoc service
 * @name calculatorApp.bitrateFactory
 * @description
 * # bitrateFactory
 * Service in the calculatorApp.
 */
angular.module('calculatorApp')
    .service('bitrateFactory', function () {
        var rule = [
          { // 1 5 10 15 20 25 30
              rs:'VGA',
              FPS:[0.08,0.3,0.5,0.63,0.74,0.83,0.94]
          },
          {
              rs:'720P (1280 x 720)',
              FPS:[0.24,0.88,1.46,1.87,2.17,2.44,2.76]
          },
          {
              rs:'1.3MP',
              FPS:[0.34,1.23,2.05,2.61,3.03,3.41,3.86]
          },
          {
              rs:'Full HD (1920 x 1080)',
              FPS:[0.54,1.98,3.28,4.18,4.85,5.46,6.18]
          },
          {
              rs:'3MP',
              FPS:[0.82,3.01,4.99,6.36,7.39,8.32,9.41]
          },
          {
              rs:'5MP',
              FPS:[1.27,4.68,7.77,9.91,11.5,12.95,14.65]
          }
        ];

        var codecList = ['H.264'];
        var qList = ['Medium'];
        var FPSList = [1,5,10,15,20,25,30];

        this.getBitrate = function(rs, FPS) {
            return rule[rs].FPS[FPS];
        };

        this.getRsList = function() {
            var rsList = [];
            for ( var i in rule ) {
                rsList.push(rule[i].rs);
            }
            return rsList;
        };

        this.getCodecList = function() {
            return codecList;
        };

        this.getQList = function() {
            return qList;
        };

        this.getFPSList = function() {
            return FPSList;
        };

    });
