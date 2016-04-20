using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows.Media;

namespace Kinect.Server
{
    class Constants
    {
        /// <summary>
        /// Maximmum depth distance.
        /// </summary>
        public static readonly float MAX_DEPTH_DISTANCE = 4095;

        /// <summary>
        /// Minimum depth distance.
        /// </summary>
        public static readonly float MIN_DEPTH_DISTANCE = 850;

        /// <summary>
        /// DPI.
        /// </summary>
        public static readonly double DPI = 96.0;

        /// <summary>
        /// Maximum depth distance offset.
        /// </summary>
        public static readonly float MAX_DEPTH_DISTANCE_OFFSET = MAX_DEPTH_DISTANCE - MIN_DEPTH_DISTANCE;

        /// <summary>
        /// Default name for temporary color files.
        /// </summary>
        public static readonly string CAPTURE_FILE_COLOR = "Capture_Color.jpg";

        /// <summary>
        /// Default name for temporary depth files.
        /// </summary>
        public static readonly string CAPTURE_FILE_DEPTH = "Capture_Depth.jpg";

        /// <summary>
        /// The pixel format.
        /// </summary>
        public static readonly PixelFormat PIXEL_FORMAT = PixelFormats.Bgra32;
    }
}
