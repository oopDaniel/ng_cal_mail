'use strict';

/**
 * @ngdoc service
 * @name calculatorApp.formOptionsFactory
 * @description
 * # formOptionsFactory
 * Service in the calculatorApp.
 */
angular.module('calculatorApp')
    .service('optionsFactory', function () {

        var defaultRDaysStr = '30 days (1 month)';
        var defaultHddStr   = '3 TB';
        var defaultRAIDStr  = '5';

        var rDaysArr = [
            '1 day',
            '2 days',
            '4 days',
            '7 days (1 week)',
            '14 days (2 weeks)',
            '30 days (1 month)',
            '60 days (2 months)',
            '90 days (3 months)',
            'Other duration'
        ];

        var hddSizeArr = [
          '1 TB', '2 TB', '3 TB',
          '4 TB', '6 TB', 'Other'
        ];

        var RAIDArr = [
          'Non', '0', '1', '5', '10'
        ];

        this.getRDaysArr = function () {
            return rDaysArr;
        };

        this.gethddSizeArr = function () {
            return hddSizeArr;
        };

        this.getRAIDArr = function () {
            return RAIDArr;
        };


        // Set the default value for the combo boxes
        this.defaultRDays      =
            rDaysArr[ rDaysArr.indexOf(defaultRDaysStr) ];
        this.defaultHdd        =
            hddSizeArr[ hddSizeArr.indexOf(defaultHddStr) ];
        this.defaultRAIDindex  =
            RAIDArr.indexOf(defaultRAIDStr);

//-------------------------------------------------------------------------------



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

//-------------------------------------------------------


        this.getBitRate = function( res, fps ) {
            var RsList = this.getRsList();
            var bitRate = rule[ RsList.indexOf(res) ].FPS[ FPSList.indexOf(fps) ];
            return bitRate;
        };

        this.hoursFix = function (hours) {
            return hours > 24 ? 24 : hours;
        };

        this.getEstDays = function(days, hours, motion) {
            var estDay = days * motion / 100 * hours / 24;
            return Math.ceil(estDay);
        };


//------------------------------------------------
        this.getMinHDD = function( storage, HDDsize, RAID ) {
            var hdd = parseInt(HDDsize);
            var minHDD = Math.ceil( storage / hdd / 1024 );
            switch ( RAID ) { // RAID Rule
                case '1':
                    minHDD *= 2;
                    break;
                case '5':
                    minHDD += 1;
                    break;
                case '10':
                    minHDD *= 2;
                    if ( minHDD < 4 ) {
                        minHDD *= 2;
                    }
                    break;
                default:
            }
            var ModelSets = Math.ceil( minHDD / 8 );
            minHDD = minHDD > 8 ? 8 : minHDD;
            return [ minHDD, ModelSets ];
        };
//------------------------------------------------



  });
