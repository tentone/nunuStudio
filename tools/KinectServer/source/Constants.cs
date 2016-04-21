using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows.Media;

namespace KinectServer
{
    class Constants
    {
        public static readonly float MAX_DEPTH_DISTANCE = 4095;
        public static readonly float MIN_DEPTH_DISTANCE = 850;
        public static readonly double DPI = 96.0;
        public static readonly float MAX_DEPTH_DISTANCE_OFFSET = MAX_DEPTH_DISTANCE - MIN_DEPTH_DISTANCE;

        public static readonly string CAPTURE_FILE_COLOR = "color.jpg";
        public static readonly string CAPTURE_FILE_DEPTH = "depth.jpg";

        public static readonly PixelFormat PIXEL_FORMAT = PixelFormats.Bgra32;
    }
}
