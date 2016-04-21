using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using Microsoft.Kinect;
using System.Windows;

namespace KinectServer
{
    //Serializes a Kinect skeleton to JSON fromat.
    public static class SkeletonSerializer
    {
        [DataContract]
        class JSONSkeletonCollection
        {
            [DataMember(Name = "skeletons")]
            public List<JSONSkeleton> Skeletons { get; set; }
        }

        [DataContract]
        class JSONSkeleton
        {
            [DataMember(Name = "id")]
            public string ID { get; set; }

            [DataMember(Name = "joints")]
            public List<JSONJoint> Joints { get; set; }
        }

        [DataContract]
        class JSONJoint
        {
            [DataMember(Name = "name")]
            public string Name { get; set; }

            [DataMember(Name = "x")]
            public double X { get; set; }

            [DataMember(Name = "y")]
            public double Y { get; set; }

            [DataMember(Name = "z")]
            public double Z { get; set; }
        }

        //Serializes an array of Kinect skeletons into an array of JSON skeletons.The Kinect skeletons.The coordinate mapper.Mode (color or depth)
        public static string Serialize(this List<Skeleton> skeletons, CoordinateMapper mapper, Mode mode)
        {
            JSONSkeletonCollection jsonSkeletons = new JSONSkeletonCollection { Skeletons = new List<JSONSkeleton>() };

            foreach (var skeleton in skeletons)
            {
                JSONSkeleton jsonSkeleton = new JSONSkeleton
                {
                    ID = skeleton.TrackingId.ToString(),
                    Joints = new List<JSONJoint>()
                };

                foreach (Joint joint in skeleton.Joints)
                {
                    Point point = new Point();

                    switch (mode)
                    {
                        case Mode.Color:
                            ColorImagePoint colorPoint = mapper.MapSkeletonPointToColorPoint(joint.Position, ColorImageFormat.RgbResolution640x480Fps30);
                            point.X = colorPoint.X;
                            point.Y = colorPoint.Y;
                            break;
                        case Mode.Depth:
                            DepthImagePoint depthPoint = mapper.MapSkeletonPointToDepthPoint(joint.Position, DepthImageFormat.Resolution640x480Fps30);
                            point.X = depthPoint.X;
                            point.Y = depthPoint.Y;
                            break;
                        default:
                            break;
                    }

                    jsonSkeleton.Joints.Add(new JSONJoint
                    {
                        Name = joint.JointType.ToString().ToLower(),
                        X = joint.Position.X,
                        Y = joint.Position.Y,
                        Z = joint.Position.Z
                    });
                }

                jsonSkeletons.Skeletons.Add(jsonSkeleton);
            }

            return Serialize(jsonSkeletons);
        }

        //Serializes an object to JSON.
        private static string Serialize(object obj)
        {
            DataContractJsonSerializer serializer = new DataContractJsonSerializer(obj.GetType());

            using (MemoryStream ms = new MemoryStream())
            {
                serializer.WriteObject(ms, obj);

                return Encoding.Default.GetString(ms.ToArray());
            }
        }
    }
}
