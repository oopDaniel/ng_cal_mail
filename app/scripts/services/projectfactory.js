'use strict';

/**
 * @ngdoc service
 * @name calculatorApp.projectFactory
 * @description
 * # projectFactory
 * Service in the calculatorApp.
 */
angular.module('calculatorApp')
  .service('projectFactory', function () {
    var projects = [
                    {
                      name:"project X",
                      Storage:789,
                      Bandwidth:500,
                      Account:"andy",
                      createTime:21080603,
                      lastUpdate:21080604,
                      NVR:{
                          count:2,
                          data:[
                          {
                            item_name:"park",
                            storage:30,
                            bandwidth:100,
                            cameras:10,
                            bit_rate:5,
                            bit_rate_data: {
                              codec:"H.264",
                              quality:"M",
                              resolution:"1920x1080",
                              FPS:30
                              },
                            rDays:2,
                            rHours:4,
                            motion:50,
                            RAID:5,
                            HDDsize:3
                          },
                          {
                            item_name:"room",
                            storage:30,
                            bandwidth:100,
                            cameras:8,
                            bit_rate:4,
                            bit_rate_data: {
                              codec:"H.264",
                              quality:"M",
                              resolution:"1920x1080",
                              FPS:60
                              },
                            rDays:5,
                            rHours:10,
                            motion:50,
                            RAID:1,
                            HDDsize:3
                          }]},
                      CMS:{
                          count:1,
                          data:[
                          {
                            item_name:"building",
                            cameras:10,
                            bit_rate:5,
                            bit_rate_data: {
                              codec:"H.264",
                              quality:"L",
                              resolution:"1920x1080",
                              FPS:45
                              },
                            rDays:20,
                            rHours:24,
                            motion:50,
                            RAID:5,
                            HDDsize:3
                          }
                          ]
                      }
                    }
                  ]
