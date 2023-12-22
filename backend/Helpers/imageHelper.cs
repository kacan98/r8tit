using System.Security.Cryptography.X509Certificates;
using Dapper;
using ImageMagick;
using R8titAPI.Data;


namespace R8titAPI.Helpers
{
    public class ImageHelper
    {
        private readonly SqlHelper _sqlHelper;
        private readonly DataContextDapper _dapper;
        public ImageHelper(IConfiguration config)
        {
            _sqlHelper = new SqlHelper(config);
            _dapper = new DataContextDapper(config);
        }

        public IFormFile ConvertToJpg(IFormFile file)
        {
            using MagickImage image = new(file.OpenReadStream());

            using MemoryStream ms = new();
            image.Format = MagickFormat.Jpeg;
            image.Write(ms);
            ms.Position = 0;

            return new FormFile(ms, 0, ms.Length, file.Name, $"{Path.GetFileNameWithoutExtension(file.FileName)}.jpg");
        }

        public IFormFile CompressImage(IFormFile file, int maxSizeInKb, int quality)
        {
            if (file.Length == 0)
            {
                throw new Exception("Image is empty");
            }

            if (file.Length > 20000000)
            {
                throw new Exception("Image is too big. It must be less than 20MB");
            }

            if (quality < 5 || quality > 100)
            {
                throw new Exception("Quality must be between 5 and 100");
            }

            if (file.Length < maxSizeInKb)
            {
                return file;
            }

            using var image = new MagickImage(file.OpenReadStream());

            // Calculate the new quality of the image
            var size = file.Length / 1024;
            byte[] imageBytes = Array.Empty<byte>();

            if (size > 5000000) // Check if the size is greater than 5MB
            {
                throw new Exception("Image is too big. It must be less than 5MB");
            }

            while (size > maxSizeInKb)
            {
                quality -= 5;
                if (quality < 5)
                {
                    throw new Exception("Unable to compress image enough to meet the size requirement.");
                }
                var ms = new MemoryStream();
                image.Quality = quality;
                image.Write(ms);
                imageBytes = ms.ToArray();
                size = imageBytes.Length / 1024;
            }

            return new FormFile(new MemoryStream(imageBytes), 0, imageBytes.Length, file.Name, file.FileName);
        }
    }
}