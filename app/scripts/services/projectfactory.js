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
                      name:'project X',
                      totalStorage:789,
                      totalBandwidth:500,
                      NVR:{
                          count:2,
                          data:[
                            {
                              itemName:'park',
                              storage:30,
                              bandwidth:100,
                              cameras:10,
                              bitRate:5,
                              bitRateData: {
                                codec:'H.264',
                                quality:'M',
                                resolution:'1920x1080',
                                FPS:30
                                },
                              rDays:2,
                              rHours:4,
                              motion:50,
                              RAID:5,
                              HDDsize:3
                            },
                            {
                              itemName:'room',
                              storage:30,
                              bandwidth:100,
                              cameras:8,
                              bitRate:4,
                              bitRateData: {
                                codec:'H.264',
                                quality:'M',
                                resolution:'1920x1080',
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
                              itemName:'building',
                              cameras:15,
                              bitRate:5,
                              bitRateData: {
                                codec:'H.264',
                                quality:'M',
                                resolution:'1024x768',
                                FPS:60
                                },
                              local:true,
                              remoteUsers:10
                            },
                            {
                              itemName:'R&D dep.',
                              cameras:5,
                              bitRate:10,
                              bitRateData: {
                                codec:'H.264',
                                quality:'M',
                                resolution:'800x600',
                                FPS:60
                                },
                              local:false,
                              remoteUsers:2
                            },
                            {
                              itemName:'sales dep.',
                              cameras:4,
                              bitRate:8,
                              bitRateData: {
                                codec:'H.264',
                                quality:'M',
                                resolution:'800x600',
                                FPS:30
                                },
                              local:false,
                              remoteUsers:3
                            }
                          ]
                      }
                    },
                    {
                      name:'Plan B',
                      totalStorage:9527,
                      totalBandwidth:1234,
                      NVR:{
                          count:1,
                          data:[
                          {
                            itemName:'GitHub',
                            storage:500,
                            bandwidth:1000,
                            cameras:8,
                            bitRate:5,
                            bitRateData: {
                              codec:'H.264',
                              quality:'H',
                              resolution:'1920x1080',
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
                              itemName:'toilet',
                              cameras:4,
                              bitRate:10,
                              bitRateData: {
                                codec:'H.264',
                                quality:'H',
                                resolution:'1024x768',
                                FPS:60
                                },
                              local:true,
                              remoteUsers:10
                            },
                            {
                              itemName:'living room',
                              cameras:4,
                              bitRate:5,
                              bitRateData: {
                                codec:'H.264',
                                quality:'M',
                                resolution:'800x600',
                                FPS:30
                                },
                              local:false,
                              remoteUsers:2
                            }
                          ]
                      }
                    },
                    {
                      name:'Seeing is believing',
                      totalStorage:5566,
                      totalBandwidth:678,
                      NVR:{
                          count:0,
                          data:[]
                      },
                      CMS:{
                          count:1,
                          data:[
                            {
                              itemName:'my home',
                              cameras:8,
                              bitRate:20,
                              bitRateData: {
                                codec:'H.264',
                                quality:'H',
                                resolution:'1920x1080',
                                FPS:60
                                },
                              local:true,
                              remoteUsers:2
                            }
                          ]
                      }
                    }
                  ];

        this.getProjects = function() {
            return projects;
        };

        this.getProject = function(index) {
            return projects[index];
        };
  });

