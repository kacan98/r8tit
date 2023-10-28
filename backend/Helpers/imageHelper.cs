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

        public IFormFile CompressImage(IFormFile file, int maxSizeInKb, int quality)
        {
            using var image = new MagickImage(file.OpenReadStream());

            // Calculate the new quality of the image
            var size = file.Length / 1024;
            byte[] imageBytes = Array.Empty<byte>();

            if (size > 5000000) // Check if the size is greater than 5MB
            {
                throw new Exception("Image is too big. It must be less than 10MB");
            }

            while (size > maxSizeInKb)
            {
                Console.WriteLine("quality: " + quality);
                quality -= 5;
                if (quality < 5)
                {
                    throw new Exception("Unable to compress image enough to meet the size requirement. Consider increasing the maximum size or choosing a different image.");
                }
                var ms = new MemoryStream();
                image.Quality = quality;
                image.Write(ms);
                imageBytes = ms.ToArray();
                size = imageBytes.Length / 1024;
            }

            var compressedImage = new FormFile(new MemoryStream(imageBytes), 0, imageBytes.Length, file.Name, file.FileName)
            {
                Headers = file.Headers,
                ContentType = file.ContentType
            };
            Console.WriteLine("compressedImage: " + compressedImage);

            if (size > 10000000)
            {
                throw new Exception("Image is too big. It must be less than 10MB");
            }
            Console.WriteLine("size: " + size);

            return compressedImage;
        }


    }
}