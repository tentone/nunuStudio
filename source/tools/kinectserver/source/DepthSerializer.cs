using Microsoft.Kinect;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows;
using System.Windows.Media.Imaging;

namespace KinectServer
{
    // Handles depth frame serialization.
    public static class DepthSerializer
    {
        // The depth bitmap source.
        static WriteableBitmap _depthBitmap = null;

        // The RGB depth values.
        static byte[] _depthPixels = null;

        // Depth frame width.
        static int _depthWidth;

        // Depth frame height.
        static int _depthHeight;

        // Depth frame stride.
        static int _depthStride;

        // The actual depth values.
        static short[] _depthData = null;

        // Serializes a depth frame.
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

            for(int depthIndex = 0, colorIndex = 0; depthIndex < _depthData.Length && colorIndex < _depthPixels.Length; depthIndex++, colorIndex += 4)
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
