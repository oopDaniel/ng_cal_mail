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
        var tmp1 = {
          rs:'VGA',
          // 1 5 10 15 20 25 30
          FPS:[0.08,0.3,0.5,0.63,0.74,0.83,0.94]
        },
        tmp2 = {
          rs:'720P (1280 x 720)',
          FPS:[0.24,0.88,1.46,1.87,2.17,2.44,2.76]
        },
        tmp3 = {
          rs:'1.3MP',
          FPS:[0.34,1.23,2.05,2.61,3.03,3.41,3.86]
        },
        tmp4 = {
          rs:'Full HD (1920 x 1080)',
          FPS:[0.54,1.98,3.28,4.18,4.85,5.46,6.18]
        },
        tmp5 = {
          rs:'3MP',
          FPS:[0.82,3.01,4.99,6.36,7.39,8.32,9.41]
        },
        tmp6 = {
          rs:'5MP',
          FPS:[1.27,4.68,7.77,9.91,11.5,12.95,14.65]
        };

        var rule = [];
        var rsList = ['VGA','720P (1280 x 720)','1.3MP',
                    'Full HD (1920 x 1080)','3MP','5MP'];
        var codecList = ['H.264'];
        var qList = ['Medium'];
        var FPSList = [1,5,10,15,20,25,30];

        rule.push(tmp1);
        rule.push(tmp2);
        rule.push(tmp3);
        rule.push(tmp4);
        rule.push(tmp5);
        rule.push(tmp6);

        this.getBitrate = function(rs, FPS) {
            return rule[rs].FPS[FPS];
        };

        this.getRsList = function() {
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
