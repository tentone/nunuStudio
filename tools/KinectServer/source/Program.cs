using System;
using System.Collections.Generic;
using System.Linq;
using Fleck;
using Microsoft.Kinect;
using System.Runtime.InteropServices;

namespace KinectServer
{
    class Program
    {
        [DllImport("kernel32.dll")]
        static extern IntPtr GetConsoleWindow();
        [DllImport("user32.dll")]
        static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
        const int CONSOLE_HIDE = 0;
        const int CONSOLE_SHOW = 5;

        static List<IWebSocketConnection> _clients = new List<IWebSocketConnection>();
        static Skeleton[] _skeletons = new Skeleton[6];
        static Mode _mode = Mode.Color;
        static CoordinateMapper _coordinateMapper;

        static void Main(string[] args)
        {
            ShowWindow(GetConsoleWindow(), CONSOLE_HIDE);

            Console.WriteLine("Websocket Microsoft Kinect Server");

            try
            {
                InitializeConnection();
                InitilizeKinect();
            }
            catch (Exception e)
            {
                System.Environment.Exit(1);
            }
            Console.ReadLine();
        }

        private static void InitializeConnection()
        {
            var server = new WebSocketServer("ws://127.0.0.1:8181");
          
            server.Start(socket =>
            {
                socket.OnOpen = () =>
                {
                    _clients.Add(socket);
                };

                socket.OnClose = () =>
                {
                    _clients.Remove(socket);
                };

                socket.OnMessage = message =>
                {
                    switch (message)
                    {
                        case "Color":
                            _mode = Mode.Color;
                            break;
                        case "Depth":
                            _mode = Mode.Depth;
                            break;
                        default:
                            break;
                    }

                    Console.WriteLine("Mode switched to " + message);
                };
            });
        }

        private static void InitilizeKinect()
        {
            KinectSensor sensor = null;
            try
            {
                sensor = KinectSensor.KinectSensors[0];
            }
            catch (Exception e)
            {
                Console.WriteLine("No kinect sensor found");

            }
            if(sensor != null)
            {
                sensor.ColorStream.Enable();
                sensor.DepthStream.Enable();
                sensor.SkeletonStream.Enable();

                sensor.AllFramesReady += Sensor_AllFramesReady;
                _coordinateMapper = sensor.CoordinateMapper;

                sensor.Start();
            }
        }

        static void Sensor_AllFramesReady(object sender, AllFramesReadyEventArgs e)
        {
            using(var frame = e.OpenColorImageFrame())
            {
                if(frame != null)
                {
                    if(_mode == Mode.Color)
                    {
                        var blob = frame.Serialize();

                        foreach(var socket in _clients)
                        {
                            socket.Send(blob);
                        }
                    }
                }
            }

            using(var frame = e.OpenDepthImageFrame())
            {
                if(frame != null)
                {
                    if(_mode == Mode.Depth)
                    {
                        var blob = frame.Serialize();

                        foreach(var socket in _clients)
                        {
                            socket.Send(blob);
                        }
                    }
                }
            }

            using(var frame = e.OpenSkeletonFrame())
            {
                if(frame != null)
                {
                    frame.CopySkeletonDataTo(_skeletons);

                    var users = _skeletons.Where(s => s.TrackingState == SkeletonTrackingState.Tracked).ToList();

                    if(users.Count > 0)
                    {
                        string json = users.Serialize(_coordinateMapper, _mode);

                        foreach(var socket in _clients)
                        {
                            socket.Send(json);
                        }
                    }
                }
            }
        }
    }
}
