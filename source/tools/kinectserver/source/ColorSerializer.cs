using Microsoft.Kinect;
using System.Windows;
using System.Windows.Media.Imaging;

namespace KinectServer
{
    // Handles color frame serialization.
    public static class ColorSerializer
    {
        // The color bitmap source.
        static WriteableBitmap _colorBitmap = null;

        // The RGB pixel values.
        static byte[] _colorPixels = null;

        // Color frame width.
        static int _colorWidth;

        // Color frame height.
        static int _colorHeight;

        // Color frame stride.
        static int _colorStride;

        // Serializes a color frame. The specified color frame returns a binary representation of the frame
        public static byte[] Serialize(this ColorImageFrame frame)
        {
            if(_colorBitmap == null)
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
