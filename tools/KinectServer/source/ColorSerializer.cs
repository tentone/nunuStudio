using Microsoft.Kinect;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows;
using System.Windows.Media;
using System.Windows.Media.Imaging;

namespace Kinect.Server
{
    /// <summary>
    /// Handles color frame serialization.
    /// </summary>
    public static class ColorSerializer
    {
        /// <summary>
        /// The color bitmap source.
        /// </summary>
        static WriteableBitmap _colorBitmap = null;

        /// <summary>
        /// The RGB pixel values.
        /// </summary>
        static byte[] _colorPixels = null;

        /// <summary>
        /// Color frame width.
        /// </summary>
        static int _colorWidth;

        /// <summary>
        /// Color frame height.
        /// </summary>
        static int _colorHeight;

        /// <summary>
        /// Color frame stride.
        /// </summary>
        static int _colorStride;

        /// <summary>
        /// Serializes a color frame.
        /// </summary>
        /// <param name="frame">The specified color frame.</param>
        /// <returns>A binary representation of the frame.</returns>
        public static byte[] Serialize(this ColorImageFrame frame)
        {
            if (_colorBitmap == null)
            {
                _colorWidth = frame.Width;
                _colorHeight = frame.Height;
                _colorStride = _colorWidth * Constants.PIXEL_FORMAT.BitsPerPixel / 8;
                _colorPixels = new byte[frame.PixelDataLength];
                _colorBitmap = new WriteableBitmap(_colorWidth, _colorHeight, Constants.DPI, Constants.DPI, Constants.PIXEL_FORMAT, null);
            }

            frame.CopyPixelDataTo(_colorPixels);

            _colorBitmap.WritePixels(new Int32Rect(0, 0, _colorWidth, _colorHeight), _colorPixels, _colorStride, 0);

            return FrameSerializer.CreateBlob(_colorBitmap, Constants.CAPTURE_FILE_COLOR);
        }
    }
}
