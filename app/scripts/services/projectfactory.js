'use strict';

/**
 * @ngdoc service
 * @name calculatorApp.projectFactory
 * @description
 * # projectFactory
 * Service in the calculatorApp.
 */
angular.module('calculatorApp')
  .service('projectFactory', function() {
    var projects = [
                    {
                      name:"project X",
                      totalStorage:789,
                      totalBandwidth:500,
                      user:"andy",
                      createTime:1450221938631,
                      lastUpdate:1452221938631,
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
                            }
                          ]
                      },
                      CMS:{
                          count:3,
                          data:[
                            {
                              item_name:"building",
                              cameras:15,
                              bit_rate:5,
                              bit_rate_data: {
                                codec:"H.264",
                                quality:"M",
                                resolution:"1024x768",
                                FPS:60
                                },
                              local:true,
                              remote_users:10
                            },
                            {
                              item_name:"R&D dep.",
                              cameras:5,
                              bit_rate:10,
                              bit_rate_data: {
                                codec:"H.264",
                                quality:"M",
                                resolution:"800x600",
                                FPS:60
                                },
                              local:false,
                              remote_users:2
                            },
                            {
                              item_name:"sales dep.",
                              cameras:4,
                              bit_rate:8,
                              bit_rate_data: {
                                codec:"H.264",
                                quality:"M",
                                resolution:"800x600",
                                FPS:30
                                },
                              local:false,
                              remote_users:3
                            }
                          ]
                      }
                    },
                    {
                      name:"Plan B",
                      totalStorage:9527,
                      totalBandwidth:1234,
                      user:"john123",
                      createTime:1454221938631,
                      lastUpdate:1454221940631,
                      NVR:{
                          count:1,
                          data:[
                          {
                            item_name:"GitHub",
                            storage:500,
                            bandwidth:1000,
                            cameras:8,
                            bit_rate:5,
                            bit_rate_data: {
                              codec:"H.264",
                              quality:"H",
                              resolution:"1920x1080",
                              FPS:60
                              },
                            rDays:20,
                            rHours:12,
                            motion:10,
                            RAID:5,
                            HDDsize:6
                          }]
                      },
                      CMS:{
                          count:2,
                          data:[
                            {
                              item_name:"toilet",
                              cameras:4,
                              bit_rate:10,
                              bit_rate_data: {
                                codec:"H.264",
                                quality:"H",
                                resolution:"1024x768",
                                FPS:60
                                },
                              local:true,
                              remote_users:10
                            },
                            {
                              item_name:"living room",
                              cameras:4,
                              bit_rate:5,
                              bit_rate_data: {
                                codec:"H.264",
                                quality:"M",
                                resolution:"800x600",
                                FPS:30
                                },
                              local:false,
                              remote_users:2
                            }
                          ]
                      }
                    },
                    {
                      name:"Seeing is believing",
                      totalStorage:9527,
                      totalBandwidth:1234,
                      user:"bob",
                      createTime:1412221938631,
                      lastUpdate:1416221940631,
                      NVR:{
                          count:0,
                          data:[]
                      },
                      CMS:{
                          count:1,
                          data:[
                            {
                              item_name:"my home",
                              cameras:8,
                              bit_rate:20,
                              bit_rate_data: {
                                codec:"H.264",
                                quality:"H",
                                resolution:"1920x1080",
                                FPS:60
                                },
                              local:true,
                              remote_users:2
                            }
                          ]
                      }
                    }
                  ];

    this.getProjects = function() {
        return projects;
    }

    this.getProject = function(index) {
        return index;
    }
