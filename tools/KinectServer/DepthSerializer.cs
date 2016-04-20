using Microsoft.Kinect;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows;
using System.Windows.Media.Imaging;

namespace Kinect.Server
{
    /// <summary>
    /// Handles depth frame serialization.
    /// </summary>
    public static class DepthSerializer
    {
        /// <summary>
        /// The depth bitmap source.
        /// </summary>
        static WriteableBitmap _depthBitmap = null;

        /// <summary>
        /// The RGB depth values.
        /// </summary>
        static byte[] _depthPixels = null;

        /// <summary>
        /// Depth frame width.
        /// </summary>
        static int _depthWidth;

        /// <summary>
        /// Depth frame height.
        /// </summary>
        static int _depthHeight;

        /// <summary>
        /// Depth frame stride.
        /// </summary>
        static int _depthStride;

        /// <summary>
        /// The actual depth values.
        /// </summary>
        static short[] _depthData = null;

        /// <summary>
        /// Serializes a depth frame.
        /// </summary>
        /// <param name="frame">The specified depth frame.</param>
        /// <returns>A binary representation of the frame.</returns>
        public static byte[] Serialize(this DepthImageFrame frame)
        {
            if (_depthBitmap == null)
            {
                _depthWidth = frame.Width;
                _depthHeight = frame.Height;
                _depthStride = _depthWidth * Constants.PIXEL_FORMAT.BitsPerPixel / 8;
                _depthData = new short[frame.PixelDataLength];
                _depthPixels = new byte[_depthHeight * _depthWidth * 4];
                _depthBitmap = new WriteableBitmap(_depthWidth, _depthHeight, Constants.DPI, Constants.DPI, Constants.PIXEL_FORMAT, null);
            }

            frame.CopyPixelDataTo(_depthData);

            for (int depthIndex = 0, colorIndex = 0; depthIndex < _depthData.Length && colorIndex < _depthPixels.Length; depthIndex++, colorIndex += 4)
            {
                // Get the depth value.
                int depth = _depthData[depthIndex] >> DepthImageFrame.PlayerIndexBitmaskWidth;

                // Equal coloring for monochromatic histogram.
                byte intensity = (byte)(255 - (255 * Math.Max(depth - Constants.MIN_DEPTH_DISTANCE, 0) / (Constants.MAX_DEPTH_DISTANCE_OFFSET)));

                _depthPixels[colorIndex + 0] = intensity;
                _depthPixels[colorIndex + 1] = intensity;
                _depthPixels[colorIndex + 2] = intensity;
            }

            _depthBitmap.WritePixels(new Int32Rect(0, 0, _depthWidth, _depthHeight), _depthPixels, _depthStride, 0);

            return FrameSerializer.CreateBlob(_depthBitmap, Constants.CAPTURE_FILE_DEPTH);
        }
    }
}
